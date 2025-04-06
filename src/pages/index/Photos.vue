<template>
  <Gallery v-model:selected="selected" ref="GalleryRef">
    <template v-slot:actions>
      <v-btn icon="mdi-plus" title="添加到相册" @click="onClickAddToAlbum"></v-btn>
    </template>
    <template v-slot:empty>
      <v-empty-state
        icon="mdi-image-frame"
        headline="你还没有照片"
        title="点击右上角 + 按钮开始上传"
      ></v-empty-state>
    </template>
  </Gallery>
</template>

<script setup>
import { ref } from 'vue';

// 选中的照片列表
const selected = ref([]);
const GalleryRef = ref(null);

// 添加到相册
function onClickAddToAlbum() {
  alert('TODO: 此功能尚未实现')
}

// 刷新照片
function refreshPhotos() {
  GalleryRef.value?.refresh();
}

defineExpose({
  refreshPhotos,
});
</script>

<style scoped>

</style>
