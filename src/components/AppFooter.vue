<template>
  <v-footer height="40" app>
    <a
      v-for="item in items"
      :key="item.title"
      :href="item.href"
      :title="item.title"
      class="d-inline-block mx-2 social-link"
      rel="noopener noreferrer"
      target="_blank"
    >
      <v-icon
        :icon="item.icon"
        :size="item.icon === '$vuetify' ? 24 : 16"
      />
      <span class="ml-1 text-caption text-disabled">{{ item.title }}</span>
    </a>

    <div
      class="text-caption text-disabled"
      style="position: absolute; right: 16px;"
    >
      &copy; 2025 <span>邱钰婷，浙江师范大学</span>
    </div>
  </v-footer>
</template>

<script setup>
  const items = [
    {
      title: '毕业设计后端项目 GitHub',
      icon: `mdi-github`,
      href: 'https://github.com/QiuYuTingting/finalproject',
    },
    {
      title: '毕业设计前端项目 GitHub',
      icon: `mdi-github`,
      href: 'https://github.com/QiuYuTingting/finalproject-frontend',
    },
  ]
</script>

<style scoped>
.social-link :deep(.v-icon) {
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
  text-decoration: none;
  transition: .2s ease-in-out;
}

.social-link :deep(.v-icon):hover {
  color: rgba(25, 118, 210, 1);
}
</style>
