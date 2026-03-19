<template>
  <yl-modal
    :open="open"
    :title="title"
    :width="width"
    destroy-on-close
    centered
    :mask-closable="false"
    :body-style="{ padding: '12px 4px 4px' }"
    :confirmLoading="confirmLoading"
    @ok="$emit('ok')"
    @cancel="
      () => {
        $emit('update:open', false);
        $emit('cancel');
      }
    "
  >
    <!-- <template #footer>
      <yl-button
        act-type="cancel"
        key="back"
        @click="
          () => {
            $emit('update:open', false);
            $emit('cancel');
          }
        "
      ></yl-button>
      <yl-button
        act-type="save"
        key="submit"
        type="primary"
        :loading="confirmLoading"
        @click="$emit('ok')"
      ></yl-button>
    </template> -->
    <slot />
  </yl-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DModal',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '弹窗',
    },
    width: {
      type: Number,
      default: 600,
    },
    confirmLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:open', 'ok', 'cancel'],
  setup() {
    return {};
  },
});
</script>

<style lang="less" scoped></style>
