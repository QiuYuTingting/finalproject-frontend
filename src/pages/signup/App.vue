<template>
  <v-app class="background">
    <v-container fill-height>
      <v-row justify="center" align="center" style="min-height: calc(100vh - 60px); /* TODO: 60px 换成变量 */">
        <v-col cols="12" sm="8" md="4">
          <v-card class="pa-6" elevation="10">
            <v-card-title class="text-h5">
              注册
              <span class="text-subtitle-1 text-grey-darken-1 ml-2">智能相册系统</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <!-- 用户名输入框 -->
                <v-text-field
                  v-model="name"
                  label="用户名"
                  variant="outlined"
                  :rules="[nameRules]"
                  :hint="NAME_HINT"
                  persistent-hint
                  required
                  class="mb-4"
                ></v-text-field>

                <!-- 密码输入框 -->
                <v-text-field
                  v-model="password"
                  label="密码"
                  type="password"
                  variant="outlined"
                  :rules="[passwordRules]"
                  :hint="PASSWORD_HINT"
                  persistent-hint
                  required
                ></v-text-field>

                <!-- 提交按钮 -->
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  class="mt-4"
                  block
                  @click="submit"
                >
                  注册
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

const NAME_HINT = '用户名只能由英文字母、数字、下划线和短横组成。长度应为 2-15 个字符。';
const PASSWORD_HINT = '密码长度应为 8-72 个字符';

const nameRules = (value) => {
  return /^[a-zA-Z0-9_-]{2,15}$/.test(value) || NAME_HINT;
}

const passwordRules = (value) => {
  return (value.length >= 8 && value.length <= 72) || PASSWORD_HINT;
}

const submit = () => {
  console.log('注册信息:', { name: name.value, password: password.value })
}
</script>

<style scoped>

</style>
