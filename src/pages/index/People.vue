<template>
  <v-row align="center" justify="space-between">
    <v-col cols="auto">
      <p class="text-h5">人物</p>
    </v-col>
  </v-row>

  <v-divider class="my-4"></v-divider>

  <div>
    <v-skeleton-loader
      v-if="isLoading"
      type="card"
      width="200"
      class="mr-2"
    ></v-skeleton-loader>

    <div v-else-if="error">
      <v-alert type="error" variant="text" title="出错了">
        {{ error.message }}
      </v-alert>
    </div>

    <div v-else-if="people" class="d-flex flex-wrap">
      <v-card
        v-for="person in people"
        :key="person._id"
        width="200"
        max-width="200"
        class="ma-4 pb-4"
        link
        :to="`/person/${person._id}`"
      >
        <v-img
          :src="person.reference_face_base64 ? `data:image/jpeg;base64, ${person.reference_face_base64}` : '/src/assets/image-placeholder.svg'"
          height="200px"
          cover
        ></v-img>

        <v-card-title class="">{{ person.name || '未知人物' }}</v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { useAsyncState } from '@vueuse/core'
import request from '/src/request.js';

// 获取用户的人物列表
const {
  state: people,
  error,
  isLoading,
  execute,
} = useAsyncState(async () => {
  try {
    const response = await request({
      method: 'get',
      url: '/people',
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
