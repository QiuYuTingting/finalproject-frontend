<template>
  <PageToolbar
    :isLoading="isLoading"
    :error="error"
    :title="album?.name || '相册'"
    showBack
  >
    <template v-slot:prepend>
    </template>
    <template v-slot:actions>
      <v-btn variant="text" icon title="添加照片" @click="showPhotosSelector = true">
        <v-icon>mdi-plus-box-multiple</v-icon>
      </v-btn>
      <v-btn variant="text" icon title="编辑相册名" @click="dialog = true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn variant="text" icon title="更多">
        <v-icon>mdi-dots-vertical</v-icon>

        <v-menu activator="parent">
          <v-list class="pa-4">
            <v-list-item link @click="onClickDeleteAlbum">
              <template v-slot:prepend>
                <v-icon>mdi-delete</v-icon>
              </template>
              <v-list-item-title>删除相册</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </template>
  </PageToolbar>

  <Gallery ref="GalleryRef" v-model:selected="selected" :extraParams="{ album_id: route.params.id }"></Gallery>

  <PhotosSelector
    v-model:show="showPhotosSelector"
    :excludeAlbum="album"
    @change="onSelectNewPhotos"
  ></PhotosSelector>

  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title>修改相册名称</v-card-title>
      <v-card-text>
        <v-text-field v-model="nameInput" label="相册名称" outlined></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">取消</v-btn>
        <v-btn color="primary" @click="onSubmitName">提交</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { useGlobalStore } from './globalStore.js'
import { useRoute, useRouter } from 'vue-router';
import { useAsyncState } from '@vueuse/core';
import request from '/src/request.js';

const globalStore = useGlobalStore();

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
      globalStore.snackbar(e.name === 'AxiosError' ? e.response.data?.msg || '服务异常！' : e.message);
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

    globalStore.snackbar(matchedCount && modifiedCount
      ? `已将 ${modifiedCount} 个照片（共 ${matchedCount} 个）添加到相册`
      : response.data.msg
    );

    refreshPhotos();
  } catch (e) {
    console.error(e);
    globalStore.snackbar(e.name === 'AxiosError' ? e.response.data?.msg || '服务异常！' : e.message);
  }
}

// 相册名编辑框
const dialog = ref(false);
const nameInput = ref('');

async function onSubmitName() {
  if (!nameInput.value) return;

  try {
    await request({
      method: 'patch',
      url: '/albums',
      data: {
        ids: [route.params.id],
        updates: {
          name: nameInput.value,
        },
      },
    });

    execute(); // 重新加载
    globalStore.snackbar('修改成功');
    dialog.value = false; // 关闭弹框
  } catch (e) {
    globalStore.snackbar(e.name === 'AxiosError'
      ? (e.response.data?.msg || '服务异常！')
      : e.message
    );
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
