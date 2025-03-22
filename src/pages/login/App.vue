<template>
  <v-app class="background">
    <v-container fill-height>
      <v-row justify="center" align="center" style="min-height: calc(100vh - 60px);">
        <v-col cols="12" sm="8" md="4">
          <v-card class="pa-6" elevation="10">
            <v-card-title class="text-h5">
              登录
              <span class="text-subtitle-1 text-grey-darken-1 ml-2">智能相册系统</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <!-- 用户名输入框 -->
                <v-text-field
                  v-model="name"
                  label="用户名"
                  variant="outlined"
                  :rules="[requiredRule]"
                  required
                  class="mb-4"
                ></v-text-field>

                <!-- 密码输入框 -->
                <v-text-field
                  v-model="password"
                  label="密码"
                  type="password"
                  variant="outlined"
                  :rules="[requiredRule]"
                  required
                ></v-text-field>

                <!-- 登录按钮 -->
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  class="mt-4"
                  block
                  @click="login"
                >
                  登录
                </v-btn>

                <!-- 注册链接 -->
                <v-row justify="center" class="mt-1">
                  <v-col>
                    <a href="/signup/" class="text-grey-darken-1">创建账号</a>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <AppFooter />
  </v-app>

  <v-snackbar v-model="showError" location="top" color="error">
    {{ errorMsg }}
  </v-snackbar>
</template>

<script setup>
import { ref } from 'vue';
import request from '/src/request.js';

const valid = ref(false);
const name = ref('');
const password = ref('');

const showError = ref(false);
const errorMsg = ref('');

const requiredRule = (value) => !!value || '此字段为必填项';

const login = () => {
  request({
    method: 'post',
    url: '/token',
    withCredentials: true, // 关键：必须启用 Cookie 传递
    data: {
      name: name.value,
      password: password.value,
    },
  })
    .then((res) => {
      const token = res.data.data;
      localStorage.setItem('token', token);
      window.location.replace('/');
    })
    .catch((err) => {
      showError.value = true;
      errorMsg.value = err.response.data?.msg;
    });
}
</script>

<style scoped>

</style>
