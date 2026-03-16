<template>
  <a-button
    class="yl-button"
    type="primary"
    v-bind="$attrs"
    v-permission:auth:hide="withoutPermission ? true : 'add'"
  >
    <template #icon>
      <icon-add />
    </template>
    {{ $t('components.yl.button.add.text') }}
  </a-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IconAdd } from '@/components/yl/icon/index';

export default defineComponent({
  name: 'YlButtonAdd',
  props: {
    withoutPermission: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {};
  },
  components: {
    IconAdd,
  },
});
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
