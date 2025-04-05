<template>
  <PageToolbar
    :isLoading="isLoading"
    :error="error"
    title="我的信息"
  ></PageToolbar>

  <v-row v-if="user" align="center" justify="center" class="mt-8">
    <v-col cols="auto">
      <v-avatar size="120" class="border border-white" color="secondary">
        <v-img v-if="user.avatar" :src="user.avatar"></v-img>
        <span v-else-if="user.name" class="text-white text-h4">{{ user.name[0].toUpperCase() }}</span>
      </v-avatar>
    </v-col>
  </v-row>

  <v-row v-if="user" align="center" justify="center">
    <v-col cols="auto">
      <p class="text-h2 text-center">{{ user.name }}</p>
      <p class="text-disabled text-center">注册时间：{{ user.createdAt }}</p>
    </v-col>
  </v-row>

  <v-divider class="my-8"></v-divider>

  <v-row v-if="user" align="center" justify="center">
    <v-col cols="auto" class="mx-8">
      <v-btn variant="text" color="error" @click="password.dialog = true">修改密码</v-btn>
    </v-col>
    <v-col cols="auto" class="mx-8">
      <v-btn variant="text" color="primary" @click="name.dialog = true">修改用户名</v-btn>
    </v-col>
  </v-row>

  <v-dialog v-model="name.dialog" max-width="400">
    <v-card class="py-4">
      <v-card-title>修改用户名</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="name.valid">
          <v-text-field
            v-model="name.input"
            label="新用户名"
            variant="outlined"
            :rules="[name.rule]"
            :hint="name.hint"
            persistent-hint
            required
            class="mb-4"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="name.dialog = false">取消</v-btn>
        <v-btn color="primary" :disabled="!name.valid" @click="name.submit">提交</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="password.dialog" max-width="400">
    <v-card class="py-4">
      <v-card-title>修改密码</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="password.valid">
          <v-text-field
            v-model="password.input"
            label="新密码"
            variant="outlined"
            :rules="[password.rule]"
            :hint="password.hint"
            persistent-hint
            required
            class="mb-4"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="password.dialog = false">取消</v-btn>
        <v-btn color="primary" :disabled="!password.valid" @click="password.submit">提交</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import { useGlobalStore } from './globalStore.js'
import { useAsyncState } from '@vueuse/core';
import request from '/src/request.js';

const globalStore = useGlobalStore();

// 获取用户信息
const {
  state: user,
  error,
  isLoading,
  execute,
} = useAsyncState(async () => {
  try {
    const response = await request({
      method: 'get',
      url: '/users/me',
    });

    const user = response.data.data;
    user.createdAt = user.created_at
      ? dayjs(user.created_at).format('YYYY年MM月DD日')
      : '';

    return user;
  } catch (err) {
    if (err.name === 'AxiosError') {
      throw new Error(err.response.data?.msg || '服务异常！');
    }

    throw err;
  }
});

// 修改用户名
const name = ref({
  valid: false,
  dialog: false,
  input: '',
  rule: (value) => {
    return /^[a-zA-Z0-9_-]{2,15}$/.test(value) || name.value.hint;
  },
  hint: '用户名只能由英文字母、数字、下划线和短横组成。长度应为 2-15 个字符。',
  submit: async () => {
    try {
      await request({
        method: 'patch',
        url: '/users',
        data: {
          ids: [user.value._id],
          updates: {
            name: name.value.input,
          },
        },
      });
      globalStore.snackbar('修改用户名成功！');
      execute();
      name.value.dialog = false;
    } catch (e) {
      console.error(e);
      globalStore.snackbar(e.name === 'AxiosError' ? e.response.data?.msg || '服务异常！' : e.message);
    }
  },
});

// 修改密码
const password = ref({
  valid: false,
  dialog: false,
  input: '',
  rule: (value) => {
    return (value.length >= 8 && value.length <= 72) || password.value.hint;
  },
  hint: '密码长度应为 8-72 个字符',
  submit: async () => {
    try {
      await request({
        method: 'patch',
        url: '/users',
        data: {
          ids: [user.value._id],
          updates: {
            password: password.value.input,
          },
        },
      });
      globalStore.snackbar('修改密码成功！');
      execute();
      password.value.dialog = false;
    } catch (e) {
      console.error(e);
      globalStore.snackbar(e.name === 'AxiosError' ? e.response.data?.msg || '服务异常！' : e.message);
    }
  },
});
</script>

<style scoped>

</style>
