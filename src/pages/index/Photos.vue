<template>
  <div class="d-flex flex-wrap">
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

    <v-img
      v-for="photo in (photos || [])"
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

// 获取用户照片列表
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
}, {}, {
  resetOnExecute: false, // 二次执行 execute 时，请求完成才覆盖 state 以避免页面“闪烁”
});

defineExpose({
  refreshPhotos: execute,
});
</script>

<style scoped>

</style>
