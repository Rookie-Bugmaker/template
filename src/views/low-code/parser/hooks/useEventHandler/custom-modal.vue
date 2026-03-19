<template>
  <yl-modal v-bind="$attrs">
    <content-vue v-bind="params" />
  </yl-modal>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
const props = defineProps({
  path: {
    type: String,
    default: '',
  },
  params: {
    type: Object,
    default: () => ({}),
  },
});
const ContentVue = defineAsyncComponent(
  () => import(/* @vite-ignore */ `../../../../../${props.path}.vue`),
);
</script>

<style lang="less" scoped></style>
