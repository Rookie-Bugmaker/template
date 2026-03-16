<template>
  <a-button class="yl-button" type="primary" v-bind="$attrs">
    <template #icon>
      <icon-save />
    </template>
    {{ $t('components.yl.button.save.text') }}
  </a-button>
</template>

<script lang="ts">
export default {
  name: 'YlButtonSave',
};
</script>

<script lang="ts" setup>
import { IconSave } from '@/components/yl/icon/index';
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
