<template>
  <a-button
    class="yl-button yl-button-default"
    v-permission:auth:hide="widthouPermission ? true : 'import'"
    v-bind="$attrs"
  >
    <template #icon>
      <icon-import />
    </template>
    {{ $t('components.yl.button.import.text') }}
  </a-button>
</template>

<script lang="ts">
export default {
  name: 'YlButtonImport',
  props: {
    widthouPermission: Boolean,
  },
};
</script>

<script lang="ts" setup>
import { IconImport } from '@/components/yl/icon/index';
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
