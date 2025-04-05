<template>
  <v-dialog v-model="show" persistent fullscreen>
    <v-toolbar>
      <v-btn icon @click="show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>选择照片</v-toolbar-title>
      <p v-if="props.excludeAlbum?.name">已在相册 <strong>{{ props.excludeAlbum.name }}</strong> 中的照片不会显示在此处</p>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-card>
      <div class="pa-4">
        <Gallery
          v-model:selected="selected"
          :extraParams="extraParams"
          ref="GalleryRef"
          hideTrashBtn
        >
          <template v-slot:actions>
            <v-btn class="mr-4" color="primary" @click="onClickDone">完成</v-btn>
          </template>
        </Gallery>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';

const show = defineModel('show');

const props = defineProps({
  excludeAlbum: Object, // 要排除的相册 { _id: 'xxx', name: 'xxx' }
});

const emit = defineEmits(['change']);

// 选中的照片
const selected = ref([]);
const GalleryRef = ref(null);

const extraParams = computed(() => {
  if (props.excludeAlbum?._id) {
    return {
      'exclude_album': props.excludeAlbum._id,
    }
  }
});

// 点击“完成”
function onClickDone() {
  emit('change', [...selected.value]);
  selected.value = [];
}
</script>

<style scoped>

</style>
