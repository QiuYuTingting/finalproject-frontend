<template>
  <v-snackbar
    v-model="show"
    timeout="-1"
    elevation="8"
    location="bottom right"
  >
    <div>
      <p class="text-h5 mb-4">正在上传 {{ count }} 个文件</p>

      <p class="d-flex justify-space-between">
        <span><strong>{{ formatSize(event?.loaded ?? 0) }}</strong> / {{ formatSize(event?.total ?? 0) }}</span>
        <span>{{ parseInt(100 * (event?.progress || 0)) }}%</span>
      </p>

      <v-progress-linear
        :model-value="event?.progress * 100 || 0"
        striped
        color="primary"
        height="8"
        class="my-2"
      ></v-progress-linear>

      <p>{{ formatSize(event?.rate ?? 0) }}/s</p>

      <p>估计剩余时间：{{ formatDuration((event?.estimated ?? 0) * 1000) }}</p>
    </div>
  </v-snackbar>
</template>

<script setup>
/**
 * 显示文件上传状态的组件
 */

import { ref } from 'vue';
import { formatSize } from '/src/utils/formatSize.js';
import { formatDuration } from '/src/utils/formatDuration.js';

const show = ref(false); // 是否显示该组件
const event = ref(null); // 预期接收 axios onUploadProgress 回调的 ProgressEvent 参数
const count = ref(0); // 文件数量

function open(config) {
  if (!config.event || !config.count) return;

  event.value = config.event;
  count.value = config.count;

  show.value = true;
}

function close() {
  show.value = false;
  event.value = null;
  count.value = 0;
}

defineExpose({
  open,
  close,
});
</script>
