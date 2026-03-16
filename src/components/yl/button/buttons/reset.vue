<template>
  <a-button class="yl-button yl-button-default" v-bind="$attrs">
    <template #icon>
      <icon-reset />
    </template>
    {{ $t('components.yl.button.reset.text') }}
  </a-button>
</template>

<script lang="ts">
export default {
  name: 'YlButtonReset',
};
</script>

<script lang="ts" setup>
import { IconReset } from '@/components/yl/icon/index';
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
