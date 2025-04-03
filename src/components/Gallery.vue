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
      <slot name="actions"></slot>
      <v-btn v-if="!hideTrashBtn" icon="mdi-delete" title="移至回收站" @click="onClickTrashbin"></v-btn>
    </template>
  </v-toolbar>

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

    <v-row justify="center" class="mt-4">
      <v-col cols="auto">
        <v-btn @click="nextPage" variant="text">下一页</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAsyncState } from '@vueuse/core'
import { useRouter } from 'vue-router';
import request from '/src/request.js';

const router = useRouter();

const props = defineProps({
  extraParams: Object,
  // 隐藏“移至回收站”按钮
  // 由于大多数地方都需要将照片“移至回收站”的功能，将这个能力保留在组件中是合适的；
  // 但总有不需要此功能的地方，例如，已经在回收站中时，应该隐藏此按钮。
  hideTrashBtn: Boolean,
});

// 选中的照片列表
const selected = defineModel('selected', { default: [] });
const isAnyOneSelected = computed(() => !!selected.value?.length);

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
        pagesize: 50,
        cursor: args?.cursor,
        ...(props.extraParams || {}),
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

function refresh() {
  selected.value = []; // 取消选中
  execute(0);
}

function previewPhoto(photo) {
  router.push(`/photo/${photo._id}`);
}

// 移至回收站
async function onClickTrashbin() {
  if (confirm(`确认将选中的 ${ selected.value?.length } 张照片移至回收站吗？`)) {
    try {
      await request({
        method: 'patch',
        url: '/photos',
        data: {
          ids: selected.value,
          updates: {
            status: 'trashed',
          },
        },
      });

      refresh();
    } catch (e) {
      console.error(e);
      const errmsg = e.name === 'AxiosError'
        ? e.response.data?.msg || '服务异常！'
        : e.message;

      alert(errmsg);
    }
  }
}

defineExpose({
  refresh,
});
</script>

<style scoped>
.toolbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
}

.v-theme--light .lighten-surface {
  --v-theme-surface-light: 240, 244, 249;
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
</style>
