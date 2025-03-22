<template>
  <div class="d-flex flex-wrap">
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

    <v-img
      v-for="photo in (state?.photos || [])"
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
  <v-btn @click="nextPage">下一页</v-btn>
</template>

<script setup>
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
      },
    });

    return {
      photos: args?.cursor
        ? [...state.value?.photos, ...response.data.data] // 有游标视为加载下一页，需要组合响应数据到旧数据中
        : response.data.data, // 没有游标说明是第一次请求或者刷新数据，直接覆盖旧数据
      cursor: response.data.cursor,
    };
  } catch (err) {
    if (err.name === 'AxiosError') {
      throw new Error(err.response.data?.msg || '服务异常！');
    }

    throw err;
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

defineExpose({
  refreshPhotos: execute,
});
</script>

<style scoped>

</style>
