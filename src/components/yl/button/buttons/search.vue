<template>
  <a-button class="yl-button" type="primary" v-bind="$attrs">
    <template #icon>
      <icon-search />
    </template>
    {{ $t('components.yl.button.search.text') }}
  </a-button>
</template>

<script lang="ts">
export default {
  name: 'YlButtonSearch',
};
</script>

<script lang="ts" setup>
import { IconSearch } from '@/components/yl/icon/index';
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
