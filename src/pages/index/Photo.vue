<template>
  <v-row align="center" justify="space-between">
    <v-col cols="auto">
      <div v-if="isLoading">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <div v-else-if="error">
        <p class="text-error">{{ error.message }}</p>
      </div>
      <div v-else class="d-flex">
        <p class="text-h5">照片</p>
      </div>
    </v-col>
    <v-col cols="auto">
      <v-btn variant="text" icon title="删除照片">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>

  <v-divider class="my-4"></v-divider>

  <div v-if="photo">
    <v-img
      :src="photo.src"
      :lazy-src="photo.src"
      :aspect-ratio="photo.metadata.width / photo.metadata.height"
      contain
    >
      <!-- 图片加载失败时显示的默认图片 -->
      <template v-slot:error>
        <v-img height="200" width="200" src="/src/assets/image-placeholder.svg"></v-img>
      </template>
    </v-img>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router';
import request from '/src/request.js';

const route = useRoute();
const router = useRouter();

// 获取照片详情
const {
  state: photo,
  error,
  isLoading,
  execute,
} = useAsyncState(async () => {
  try {
    const response = await request({
      method: 'get',
      url: `/photos/${route.params.id}`,
    });

    return response.data.data;
  } catch (e) {
    if (e.name === 'AxiosError') {
      throw new Error(e.response.data?.msg || '服务异常！');
    }

    throw e;
  }
});

</script>

<style scoped>

</style>
