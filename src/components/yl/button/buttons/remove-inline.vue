<template>
  <a-popconfirm
    v-if="confirm"
    :title="typeof confirm === 'string' ? confirm : $t('components.yl.button.remove.confirm.title')"
    @confirm="$attrs.onClick"
    :disabled="!!$attrs.disabled"
    placement="topRight"
  >
    <a-button
      type="link"
      size="small"
      class="yl-button yl-button-default"
      style="color: #ff0000"
      :disabled="!!$attrs.disabled"
      v-bind="otherAttrs"
      v-permission:auth:hide="withoutPermission ? true : 'remove'"
      @click="
        $event => {
          stopPropagation && $event.stopPropagation();
        }
      "
    >
      {{ $t('components.yl.button.remove.text') }}
    </a-button>
  </a-popconfirm>
  <a-button
    v-else
    type="link"
    size="small"
    class="yl-button yl-button-default"
    style="color: #ff0000"
    v-bind="$attrs"
    v-permission:auth:hide="withoutPermission ? true : 'remove'"
  >
    {{ $t('components.yl.button.remove.text') }}
  </a-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'YlButtonRemoveInline',
  inheritAttrs: false,
  props: {
    confirm: {
      type: [Boolean, String],
      default: false,
    },
    withoutPermission: {
      type: Boolean,
      default: false,
    },
    stopPropagation: {
      type: Boolean,
      default: false,
    },
  },
  setup(_props, { attrs }) {
    const { onClick, disabled, ...otherAttrs } = attrs; //通过toRefs再解构，保证响应式正常
    return {
      onClick,
      otherAttrs,
      disabled,
    };
  },
});
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
