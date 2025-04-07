<template>
  <v-dialog v-model="dialog" fullscreen :close-on-back="false">
    <v-toolbar flat class="lighten-surface">
      <template v-slot:prepend>
        <v-btn variant="text" icon @click="router.back()" class="mr-4">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </template>
      <v-row justify="center" align="center">
        <v-col cols="auto">
          <SearchPhoto v-model="people" @update:modelValue="onSelectPeople"></SearchPhoto>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-card>
      <Gallery
        v-model:selected="selected"
        :extraParams="query"
        ref="GalleryRef"
      >
        <template v-slot:actions>
          <v-btn class="mr-4" color="primary" @click="onClickDone">完成</v-btn>
        </template>
      </Gallery>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import request from '/src/request.js';

const router = useRouter();

const dialog = ref(true); // 显示 dialog
const GalleryRef = ref(null); // Gallery 组件的引用
const people = ref([]); // 选择的人物
const selected = ref([]); // 选中的照片

// 传给 Gallery 组件的查询参数
const query = computed(() => {
  return {
    person_id: people.value.join(','),
  };
});

function onSelectPeople(people) {
  setTimeout(() => {
    GalleryRef.value?.refresh();
  });
}

function onClickDone() {
  console.log(selected.value);
}
</script>

<style scoped>

</style>
