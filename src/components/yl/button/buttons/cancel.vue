<template>
  <a-button class="yl-button yl-button-default" v-bind="$attrs">
    <template #icon>
      <icon-cancel />
    </template>
    {{ $t('components.yl.button.cancel.text') }}
  </a-button>
</template>

<script lang="ts">
export default {
  name: 'YlButtonCancel',
};
</script>

<script lang="ts" setup>
import { IconCancel } from '@/components/yl/icon/index';
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
