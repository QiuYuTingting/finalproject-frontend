<template>
  <v-toolbar flat color="#fff" density="compact">
    <template v-slot:prepend>
      <v-btn v-if="showBack" variant="text" icon @click="back" class="mr-4">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </template>

    <slot name="prepend"></slot>

    <v-toolbar-title>
      <v-row align="center">
        <v-col cols="auto">
          <p class="text-h5">{{ title || '' }}</p>
        </v-col>
        <v-col v-if="isLoading" cols="auto">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-col>
        <v-col v-else-if="error" cols="auto">
          <p class="text-error">{{ error.message }}</p>
        </v-col>
      </v-row>
    </v-toolbar-title>

    <template v-slot:append>
      <slot name="actions"></slot>
    </template>
  </v-toolbar>

  <v-divider class="my-4"></v-divider>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  isLoading: Boolean,
  error: Error,
  title: String,
  showBack: Boolean,
});

const router = useRouter();

function back() {
  router.back();
}
</script>

<style scoped>

</style>
