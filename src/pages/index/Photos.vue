<template>
  <div v-if="isLoading" class="d-flex">
    <v-skeleton-loader type="image" width="300" class="mr-2"></v-skeleton-loader>
    <v-skeleton-loader type="image" width="300" class="mr-2"></v-skeleton-loader>
    <v-skeleton-loader type="image" width="300" class="mr-2"></v-skeleton-loader>
  </div>
  <div v-else-if="error">
    <v-alert type="error" variant="text" title="出错了">
      {{ error.message }}
    </v-alert>
  </div>
  <div v-else-if="photos">
    <div v-for="photo in photos" :key="photo._id">
      <img :src="photo.src" alt="">
      {{ photo.src }}
    </div>
  </div>
</template>

<script setup>
import { useAsyncState } from '@vueuse/core'
import request from '/src/request.js';

/**
 * 获取用户照片列表
 */
const {
  state: photos,
  error,
  isLoading,
} = useAsyncState(async () => {
  try {
    const response = await request({
      method: 'get',
      url: '/photos',
    });

    return response.data.data;
  } catch (err) {
    if (err.name === 'AxiosError') {
      throw new Error(err.response.data?.msg || '服务异常！');
    }

    throw err;
  }
});

</script>

<style scoped>

</style>
