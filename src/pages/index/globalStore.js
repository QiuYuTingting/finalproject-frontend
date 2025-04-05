import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGlobalStore = defineStore('global', () => {
  const showSnackbar = ref(false); // 是否显示 snackbar
  const snackbarText = ref(''); // snackbar 中的消息

  // 以编程式的方式显示提示信息
  function snackbar(text) {
    snackbarText.value = text || '';
    showSnackbar.value = true;
  }

  return {
    showSnackbar,
    snackbarText,
    snackbar,
  };
});
