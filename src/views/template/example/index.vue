<template>
  <div>这是一个子项目页面</div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
const router = useRouter();
console.log(router.getRoutes());
</script>

<style lang="less" scoped></style>
