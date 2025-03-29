<template>
  <v-row align="center" justify="space-between">
    <v-col cols="auto">
      <p class="text-h5">{{ album?.name || '相册' }}</p>
    </v-col>
    <v-col cols="auto">
      <v-btn variant="text" icon title="删除相册" @click="onClickDeleteAlbum">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>

  <v-divider class="my-4"></v-divider>

  <v-snackbar v-model="snackbar"> {{ snackbarText }} </v-snackbar>
</template>

<script setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import { useRoute, useRouter } from 'vue-router';
import { useAsyncState } from '@vueuse/core';
import request from '/src/request.js';

const route = useRoute();
const router = useRouter();

// 获取相册详情
const {
  state: album,
  error,
  isLoading,
  execute,
} = useAsyncState(async () => {
  try {
    const response = await request({
      method: 'get',
      url: `/albums/${route.params.id}`,
    });

    const album = response.data.data;

    album.created_at = album.created_at
      ? dayjs(album.created_at).format('YYYY年MM月DD日')
      : ''

    return album;
  } catch (e) {
    if (e.name === 'AxiosError') {
      throw new Error(e.response.data?.msg || '服务异常！');
    }

    throw e;
  }
});

// 是否显示 snackbar
const snackbar = ref(false);
const snackbarText = ref('');

// 点击删除相册
async function onClickDeleteAlbum() {
  if (confirm(`相册一经删除便无法恢复。不过，已删除相册中的照片仍会保留`)) {
    try {
      await request({
        method: 'delete',
        url: `/albums/${route.params.id}`,
      });

      router.replace('/albums');
    } catch (e) {
      console.error(e);
      snackbarText.value = e.name === 'AxiosError'
        ? e.response.data?.msg || '服务异常！'
        : e.message;
      snackbar.value = true;
    }
  }
}
</script>

<style scoped>

</style>
