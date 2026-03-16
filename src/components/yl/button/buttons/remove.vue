<template>
  <a-popconfirm
    v-if="confirm"
    :title="typeof confirm === 'string' ? confirm : $t('components.yl.button.remove.confirm.title')"
    @confirm="$attrs.onClick"
    :disabled="!!$attrs.disabled"
    v-permission:auth:hide="withoutPermission ? true : 'remove'"
  >
    <a-button
      class="yl-button"
      style="color: #ff0000"
      :disabled="!!$attrs.disabled"
      v-bind="otherAttrs"
      @click="
        $event => {
          stopPropagation && $event.stopPropagation();
        }
      "
    >
      <template #icon>
        <icon-remove />
      </template>
      {{ $t('components.yl.button.remove.text') }}
    </a-button>
  </a-popconfirm>
  <a-button
    v-else
    class="yl-button"
    style="color: #ff0000"
    v-bind="$attrs"
    v-permission:auth:hide="withoutPermission ? true : 'remove'"
  >
    <template #icon>
      <icon-remove />
    </template>
    {{ $t('components.yl.button.remove.text') }}
  </a-button>
</template>

<script lang="ts">
import { IconRemove } from '@/components/yl/icon/index';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'YlButtonRemove',
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
    const { onClick, disabled, ...otherAttrs } = attrs;

    return {
      onClick,
      otherAttrs,
      disabled,
    };
  },
  components: {
    IconRemove,
  },
});
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
