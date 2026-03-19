<template>
  <drag-container
    class="page-area"
    behaviour="contain"
    group-name="block"
    :get-child-payload="index => config.children?.[index]"
    :drop-placeholder="{
      className: 'page-area-block-drop-enter-placeholder',
    }"
    @drop="e => handleDrop(e, config.uid)"
  >
    <slot>
      <div class="page-area-drop-placeholder">请将块拖入此处</div>
    </slot>
  </drag-container>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import type { PropType } from 'vue';
import { Container as DragContainer } from '@/components/draggable';
import { moveBlok } from '@/views/low-code/design/utils/index';
import { Modal } from 'ant-design-vue';
import { designerStateFnInjectKey } from '@/views/low-code/design/keys';

export default defineComponent({
  name: 'ConfigPage',
  props: {
    config: {
      type: Object,
      required: true,
    },
    blockMap: {
      type: Object as PropType<Map<string, string>>,
      required: true,
    },
  },
  setup(props) {
    const { useTemplate } = inject(designerStateFnInjectKey);

    const handleDrop = (e, dropBlockId) => {
      const payload = e?.payload;
      if (payload?.type === 'template') {
        Modal.confirm({
          title: '提示',
          content: `是否使用业务组件<${payload?.pageName}>，覆盖当前页面配置？`,
          onOk: () => {
            useTemplate(payload?.pageId);
          },
        });
      } else {
        moveBlok(e, dropBlockId, props.blockMap);
      }
    };
    return { handleDrop };
  },
  components: {
    DragContainer,
  },
});
</script>

<style lang="less" scoped>
.page-area {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 150px);
  padding: 15px 15px 135px;
  background-color: #fefefe;
  .page-area-drop-placeholder {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: calc(100% - 30px);
    height: 100%;
    background-color: #f1f1f1;
  }
}

:deep(.page-area-block-drop-enter-placeholder) {
  flex: 0 0 calc(100% - 30px);
  width: calc(100% - 30px) !important;
  background-color: #fafafa;
  border: 1px dashed #1890ff;
}
</style>
