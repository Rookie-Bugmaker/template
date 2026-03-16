<template>
  <a-button class="yl-button yl-button-default" v-bind="$attrs">
    <template #icon>
      <icon-publish />
    </template>
    {{ $t('components.yl.button.publish.text') }}
  </a-button>
</template>

<script lang="ts">
export default {
  name: 'YlButtonPublish',
};
</script>

<script lang="ts" setup>
import { IconPublish } from '@/components/yl/icon/index';
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
