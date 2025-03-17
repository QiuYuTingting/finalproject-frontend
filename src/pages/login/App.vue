<template>
  <v-app class="background">
    <v-container fill-height>
      <v-row justify="center" align="center" style="min-height: calc(100vh - 60px); /* TODO: 60px 换成变量 */">
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
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <AppFooter />
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const valid = ref(false);
const name = ref('');
const password = ref('');

const requiredRule = (value) => !!value || '此字段为必填项';

const login = () => {
  console.log('登录信息:', { name: name.value, password: password.value });
}
</script>

<style scoped>

</style>
