<template>
  <v-row align="center" justify="space-between">
    <v-col cols="auto">
      <div v-if="personIsLoading">加载中……</div>
      <div v-else-if="personError">{{ personError.message }}</div>
      <div v-else class="d-flex">
        <v-avatar size="32" class="border border-white mr-4" color="primary">
          <v-img :src="person?.reference_face_base64 ? `data:image/jpeg;base64, ${person.reference_face_base64}` : '/src/assets/image-placeholder.svg'"></v-img>
        </v-avatar>
        <p class="text-h5">{{ person?.name || '未知人物' }}</p>
      </div>
    </v-col>
    <v-col cols="auto">
      <v-btn variant="text" icon title="编辑姓名" @click="dialog = true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-col>
  </v-row>

  <v-divider class="my-4"></v-divider>

  <div>
    <v-skeleton-loader
      v-if="isLoading"
      type="image"
      width="200"
      class="mr-2"
    ></v-skeleton-loader>

    <div v-else-if="error">
      <v-alert type="error" variant="text" title="出错了">
        {{ error.message }}
      </v-alert>
    </div>

    <div v-else-if="state" class="d-flex flex-wrap">
      <div
        v-for="photo in (state?.photos || [])"
        :key="photo._id"
        class="ma-1 photo"
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
      </div>
    </div>

    <v-btn @click="nextPage">下一页</v-btn>
  </div>

  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title>给人物命名</v-card-title>
      <v-card-text>
        <v-text-field v-model="nameInput" label="姓名" outlined></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">取消</v-btn>
        <v-btn color="primary" @click="onSubmitName">提交</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar"> {{ snackbarText }} </v-snackbar>
</template>

<script setup>
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router';
import request from '/src/request.js';

const route = useRoute();
const router = useRouter();

// 是否显示 snackbar
const snackbar = ref(false);
const snackbarText = ref('');

// 获取人物详情
const {
  state: person,
  error: personError,
  isLoading: personIsLoading,
  execute: getPerson,
} = useAsyncState(async () => {
  try {
    const response = await request({
      method: 'get',
      url: `/people/${route.params.id}`,
    });

    return response.data.data;
  } catch (e) {
    if (e.name === 'AxiosError') {
      throw new Error(e.response.data?.msg || '服务异常！');
    }

    throw e;
  }
});

// 获取含有当前人物的所有照片
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
        person_id: route.params.id,
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

const dialog = ref(false);
const nameInput = ref('');

async function onSubmitName() {
  if (!nameInput.value) return;

  try {
    await request({
      method: 'patch',
      url: '/people',
      data: {
        ids: [route.params.id],
        updates: {
          name: nameInput.value,
        },
      },
    });

    getPerson(); // 重新加载人物详情
    snackbarText.value = '修改成功';
    snackbar.value = true;
    dialog.value = false; // 关闭弹框
  } catch (e) {
    if (e.name === 'AxiosError') {
      snackbarText.value = e.response.data?.msg || '服务异常！'
    } else {
      snackbarText.value = e.message;
    }

    snackbar.value = true;
  }
}
</script>

<style scoped>
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
</style>
