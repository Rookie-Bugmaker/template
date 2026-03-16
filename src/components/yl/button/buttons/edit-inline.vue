<template>
  <a-button
    type="link"
    size="small"
    class="yl-button yl-button-default"
    v-bind="$attrs"
    v-permission:auth:hide="withoutPermission ? true : 'edit'"
  >
    <slot>{{ $t('components.yl.button.edit.text') }}</slot>
  </a-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'YlButtonEditInline',
  props: {
    withoutPermission: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {};
  },
  components: {},
});
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
