<template>
  <a-button
    class="yl-button yl-button-default"
    v-bind="$attrs"
    v-permission:auth:hide="withoutPermission ? true : 'edit'"
  >
    <template #icon>
      <icon-edit class="btn-edit" />
    </template>
    {{ $t('components.yl.button.edit.text') }}
  </a-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IconEdit } from '@/components/yl/icon/index';

export default defineComponent({
  name: 'YlButtonEdit',
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
    IconEdit,
  },
});
</script>

<style lang="less" scoped>
@import url('../index.less');
.btn-edit {
  color: @primary-color;
}
</style>
