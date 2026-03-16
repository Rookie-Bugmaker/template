<template>
  <a-spin :indicator="indicator" />
</template>
<script lang="ts" setup>
import { h } from 'vue';
import { LoadingOutlined } from '@ant-design/icons-vue';

const props = withDefaults(
  defineProps<{
    size: string;
  }>(),
  {
    size: '16px',
  },
);

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: props.size,
  },
  spin: true,
});
</script>
