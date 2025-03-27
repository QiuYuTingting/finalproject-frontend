<template>
  相册 {{route.params}}
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute();
console.log(route);
console.log(route.params);

</script>

<style scoped>

</style>
