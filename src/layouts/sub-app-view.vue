<template>
  <iframe v-if="!!src" class="sub-app-view" :src="src" frameborder="0"></iframe>
  <a-float-button-group trigger="hover" type="primary" :style="{ right: '24px' }">
    <template #icon>
      <appstore-outlined />
    </template>
    <a-float-button description="返回" @click="toBase">
      <template #icon>
        <home-outlined />
      </template>
    </a-float-button>
  </a-float-button-group>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { FloatButtonGroup as AFloatButtonGroup, FloatButton as AFloatButton } from 'ant-design-vue';
import { AppstoreOutlined, HomeOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();

const src = computed<string>(() => {
  const query = route.query;
  const u = query.url as string;
  return `${decodeURIComponent(u)}`;
});

const toBase = () => {
  router.push('/');
};

onBeforeMount(() => {
  document.getElementById('app').style = 'height:100%;overflow: hidden;';
});

onUnmounted(() => {
  document.getElementById('app').style = 'height:100%;overflow-x: hidden;';
});
</script>

<style lang="less" scoped>
.sub-app-view {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
