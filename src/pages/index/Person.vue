<template>
  <v-row align="center" justify="space-between">
    <v-col cols="auto">
      <div v-if="isLoading">加载中……</div>
      <div v-else-if="error">
        <p class="text-error">{{ error.message }}</p>
      </div>

      <div v-else class="d-flex">
        <v-avatar size="32" class="border border-white mr-4" color="primary">
          <v-img :src="person?.reference_face_base64 ? `data:image/jpeg;base64, ${person.reference_face_base64}` : '/src/assets/image-placeholder.svg'"></v-img>
        </v-avatar>
        <p class="text-h5">{{ person?.name || '未知人物' }}</p>
      </div>
    </v-col>
    <v-col cols="auto">
      <v-btn variant="text" icon title="编辑姓名" @click="dialog = true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-col>
  </v-row>

  <v-divider class="my-4"></v-divider>

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

  <v-snackbar v-model="snackbar"> {{ snackbarText }} </v-snackbar>
</template>

<script setup>
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router';
import request from '/src/request.js';

const route = useRoute();

// 选中的照片列表
const selected = ref([]);

// 是否显示 snackbar
const snackbar = ref(false);
const snackbarText = ref('');

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
    snackbarText.value = '修改成功';
    snackbar.value = true;
    dialog.value = false; // 关闭弹框
  } catch (e) {
    if (e.name === 'AxiosError') {
      snackbarText.value = e.response.data?.msg || '服务异常！'
    } else {
      snackbarText.value = e.message;
    }

    snackbar.value = true;
  }
}
</script>

<style scoped>

</style>
