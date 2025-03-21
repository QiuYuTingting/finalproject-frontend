<template>
  <div v-if="isLoading" class="d-flex">
    <v-skeleton-loader type="image" width="200" class="mr-2"></v-skeleton-loader>
    <v-skeleton-loader type="image" width="200" class="mr-2"></v-skeleton-loader>
    <v-skeleton-loader type="image" width="200" class="mr-2"></v-skeleton-loader>
  </div>
  <div v-else-if="error">
    <v-alert type="error" variant="text" title="出错了">
      {{ error.message }}
    </v-alert>
  </div>
  <div v-else-if="photos" class="d-flex flex-wrap">
    <v-img
      v-for="photo in photos"
      :key="photo._id"
      :src="photo.src"
      :lazy-src="photo.src"
      :width="200"
      :max-width="200"
      :aspect-ratio="1"
      class="ma-1"
      cover
    >
      <!-- 图片加载失败时显示的默认图片 -->
      <template v-slot:error>
        <v-img
          class="mx-auto"
          height="200"
          width="200"
          src="/src/assets/image-placeholder.svg"
        ></v-img>
      </template>
    </v-img>
  </div>
</template>

<script setup>
import { useAsyncState } from '@vueuse/core'
import request from '/src/request.js';

// TODO: 避免调用 execute 刷新列表时的页面闪烁（即重新加载所有图片）（可能需要把 photos 作为单独的 ref 对象）
// TODO: 图片加载没有利用浏览器缓存，浏览器每次都从服务器重新加载图片。可能和HTTP请求头有关
// Cache-Control: public, max-age=86400
// ETag: "abc123"
// Last-Modified: Mon, 17 Mar 2025 12:00:00 GMT


/**
 * 获取用户照片列表
 */
const {
  state: photos,
  error,
  isLoading,
  execute,
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

defineExpose({
  refreshPhotos: execute,
});
</script>

<style scoped>

</style>
