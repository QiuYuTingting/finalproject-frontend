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

</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function onClickCreateAlbum() {
  router.push('/album/new');
}
</script>

<style scoped>

</style>
