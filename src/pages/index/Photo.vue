<template>
  <v-row align="center" justify="space-between">
    <v-col cols="auto">
      <div v-if="isLoading">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <div v-else-if="error">
        <p class="text-error">{{ error.message }}</p>
      </div>
      <div v-else class="d-flex">
        <p class="text-h5">照片</p>
      </div>
    </v-col>
    <v-col cols="auto" v-if="photo?.status === 'trashed'">
      <v-btn variant="text" icon title="恢复" @click="onClickUntrash">
        <v-icon>mdi-restore</v-icon>
      </v-btn>
      <v-btn variant="text" icon title="永久删除" @click="onClickDeleteForever">
        <v-icon>mdi-delete-forever</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="auto" v-else>
      <v-btn variant="text" icon title="删除照片" @click="onClickTrashbin">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>

  <v-divider class="my-4"></v-divider>

  <div v-if="photo" class="photo-container">
    <div>
      <v-img
        :src="photo.src"
        :lazy-src="photo.src"
        :aspect-ratio="photo.metadata.width / photo.metadata.height"
      >
        <!-- 图片加载失败时显示的默认图片 -->
        <template v-slot:error>
          <v-img height="200" width="200" src="/src/assets/image-placeholder.svg"></v-img>
        </template>
      </v-img>
    </div>
    <div>
      <v-list>
        <v-list-subheader class="my-4" v-if="photo.faces?.length">人物</v-list-subheader>

        <v-list-item
          v-for="(face, index) in (photo.faces || [])/*.filter((face) => face.distance_from_who < 0.5)*/"
          :key="`${face.who}_${index}`"
          link
          :to="`/person/${face.who}`"
        >
          <v-avatar size="72" class="border border-white" color="primary">
            <v-img :src="face.face_base64 ? `data:image/jpeg;base64, ${face.face_base64}` : '/src/assets/image-placeholder.svg'" ></v-img>
          </v-avatar>
        </v-list-item>

        <v-list-subheader class="my-4">详情</v-list-subheader>

        <!-- 上传日期 -->
        <v-list-item>
          <template #prepend>
            <v-icon color="primary">mdi-calendar</v-icon>
          </template>
          <v-list-item-title>{{photo.dateStr}}</v-list-item-title>
          <v-list-item-subtitle>{{photo.timeStr}}</v-list-item-subtitle>
        </v-list-item>

        <!-- 照片信息 -->
        <v-list-item class="mt-8">
          <template #prepend>
            <v-icon color="primary">mdi-image</v-icon>
          </template>
          <v-list-item-title style="white-space: normal">{{photo.original_filename}}</v-list-item-title>
          <v-list-item-subtitle>{{photo.mp}} {{photo.metadata.width}} × {{photo.metadata.height}}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import { useAsyncState } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router';
import request from '/src/request.js';

const route = useRoute();
const router = useRouter();

// 获取照片详情
const {
  state: photo,
  error,
  isLoading,
  execute,
} = useAsyncState(async () => {
  try {
    const response = await request({
      method: 'get',
      url: `/photos/${route.params.id}`,
    });

    const photo = response.data.data;

    const createdAt = dayjs(photo.created_at);

    return {
      ...photo,
      dateStr: createdAt.format('YYYY年MM月DD日'),
      timeStr: createdAt.format('ddd HH:mm'),
      mp: `${(photo.metadata.width * photo.metadata.height / 1e6).toFixed(1)} MP`
    };
  } catch (e) {
    if (e.name === 'AxiosError') {
      throw new Error(e.response.data?.msg || '服务异常！');
    }

    throw e;
  }
});

const onClickDeleteForever = () => { alert('TODO') }
const onClickTrashbin = () => { alert('TODO') }
const onClickUntrash = () => { alert('TODO') }
</script>

<style scoped>
.photo-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  grid-gap: 32px;
}
</style>
