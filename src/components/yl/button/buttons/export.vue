<template>
  <a-button
    class="yl-button yl-button-default"
    v-permission:auth:hide="withoutPermission ? true : 'export'"
    v-bind="$attrs"
  >
    <template #icon>
      <icon-export />
    </template>
    <slot>{{ $t('components.yl.button.export.text') }}</slot>
  </a-button>
</template>

<script lang="ts">
export default {
  name: 'YlButtonExport',
  props: {
    withoutPermission: Boolean,
  },
};
</script>

<script lang="ts" setup>
import { IconExport } from '@/components/yl/icon/index';
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
