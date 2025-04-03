<template>
  <PageToolbar title="创建相册" showBack></PageToolbar>

  <v-row class="mt-8">
    <v-text-field
      placeholder="添加标题"
      variant="underlined"
      class="mx-4 album-title-input"
      autofocus
      :error-messages="titleError"
      @focus="titleError = ''"
      v-model="title"
    ></v-text-field>
  </v-row>

  <v-row align="center" justify="center">
    <v-col cols="auto">
      <v-btn
        size="x-large"
        prepend-icon="mdi-plus"
        variant="outlined"
        color="primary"
        @click="() => createAlbum('add_photos')"
      >添加照片</v-btn>
    </v-col>
  </v-row>

  <v-row align="center" justify="center">
    <v-col cols="auto">
      <v-btn
        size="x-large"
        append-icon="mdi-arrow-right"
        variant="text"
        @click="() => createAlbum()"
      >稍后添加</v-btn>
    </v-col>
  </v-row>

</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import request from '/src/request.js';

const router = useRouter();

const title = ref('');
const titleError = ref('');

// 创建相册
async function createAlbum(mode = '') {
  try {
    if (!title.value) {
      throw new Error('请添加标题');
    }

    const response = await request({
      method: 'post',
      url: '/albums',
      data: {
        name: title.value,
      },
    });

    const queryStr = mode ? `?mode=${mode}` : '';
    router.replace(`/album/${response.data.data.insertedId}${queryStr}`);
  } catch (e) {
    console.error(e);
    titleError.value = e.name === 'AxiosError'
      ? e.response.data?.msg || '服务异常！'
      : e.message;
  }
}
</script>

<style scoped>
.album-title-input :deep(input) {
  font-size: 2.4em;
}
</style>
