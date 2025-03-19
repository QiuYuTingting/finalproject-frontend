<template>
  <v-app>
    <!-- 侧边栏 -->
    <v-navigation-drawer app class="px-3">
      <!-- 应用名 -->
      <div class="pa-4 text-h6 font-weight-bold">智能相册系统</div>

      <!-- 菜单栏 -->
      <v-list density="compact">
        <v-list-item link to="/" class="rounded-pill py-3 px-6">
          <template v-slot:prepend>
            <v-icon>mdi-image</v-icon>
          </template>
          <v-list-item-title>照片</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/albums" class="rounded-pill py-3 px-6">
          <template v-slot:prepend>
            <v-icon>mdi-folder-multiple-image</v-icon>
          </template>
          <v-list-item-title>相册</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/people" class="rounded-pill py-3 px-6">
          <template v-slot:prepend>
            <v-icon>mdi-account-group</v-icon>
          </template>
          <v-list-item-title>人物</v-list-item-title>
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
      <v-app-bar flat>
        <v-container class="d-flex align-center justify-space-between">
          <!-- 搜索框 -->
          <v-text-field
            density="compact"
            hide-details
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            placeholder="搜索"
            style="max-width: 450px;"
          ></v-text-field>

          <!-- 右侧操作按钮 -->
          <div class="d-flex align-center">
            <!-- 创建和添加照片 -->
            <v-menu v-model="addMenu" offset-y>
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" title="创建和添加照片">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>

              <v-list class="pa-4">
                <v-list-subheader>添加照片</v-list-subheader>
                <v-list-item link class="rounded-pill px-4" @click="onClickUploadPhoto">
                  <template v-slot:prepend>
                    <v-icon>mdi-cloud-upload</v-icon>
                  </template>
                  <v-list-item-title>从计算机上传</v-list-item-title>
                </v-list-item>

                <v-divider class="my-4"></v-divider>

                <v-list-subheader>创建</v-list-subheader>
                <v-list-item link class="rounded-pill px-4" @click="onClickCreateAlbum">
                  <template v-slot:prepend>
                    <v-icon>mdi-folder-multiple-image</v-icon>
                  </template>
                  <v-list-item-title>相册</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>


            <v-btn icon title="设置" to="/settings">
              <v-icon>mdi-cog</v-icon>
            </v-btn>
            <v-btn icon title="帮助" to="/help">
              <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>

            <!-- 用户头像 -->
            <v-menu v-model="userMenu" offset-y>
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" class="ml-2" :loading="userIsLoading" :title="userError?.message || ''">
                  <!-- 加载失败显示一个红色感叹号 -->
                  <v-icon v-if="userError" color="error">mdi-alert-circle</v-icon>
                  <v-avatar v-else-if="userState" size="40" class="border border-white" color="primary">
                    <!-- 有头像显示头像 -->
                    <v-img v-if="userState.avatar" :src="userState.avatar"></v-img>
                    <!-- 没头像显示用户名首字母 -->
                    <span v-else-if="userState.name" class="text-white text-h6">{{ userState.name[0] }}</span>
                  </v-avatar>
                </v-btn>
              </template>

              <v-list class="pa-4">
                <v-list-item link to="/account" class="rounded-pill px-4">
                  <template v-slot:prepend>
                    <v-icon>mdi-account-edit</v-icon>
                  </template>
                  <v-list-item-title>编辑个人信息</v-list-item-title>
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
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core'
import request from '/src/request.js';

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

const userMenu = ref(false); // 控制用户头像菜单的显示
const addMenu = ref(false); // 控制“创建和添加照片”菜单的显示

function onClickUploadPhoto() {
  alert('TODO: 打开系统文件选择并处理照片上传');
}

function onClickCreateAlbum() {
  alert('TODO: 创建临时相册并跳转到相册初始化页面');
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
</style>
