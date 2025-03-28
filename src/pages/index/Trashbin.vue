<template>
  <v-toolbar
    v-if="selected.length"
    app
    flat
    class="lighten-surface toolbar"
  >
    <template v-slot:prepend>
      <v-btn icon="mdi-close" @click="selected.length = 0"></v-btn>
    </template>

    <v-toolbar-title :text="`已选择 ${ selected.length } 项内容`"></v-toolbar-title>

    <template v-slot:append>
      <v-btn icon="mdi-restore" title="恢复" @click="onClickUntrash"></v-btn>
      <v-btn icon="mdi-delete-forever" title="删除" @click="onClickDelete"></v-btn>
      <v-btn icon="mdi-dots-vertical" title="更多选项"></v-btn>
    </template>
  </v-toolbar>

  <v-row align="center" justify="space-between">
    <v-col cols="auto">
      <p class="text-h5">回收站</p>
    </v-col>
    <v-col cols="auto">
      <v-btn
        variant="text"
        prepend-icon="mdi-delete-forever-outline"
        @click="onClickDeleteAll"
      >清空回收站</v-btn>
    </v-col>
  </v-row>

  <v-divider class="my-4"></v-divider>

  <div>
    <v-skeleton-loader
      v-if="isLoading && !state?.photos?.length"
      type="image"
      width="200"
      class="mr-2"
    ></v-skeleton-loader>

    <div v-else-if="error">
      <v-alert type="error" variant="text" title="出错了">
        {{ error.message }}
      </v-alert>
    </div>

    <v-item-group v-model="selected" multiple class="d-flex flex-wrap">
      <v-item
        v-for="photo in (state?.photos || [])"
        :key="photo._id"
        :value="photo._id"
        v-slot="{ isSelected, toggle }"
      >
        <div
          class="ma-1 photo"
          :class="[
            isSelected && 'photo--selected',
            isAnyOneSelected && 'photo--waiting_selected',
          ]"
          @click="() => isAnyOneSelected ? toggle() : previewPhoto(photo)"
        >
          <v-img
            :src="photo.src"
            :lazy-src="photo.src"
            :width="200"
            :max-width="200"
            :aspect-ratio="1"
            class="photo__img"
            cover
          >
            <!-- 图片加载失败时显示的默认图片 -->
            <template v-slot:error>
              <v-img height="200" width="200" src="/src/assets/image-placeholder.svg"></v-img>
            </template>
          </v-img>

          <v-checkbox-btn
            :model-value="isSelected"
            @click.stop="toggle"
            class="photo__checkbox"
            color="primary"
          ></v-checkbox-btn>
        </div>
      </v-item>
    </v-item-group>
  </div>
  <v-btn @click="nextPage">下一页</v-btn>

  <v-snackbar v-model="snackbar"> {{ snackbarText }} </v-snackbar>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAsyncState } from '@vueuse/core'
import request from '/src/request.js';

// 获取用户照片列表
const {
  state,
  error,
  isLoading,
  execute,
} = useAsyncState(async (args) => {
  try {
    const response = await request({
      method: 'get',
      url: '/photos',
      params: {
        pagesize: 5,
        cursor: args?.cursor,
        mode: 'trashed',
      },
    });

    return {
      photos: args?.cursor
        ? [...state.value?.photos, ...response.data.data] // 有游标视为加载下一页，需要组合响应数据到旧数据中
        : response.data.data, // 没有游标说明是第一次请求或者刷新数据，直接覆盖旧数据
      cursor: response.data.cursor,
    };
  } catch (e) {
    if (e.name === 'AxiosError') {
      throw new Error(e.response.data?.msg || '服务异常！');
    }

    throw e;
  }
}, {
  photos: [],
  cursor: null,
}, {
  resetOnExecute: false, // 请求完成才覆盖 state 以避免页面“闪烁”
});

function nextPage() {
  execute(0, { cursor: state.value?.cursor });
}

// 选中的照片列表
const selected = ref([]);
const isAnyOneSelected = computed(() => !!selected.value?.length);

// 刷新照片列表；同时取消所有选中
function refreshPhotos() {
  selected.value.length = 0;
  execute();
}

function previewPhoto(photo) {
  console.log('TODO: previewPhoto: ', photo);
}

// 是否显示 snackbar
const snackbar = ref(false);
const snackbarText = ref('');

// 恢复选中的照片
// TODO: 此处恢复照片之后，回到照片页面还需手动刷新一下才能看到恢复的照片，需要优化
async function onClickUntrash() {
  try {
    const response = await request({
      method: 'patch',
      url: '/photos',
      data: {
        ids: selected.value,
        updates: {
          status: null,
        },
      },
    });

    if ('modifiedCount' in response.data.data) {
      snackbarText.value = `已恢复 ${ response.data.data.modifiedCount } 张照片。`;
    } else {
      snackbarText.value = response.data.msg;
    }
    snackbar.value = true;

    refreshPhotos();
  } catch (e) {
    console.error(e);
    snackbarText.value = e.name === 'AxiosError'
      ? e.response.data?.msg || '服务异常！'
      : e.message;
    snackbar.value = true;
  }
}

// 永久删除选中的照片
async function onClickDelete() {
  if (confirm(`选中的 ${ selected.value?.length } 张照片将被永久删除，无法恢复。`)) {
    console.log(selected.value);
    try {
      const response = await request({
        method: 'patch',
        url: '/photos',
        data: {
          ids: selected.value,
          updates: {
            status: 'deleted',
          },
        },
      });

      if ('modifiedCount' in response.data.data) {
        snackbarText.value = `已永久删除 ${ response.data.data.modifiedCount } 张照片。`;
      } else {
        snackbarText.value = response.data.msg;
      }
      snackbar.value = true;

      refreshPhotos();
    } catch (e) {
      console.error(e);
      snackbarText.value = e.name === 'AxiosError'
        ? e.response.data?.msg || '服务异常！'
        : e.message;
      snackbar.value = true;
    }
  }
}

// 清空回收站
async function onClickDeleteAll() {
  if (confirm(`永久删除回收站中的所有照片？`)) {
    try {
      const response = await request({
        method: 'delete',
        url: '/photos/trashed',
      });

      if ('modifiedCount' in response.data.data) {
        snackbarText.value = `已永久删除 ${ response.data.data.modifiedCount } 张照片。`;
      } else {
        snackbarText.value = response.data.msg;
      }
      snackbar.value = true;

      refreshPhotos();
    } catch (e) {
      console.error(e);
      snackbarText.value = e.name === 'AxiosError'
        ? e.response.data?.msg || '服务异常！'
        : e.message;
      snackbar.value = true;
    }
  }
}

defineExpose({
  refreshPhotos,
});
</script>

<style scoped>
.toolbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
}

.photo {
  width: 200px;
  height: 200px;
  max-width: 200px;
  max-height: 200px;
  overflow: hidden;
  position: relative;
  transition: .2s;
  background-color: #e9eef6;
}

.photo__img {
  transition: .2s;
}

.photo__checkbox {
  position: absolute;
  top: 8px;
  left: 8px;
  display: none;
}

.photo--waiting_selected .photo__checkbox,
.photo--selected .photo__checkbox,
.photo:hover .photo__checkbox {
  display: block;
}

.photo--selected .photo__img {
  transform: scale(0.8);
  border-radius: 6px;
}

.v-theme--light .lighten-surface {
  --v-theme-surface-light: 240, 244, 249;
}
</style>
