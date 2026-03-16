<template>
  <a-card
    :loading="loading"
    size="small"
    style="height: 100%; width: 100%; position: relative"
    :bodyStyle="bodyStyle"
    v-bind="$attrs"
  >
    <template #title>
      <div class="title-wrapper" ref="tableHeadRef">
        <span class="title-prefix"></span>
        <span class="title">{{ title }}</span>
        <slot name="extra-left" />
      </div>
    </template>
    <template #extra>
      <slot name="extra-right" />
    </template>
    <slot name="default" />
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'PageComponentWrapper',
  props: {
    title: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      defalut: false,
    },
    bodyStyle: {
      type: Object,
      default: () => ({
        padding: '5px',
        overflow: 'auto',
        position: 'absolute',
        width: '100%',
        top: '46px',
        bottom: 0,
      }),
    },
  },
  setup() {
    const tableHeadRef = ref(null);
    return { tableHeadRef };
  },
});
</script>

<style lang="less" scoped>
.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .title-prefix {
    display: block;
    width: 5px;
    height: 25px;
    margin-right: 8px;
    background-color: @primary-color;
    border-radius: 2px;
  }
  .title {
    color: @primary-color;
    font-weight: 600;
    font-size: 14px;
  }
}
</style>
