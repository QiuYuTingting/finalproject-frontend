<template>
  <v-row align="center" justify="space-between">
    <v-col cols="auto">
      <p class="text-h5">{{ album?.name || '相册' }}</p>
    </v-col>
    <v-col cols="auto">
      <v-btn variant="text" icon title="添加照片" @click="showPhotosSelector = true">
        <v-icon>mdi-plus-box-multiple</v-icon>
      </v-btn>
      <v-btn variant="text" icon title="删除相册" @click="onClickDeleteAlbum">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>

  <v-divider class="my-4"></v-divider>

  <Gallery ref="GalleryRef" v-model:selected="selected" :extraParams="{ album_id: route.params.id }"></Gallery>

  <v-snackbar v-model="snackbar"> {{ snackbarText }} </v-snackbar>

  <PhotosSelector
    v-model:show="showPhotosSelector"
    :excludeAlbum="album"
    @change="onSelectNewPhotos"
  ></PhotosSelector>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { useRoute, useRouter } from 'vue-router';
import { useAsyncState } from '@vueuse/core';
import request from '/src/request.js';

const route = useRoute();
const router = useRouter();

// 获取相册详情
const {
  state: album,
  error, // TODO 模仿 person 页面展示错误信息
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

// 选中的照片列表
const selected = ref([]); // TODO: 开发从相册中移除照片的功能
const GalleryRef = ref(null);

function refreshPhotos() {
  showPhotosSelector.value = false;
  selected.value = false;
  GalleryRef.value?.refresh();
}

// 显示添加照片对话框
const showPhotosSelector = ref(false);

// 将新照片添加到相册
async function onSelectNewPhotos(newPhotos) {
  if (!Array.isArray(newPhotos) || !newPhotos.length) {
    showPhotosSelector.value = false;
    return;
  }

  try {
    const response = await request({
      method: 'patch',
      url: '/photos',
      data: {
        ids: newPhotos,
        updates: {
          'albums__append_one': route.params.id,
        },
      },
    });

    const { matchedCount, modifiedCount } = response.data.data;

    snackbarText.value = matchedCount && modifiedCount
      ? `已将 ${modifiedCount} 个照片（共 ${matchedCount} 个）添加到相册`
      : response.data.msg;
    snackbar.value = true;

    refreshPhotos();
  } catch (e) {
    console.error(e);
    snackbarText.value = e.name === 'AxiosError'
      ? e.response.data?.msg || '服务异常！'
      : e.message;
    snackbar.value = true;
  }
}

onMounted(() => {
  if (route.query.mode === 'add_photos') {
    showPhotosSelector.value = true;
  }
});
</script>

<style scoped>

</style>
