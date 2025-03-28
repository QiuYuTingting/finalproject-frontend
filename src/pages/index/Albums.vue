<template>
  <v-row align="center" justify="space-between">
    <v-col cols="auto">
      <p class="text-h5">相册</p>
    </v-col>
    <v-col cols="auto">
      <v-btn
        variant="text"
        prepend-icon="mdi-plus"
        @click="onClickCreateAlbum"
      >新建相册</v-btn>
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

    <div v-else-if="albums" class="d-flex flex-wrap">
      <v-card
        v-for="album in albums"
        :key="album._id"
        width="200"
        max-width="200"
        class="ma-4 pb-4"
        link
        :to="`/album/${album._id}`"
      >
        <v-img
          :src="album.cover || '/src/assets/image-placeholder.svg'"
          :lazy-src="album.cover || '/src/assets/image-placeholder.svg'"
          height="200px"
          cover
        ></v-img>

        <v-card-title class="">{{ album.name }}</v-card-title>

        <v-card-subtitle class="">{{ album.created_at }}</v-card-subtitle>
      </v-card>
    </div>
  </div>

</template>

<script setup>
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { useAsyncState } from '@vueuse/core'
import request from '/src/request.js';

const router = useRouter();

function onClickCreateAlbum() {
  router.push('/album/new');
}

// 获取用户相册列表（一次获取全部相册）
const {
  state: albums,
  error,
  isLoading,
  execute,
} = useAsyncState(async () => {
  try {
    const response = await request({
      method: 'get',
      url: '/albums',
    });

    return response.data.data?.map((album) => ({
      ...album,
      created_at: album.created_at
        ? dayjs(album.created_at).format('YYYY年MM月DD日')
        : '',
    }));
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
