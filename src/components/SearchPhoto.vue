<template>
  <span v-if="isLoading">
    <v-progress-circular indeterminate></v-progress-circular>
  </span>
  <span v-else-if="error">
    <span class="text-error">{{ error.message }}</span>
  </span>
  <v-autocomplete
    v-else-if="people"
    density="compact"
    hide-details
    variant="outlined"
    prepend-inner-icon="mdi-magnify"
    placeholder="搜索人物"
    :items="people"
    no-data-text="暂无识别到的人物"
    item-title="name"
    item-value="_id"
    chips
    closable-chips
    multiple
    autofocus
    style="max-width: 450px; width: 450px;"
    v-model="model"
  >
    <template v-slot:chip="{ props, item }">
      <v-chip
        v-bind="props"
        :prepend-avatar="`data:image/jpeg;base64, ${item.raw.reference_face_base64}`"
        :text="item.raw.name"
      ></v-chip>
    </template>
    <template v-slot:item="{ props, item }">
      <v-list-item
        v-bind="props"
        :prepend-avatar="`data:image/jpeg;base64, ${item.raw.reference_face_base64}`"
        :title="item.raw.name"
      ></v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup>
import { useAsyncState } from '@vueuse/core'
import request from '/src/request.js';

const emit = defineEmits(['change']);

const model = defineModel();

// 获取用户的所有人物列表
const {
  state: people,
  error,
  isLoading,
  execute,
} = useAsyncState(async () => {
  try {
    const response = await request({
      method: 'get',
      url: '/people',
    });

    return response.data.data;
  } catch (e) {
    if (e.name === 'AxiosError') {
      throw new Error(e.response.data?.msg || '服务异常！');
    }

    throw e;
  }
});
</script>

<style scoped>

</style>
