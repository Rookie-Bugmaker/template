<template>
  <a-popconfirm
    v-if="confirm"
    :title="typeof confirm === 'string' ? confirm : $t('components.yl.button.cancel.confirm.title')"
    @confirm="$attrs.onClick"
    :disabled="!!$attrs.disabled"
  >
    <a-button
      type="link"
      size="small"
      class="yl-button yl-button-default"
      :disabled="!!$attrs.disabled"
      v-bind="otherAttrs"
      @click="
        $event => {
          stopPropagation && $event.stopPropagation();
        }
      "
    >
      {{ $t('components.yl.button.cancel.text') }}
    </a-button>
  </a-popconfirm>
  <a-button v-else type="link" size="small" class="yl-button yl-button-default" v-bind="$attrs">
    {{ $t('components.yl.button.cancel.text') }}
  </a-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'YlButtonCancelInline',
  inheritAttrs: false,
  props: {
    confirm: {
      type: [Boolean, String],
      default: false,
    },
    stopPropagation: {
      type: Boolean,
      default: false,
    },
  },
  setup(_props, { attrs }) {
    const { onClick, disabled, ...otherAttrs } = attrs;

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
