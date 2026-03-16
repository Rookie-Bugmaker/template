<template>
  <a-button class="yl-button yl-button-default" v-bind="$attrs">
    <template #icon>
      <icon-download />
    </template>
    <slot name="default">
      {{ $t('components.yl.button.download.text') }}
    </slot>
  </a-button>
</template>

<script lang="ts">
export default {
  name: 'YlButtonDownload',
};
</script>

<script lang="ts" setup>
import { IconDownload } from '@/components/yl/icon/index';
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
