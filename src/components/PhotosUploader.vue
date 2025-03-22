<template>
  <input
    type="file"
    multiple
    ref="fileInputRef"
    accept="image/*"
    style="display: none;"
    @change="handleFileChange"
  >

  <v-snackbar
    v-model="showStatus"
    timeout="-1"
    location="bottom right"
  >
    <div v-if="status === 'success'">
      <v-alert
        title="上传成功"
        type="success"
        variant="text"
        :text="`新增 ${count} 个照片`"
      ></v-alert>
    </div>
    <div v-else-if="status === 'failed'">
      <v-alert
        title="上传失败"
        type="error"
        variant="text"
        :text="errorMessage || ''"
      ></v-alert>
    </div>
    <div v-else-if="status === 'processing' && progressEvent">
      <p class="text-h5 mb-4">正在上传 {{ count }} 个文件</p>

      <p class="d-flex justify-space-between">
        <span><strong>{{ formatSize(progressEvent.loaded ?? 0) }}</strong> / {{ formatSize(progressEvent.total ?? 0) }}</span>
        <span>{{ parseInt(100 * (progressEvent.progress || 0)) }}%</span>
      </p>

      <v-progress-linear
        :model-value="progressEvent.progress * 100 || 0"
        striped
        color="primary"
        height="8"
        class="my-2"
      ></v-progress-linear>

      <p>{{ formatSize(progressEvent.rate ?? 0) }}/s</p>

      <p>估计剩余时间：{{ formatDuration((progressEvent.estimated ?? 0) * 1000) }}</p>
    </div>
    <div v-else>
      <p class="text-h5 mb-4">正在处理</p>
      <v-progress-linear striped :model-value="100" height="8" color="primary" class="my-2" />
    </div>

    <template v-slot:actions>
      <v-btn
        v-if="status === 'success' || status === 'failed'"
        color="blue"
        variant="text"
        @click="onCloseSnackbar"
      >
        关闭
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
/**
 * 文件上传组件。包括上传进度和状态的显示。
 */

import { ref } from 'vue';
import request from '/src/request.js';
import { formatSize } from '/src/utils/formatSize.js';
import { formatDuration } from '/src/utils/formatDuration.js';

const emit = defineEmits(['success', 'failed']);

const showStatus = ref(false); // 是否显示上传状态
const status = ref(''); // 上传状态的可能的值有: processing / success / failed
const count = ref(0); // 正在上传的文件数量
const progressEvent = ref(null); // axios onUploadProgress 回调的参数类型 ProgressEvent
const errorMessage = ref(''); // 上传失败的异常信息
const fileInputRef = ref(null); // 引用隐藏的 input[type="file"] 元素

/**
 * 用户在系统资源管理器选择照片后触发此处理函数
 */
async function handleFileChange(event) {
  const files = event.target?.files;

  if (!files || !files.length) return;

  const formData = new FormData();

  for (const file of files) {
    formData.append('photos', file);
  }

  try {
    showStatus.value = true;

    await request({
      method: 'post',
      url: '/photos',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 0, // 不限制超时
      onUploadProgress: (pEvent) => {
        count.value = files.length;
        progressEvent.value = pEvent;
        status.value = 'processing';
      },
    });

    status.value = 'success';
    emit('success');
  } catch (err) {
    status.value = 'failed';
    errorMessage.value = err.message;
    emit('failed');
  }
}

/**
 * 点击关闭状态弹框
 */
function onCloseSnackbar() {
  if (fileInputRef.value) {
    // 重置 input 选中的文件；
    // 防止上传失败时，用户二次选择同一个文件没有触发 change 事件
    fileInputRef.value.value = null;
  }

  showStatus.value = false;
}

/**
 * 打开系统资源管理器选择图片开始上传
 */
function open() {
  if (!fileInputRef.value) {
    alert('出错了！');
  }
  fileInputRef.value.click();
}

defineExpose({
  open,
});
</script>

<style scoped>

</style>
