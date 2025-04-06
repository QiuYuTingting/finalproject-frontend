<template>
  <PageToolbar title="回收站">
    <template v-slot:actions>
      <v-btn
        variant="text"
        prepend-icon="mdi-delete-forever-outline"
        @click="onClickDeleteAll"
      >清空回收站</v-btn>
    </template>
  </PageToolbar>

  <Gallery
    v-model:selected="selected"
    :extraParams="{ mode: 'trashed' }"
    hideTrashBtn
    ref="GalleryRef"
  >
    <template v-slot:actions>
      <v-btn icon="mdi-restore" title="恢复" @click="onClickUntrash"></v-btn>
      <v-btn icon="mdi-delete-forever" title="删除" @click="onClickDeleteForever"></v-btn>
    </template>
    <template v-slot:empty>
      <v-empty-state
        icon="mdi-delete-empty"
        headline="回收站中无内容"
      ></v-empty-state>
    </template>
  </Gallery>
</template>

<script setup>
import { ref } from 'vue';
import { useGlobalStore } from './globalStore.js'
import request from '/src/request.js';

const globalStore = useGlobalStore();

// 选中的照片列表
const selected = ref([]);
const GalleryRef = ref(null);

// 刷新照片
function refreshPhotos() {
  GalleryRef.value?.refresh();
}

function requestWrapper(fn) {
  return async function(...args) {
    if (typeof fn !== 'function') return;

    try {
      const msg = await fn.apply(null, args);

      globalStore.snackbar(msg);
      refreshPhotos();
    } catch (e) {
      console.error(e);
      globalStore.snackbar(e.name === 'AxiosError'
        ? e.response.data?.msg || '服务异常！'
        : e.message
      );
    }
  }
}

// 恢复选中的照片
// TODO: 此处恢复照片之后，回到照片页面还需手动刷新一下才能看到恢复的照片，需要优化
const onClickUntrash = requestWrapper(async () => {
  const response = await request({
    method: 'patch',
    url: '/photos',
    data: {
      ids: selected.value,
      updates: {
        status: null,
      },
    },
  });

  return 'modifiedCount' in response.data.data
    ? `已恢复 ${ response.data.data.modifiedCount } 张照片。`
    : response.data.msg;
});

// 永久删除选中的照片
const onClickDeleteForever = requestWrapper(async () => {
  if (!confirm(`选中的 ${ selected.value?.length } 张照片将被永久删除，无法恢复。`)) return;

  const response = await request({
    method: 'patch',
    url: '/photos',
    data: {
      ids: selected.value,
      updates: {
        status: 'deleted',
      },
    },
  });

  return 'modifiedCount' in response.data.data
    ? `已永久删除 ${ response.data.data.modifiedCount } 张照片。`
    : response.data.msg;
});

// 清空回收站
const onClickDeleteAll = requestWrapper(async () => {
  if (!confirm(`永久删除回收站中的所有照片？`)) return;


  const response = await request({
    method: 'delete',
    url: '/photos/trashed',
  });

  return 'modifiedCount' in response.data.data
    ? `已永久删除 ${ response.data.data.modifiedCount } 张照片。`
    : response.data.msg;
});

defineExpose({
  refreshPhotos,
});
</script>

<style scoped>

</style>
