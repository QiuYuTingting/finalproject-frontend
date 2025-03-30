<template>
  <v-app>
    <!-- 侧边栏 -->
    <v-navigation-drawer
      app
      disable-resize-watcher
      class="px-3 lighten-surface"
      v-model="drawer"
    >
      <!-- 应用名 -->
      <div class="pa-4 text-h6 font-weight-bold">智能相册系统 | 管理员</div>

      <!-- 菜单栏 -->
      <v-list density="compact">
        <v-list-item link to="/" class="rounded-pill py-3 px-6">
          <template v-slot:prepend>
            <v-icon>mdi-image-multiple</v-icon>
          </template>
          <v-list-item-title>仪表板</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/users" class="rounded-pill py-3 px-6">
          <template v-slot:prepend>
            <v-icon>mdi-account</v-icon>
          </template>
          <v-list-item-title>用户</v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- 侧边栏页脚 -->
      <template v-slot:append>
        <div class="text-caption text-disabled mb-2 ml-4">
          &copy; 2025 <span>邱钰婷，浙江师范大学</span>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- 右侧主体 -->
    <v-main>
      <!-- 页头 -->
      <v-app-bar flat class="lighten-surface">
        <v-container fluid class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-app-bar-nav-icon
              variant="text"
              @click.stop="drawer = !drawer"
              class="mr-8"
            ></v-app-bar-nav-icon>

            <!-- 搜索框 -->
            <v-text-field
              density="compact"
              hide-details
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              placeholder="搜索"
              style="max-width: 450px; width: 450px;"
            ></v-text-field>
          </div>

          <!-- 右侧操作按钮 -->
          <div class="d-flex align-center">
<!--
            <v-btn icon title="设置" to="/settings">
              <v-icon>mdi-cog</v-icon>
            </v-btn>
            <v-btn icon title="帮助" to="/help">
              <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>
 -->
            <!-- 用户头像 -->
            <v-menu v-model="userMenu" offset-y>
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" class="ml-2" :loading="userIsLoading" :title="userError?.message || ''">
                  <!-- 加载失败显示一个红色感叹号 -->
                  <v-icon v-if="userError" color="error">mdi-alert-circle</v-icon>
                  <div v-else-if="userState">
                    <v-avatar size="32" class="border border-white" color="primary">
                      <!-- 有头像显示头像 -->
                      <v-img v-if="userState.avatar" :src="userState.avatar"></v-img>
                      <!-- 没头像显示用户名首字母 -->
                      <span v-else-if="userState.name" class="text-white text-h6">{{ userState.name[0] }}</span>
                    </v-avatar>
                    {{ userState.name }}
                  </div>
                </v-btn>
              </template>

              <v-list class="pa-4">
                <v-list-item link class="rounded-pill px-4" @click="onClickLeaveAdmin">
                  <template v-slot:prepend>
                    <v-icon>mdi-exit-run</v-icon>
                  </template>
                  <v-list-item-title>退出管理后台</v-list-item-title>
                </v-list-item>
                <v-list-item link class="rounded-pill px-4" @click="onClickLogout">
                  <template v-slot:prepend>
                    <v-icon>mdi-logout</v-icon>
                  </template>
                  <v-list-item-title>退出当前账号</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-container>
      </v-app-bar>

      <!-- 主体内容 -->
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core'
import { useRoute, useRouter } from "vue-router";
import request from '/src/request.js';

const route = useRoute();
const router = useRouter();

// 获取用户信息
const {
  state: userState,
  error: userError,
  isLoading: userIsLoading,
} = useAsyncState(async () => {
  try {
    const response = await request({
      method: 'get',
      url: '/users/me',
    });

    return response.data.data;
  } catch (err) {
    if (err.name === 'AxiosError') {
      throw new Error(err.response.data?.msg || '服务异常！');
    }

    throw err;
  }
});

const drawer = ref(true); // 控制菜单栏是否打开
const userMenu = ref(false); // 控制用户头像菜单的显示

function onClickLeaveAdmin() {
  window.location.replace('/');
}

function onClickLogout() {
  localStorage.removeItem('token');
  window.location.replace('/login/');
}
</script>

<style scoped>
.v-navigation-drawer--left {
  border-right: none;
}

.v-theme--light .lighten-surface {
  --v-theme-surface: 240, 244, 249;
}
</style>
