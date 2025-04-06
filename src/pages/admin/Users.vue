<template>
  <div v-if="isLoading">
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
  <div v-else-if="error">
    <v-alert type="error" variant="text" title="出错了">
      {{ error.message }}
    </v-alert>
  </div>
  <div v-else-if="users">
    <v-data-table
      :headers="[
        { title: 'ID', key: '_id', align: 'start' },
        { title: '用户名', key: 'name', align: 'start' },
        { title: '注册时间', key: 'created_at', align: 'start' },
        { title: '管理员', key: 'is_admin', align: 'start' },
      ]"
      :items="users"
    ></v-data-table>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core'
import request from '/src/request.js';

const {
  state: users,
  error,
  isLoading,
  execute,
} = useAsyncState(async () => {
  try {
    const response = await request({
      method: 'get',
      url: '/users',
      params: {},
    });

    return (response.data?.data || []).map((v) => ({
      ...v,
      created_at: dayjs(v.created_at).format('YYYY年MM月DD日'),
    }));
  } catch (e) {
    if (e.name === 'AxiosError') {
      throw new Error(e.response.data?.msg || '服务异常！');
    }

    throw e;
  }
});

const headers = ref([
  { title: '用户名', key: 'name', align: 'start' },
  { title: '注册日期', key: 'created_at', align: 'start' },
  { title: '管理员', key: 'is_admin', align: 'start' },
]);
</script>

<style scoped>

</style>
