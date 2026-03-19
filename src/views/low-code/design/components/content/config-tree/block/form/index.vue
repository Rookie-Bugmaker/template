<template>
  <block-wrapper :is-selected="designerState.currentConfig?.uid === config.uid">
    <a-form
      class="designer-form"
      :layout="config.options.layout"
      :labelAlign="config.options.labelAlign"
      :labelCol="{
        span: config.options.itemRatio[0],
      }"
      :wrapperCol="{
        span: config.options.itemRatio[1],
      }"
    >
      <a-row :gutter="config.options.gutter">
        <template v-if="config.fieldList?.length">
          <template v-for="formItem in config.fieldList" :key="formItem.uid">
            <a-col
              v-if="formItem.layout?.frontCol"
              :span="colSpan * formItem.layout.frontCol"
            ></a-col>
            <a-col :span="formItem.layout?.colspan ? colSpan * formItem.layout.colspan : colSpan">
              <drag-container
                class="form-field-drop-area"
                behaviour="move"
                group-name="field"
                :drop-placeholder="{
                  className: 'form-field-drop-enter-placeholder',
                }"
                :get-child-payload="() => formItem"
                @drop="e => handleFormFieldDrop(e, config.uid, formItem.uid)"
              >
                <draggable>
                  <widget-wrapper
                    @click="e => handleClickWidget(e, formItem)"
                    @remove="e => handleRemoveWidget(e, formItem)"
                    :is-selected="designerState.currentConfig?.uid === formItem.uid"
                  >
                    <a-form-item
                      :label="getLocaleMessage(formItem.label)"
                      :required="formItem.options?.required"
                      :labelCol="
                        formItem.layout?.itemRatio
                          ? {
                              span: formItem.layout?.itemRatio?.[0],
                            }
                          : null
                      "
                      :wrapperCol="
                        formItem.layout?.itemRatio
                          ? {
                              span: formItem.layout?.itemRatio?.[1],
                            }
                          : null
                      "
                    >
                      <widget :config="formItem" />
                    </a-form-item>
                  </widget-wrapper>
                </draggable>
              </drag-container>
            </a-col>
            <a-col
              v-if="formItem.layout?.rearCol"
              :span="colSpan * formItem.layout.rearCol"
            ></a-col>
          </template>
        </template>
        <template v-else>
          <a-col :span="colSpan">
            <drag-container
              class="form-field-drop-area"
              behaviour="move"
              group-name="field"
              :drop-placeholder="{
                className: 'form-field-drop-enter-placeholder',
              }"
              @drop="e => handleFormFieldDrop(e, config.uid, null)"
            >
              <draggable>
                <widget-wrapper :hide-remove="true">
                  <a-form-item label="" :wrapper-col="24" style="padding-bottom: 0">
                    <div class="from-field-empty-placeholder">请拖入控件</div>
                  </a-form-item>
                </widget-wrapper>
              </draggable>
            </drag-container>
          </a-col>
        </template>
      </a-row>
    </a-form>
  </block-wrapper>
</template>

<script lang="ts">
import { defineComponent, computed, inject } from 'vue';
import type { PropType } from 'vue';
import { Container as DragContainer, Draggable } from '@/components/draggable';
import BlockWrapper from '../../common/block-wrapper.vue';
import WidgetWrapper from '../../common/widget-wrapper.vue';
import Widget from '../../widget/index.vue';
import { moveFormField } from '@/views/low-code/design/utils/index';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { useLocales } from '@/views/low-code/design/hooks/useLocales';

export default defineComponent({
  name: '',
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
    const formConfig = computed(() => props.config);

    const colSpan = computed(() => 24 / (props.config?.options?.colNum || 2));

    const handleFormFieldDrop = (e, dropFormId, dropFieldId) => {
      moveFormField(e, dropFormId, dropFieldId, props.blockMap);
    };

    const designerState = inject(designerStateInjectKey);

    const handleClickWidget = (e, formItem) => {
      e.stopPropagation();
      designerState.currentConfig = formItem;
    };

    const handleRemoveWidget = (e, formItem) => {
      e.stopPropagation();
      formConfig.value.fieldList.splice(
        formConfig.value.fieldList.findIndex(f => f.uid === formItem.uid),
        1,
      );
      designerState.currentConfig = null;
    };

    const { getLocaleMessage } = useLocales();

    return {
      colSpan,
      handleFormFieldDrop,
      designerState,
      handleClickWidget,
      handleRemoveWidget,
      getLocaleMessage,
    };
  },
  components: {
    DragContainer,
    Draggable,
    BlockWrapper,
    WidgetWrapper,
    Widget,
  },
});
</script>

<style lang="less" scoped>
.designer-form {
  z-index: 4;
  :deep(.ant-form-item) {
    margin-bottom: 0;
    padding-bottom: 24px;
  }
  .from-field-empty-placeholder {
    padding: 17px 20px;
    text-align: center;
    background-color: #f1f1f1;
  }
}

:deep(.form-field-drop-area) {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .smooth-dnd-drop-preview-constant-class {
    width: 100%;
    height: 4px !important;
  }
  .smooth-dnd-draggable-wrapper.animated {
    transform: translate3d(0px, 0px, 0px) !important;
  }
  .smooth-dnd-stretcher-element {
    width: 8px !important;
    height: 18px !important;
  }
}

:deep(.form-field-drop-enter-placeholder) {
  position: absolute;
  z-index: 999;
  flex: 0 0 4px;
  width: 100% !important;
  height: 4px;
  margin: 0;
  padding: 0;
  background-color: #1890ff;
}
</style>
