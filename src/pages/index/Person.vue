<template>
  <PageToolbar
    :isLoading="isLoading"
    :error="error"
    :title="person?.name || '未知人物'"
    showBack
  >
    <template v-slot:prepend>
      <v-avatar size="32" class="border border-white mr-4" color="primary">
        <v-img :src="person?.reference_face_base64 ? `data:image/jpeg;base64, ${person.reference_face_base64}` : '/src/assets/image-placeholder.svg'"></v-img>
      </v-avatar>
    </template>
    <template v-slot:actions>
      <v-btn variant="text" icon title="编辑姓名" @click="dialog = true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn variant="text" icon title="隐藏" @click="onClickEye">
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </template>
  </PageToolbar>

  <Gallery v-model:selected="selected" :extraParams="{ person_id: route.params.id }"></Gallery>

  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title>给人物命名</v-card-title>
      <v-card-text>
        <v-text-field v-model="nameInput" label="姓名" outlined></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">取消</v-btn>
        <v-btn color="primary" @click="onSubmitName">提交</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core'
import { useGlobalStore } from './globalStore.js'
import { useRoute, useRouter } from 'vue-router';
import request from '/src/request.js';

const globalStore = useGlobalStore();

const route = useRoute();
const router = useRouter();

// 选中的照片列表
const selected = ref([]);

// 获取人物详情
const {
  state: person,
  error,
  isLoading,
  execute,
} = useAsyncState(async () => {
  try {
    const response = await request({
      method: 'get',
      url: `/people/${route.params.id}`,
    });

    return response.data.data;
  } catch (e) {
    if (e.name === 'AxiosError') {
      throw new Error(e.response.data?.msg || '服务异常！');
    }

    throw e;
  }
});

const dialog = ref(false);
const nameInput = ref('');

async function onSubmitName() {
  if (!nameInput.value) return;

  try {
    await request({
      method: 'patch',
      url: '/people',
      data: {
        ids: [route.params.id],
        updates: {
          name: nameInput.value,
        },
      },
    });

    execute(); // 重新加载人物详情
    globalStore.snackbar('修改成功');
    dialog.value = false; // 关闭弹框
  } catch (e) {
    globalStore.snackbar(e.name === 'AxiosError'
      ? (e.response.data?.msg || '服务异常！')
      : e.message
    );
  }
}

async function onClickEye() {
  if (!confirm('确定要隐藏此人物吗？隐藏的人物不会再出现在人物列表中。')) return;

  try {
    await request({
      method: 'patch',
      url: '/people',
      data: {
        ids: [route.params.id],
        updates: {
          hide: true,
        },
      },
    });
    router.back();
  } catch (e) {
    globalStore.snackbar(e.name === 'AxiosError'
      ? (e.response.data?.msg || '服务异常！')
      : e.message
    );
  }
}
</script>

<style scoped>

</style>
