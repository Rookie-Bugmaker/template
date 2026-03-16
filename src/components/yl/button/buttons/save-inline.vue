<template>
  <a-button type="link" size="small" class="yl-button yl-button-default" v-bind="$attrs">
    {{ $t('components.yl.button.save.text') }}
  </a-button>
</template>

<script lang="ts">
export default {
  name: 'YlButtonSaveInline',
};
</script>

<script lang="ts" setup></script>

<style lang="less" scoped>
@import url('../index.less');
</style>
