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
          <a-col flex="auto">
            <a-form-item :wrapper-col="24" class="search-form-query-item">
              <a-space>
                <widget-wrapper :hide-remove="true" :movable="false">
                  <yl-button act-type="search" html-type="submit"></yl-button>
                </widget-wrapper>
                <widget-wrapper :hide-remove="true" :movable="false">
                  <yl-button act-type="reset"></yl-button>
                </widget-wrapper>
              </a-space>
            </a-form-item>
          </a-col>
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
          <a-col flex="auto">
            <a-form-item :wrapper-col="24" class="search-form-query-item">
              <a-space>
                <widget-wrapper :hide-remove="true" :movable="false">
                  <yl-button act-type="search" html-type="submit"></yl-button>
                </widget-wrapper>
                <widget-wrapper :hide-remove="true" :movable="false">
                  <yl-button act-type="reset"></yl-button>
                </widget-wrapper>
              </a-space>
            </a-form-item>
          </a-col>
        </template>
      </a-row>
      <!-- <a-row :gutter="config.options.gutter">
        <a-col :span="surplusColSpan">
          <a-form-item :wrapper-col="24" class="search-form-query-item">
            <a-space>
              <widget-wrapper :hide-remove="true" :movable="false">
                <yl-button act-type="search" html-type="submit"></yl-button>
              </widget-wrapper>
              <widget-wrapper :hide-remove="true" :movable="false">
                <yl-button act-type="reset"></yl-button>
              </widget-wrapper>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row> -->
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

    /* //除去查询表单其他过滤条件的列宽后，表单剩余列宽，没有剩余就返回一整行的列宽
    const surplusColSpan = computed(() => {
      // 表单列数
      const colNum = props.config?.options?.colNum || 2;
      // 表单设置的每个列的span
      const formItemDefaultSpan = colSpan.value;
      //遍历每个表单项，获取表单每个项占的span,前占位和后占位列占的span
      const spanArr = formConfig.value.fieldList
        .map(item => {
          const colArr = [];
          //获取表单项是否跨列
          const itemColspan = item?.layout?.colspan || null;
          //如果跨列且跨列数小于等于表单设置的列数，则此表单项占的span等于跨列数*表单设置的列span ，否则等于表单设置的列span
          const realItemSpan =
            itemColspan !== null && itemColspan <= colNum
              ? itemColspan * formItemDefaultSpan
              : formItemDefaultSpan;

          //将占位列与表单项span按顺序加入到数组中

          //每个前占位数列span等于表单设置的列span
          for (let i = 0; i < item?.layout?.frontCol || 0; i++) {
            colArr.push(formItemDefaultSpan);
          }
          //表单项的span
          colArr.push(realItemSpan);
          //每个后占位数列span等于表单设置的列span
          for (let i = 0; i < item?.layout?.rearCol || 0; i++) {
            colArr.push(formItemDefaultSpan);
          }

          return colArr;
        })
        //将表单项的span和占位列的span按顺序合并成一个数组
        .reduce((a, b) => {
          return a.concat(b);
        }, []);

      //计算最后一行占用的span
      //最后一行占用span起始值是0
      let rowOccupySpan = 0;
      spanArr.forEach(e => {
        //前一项与后一项相加，不超过列span最大值24，占用span等于前一项加后一项，否则换行，占用span等于后一项
        rowOccupySpan = rowOccupySpan + e > 24 ? e : rowOccupySpan + e;
      });

      //最后一行占用的span等于24，则剩余列宽24，否则由最大span值24减去最后一行占用的span,得出剩余列宽
      return rowOccupySpan === 24 ? 24 : 24 - rowOccupySpan;
    }); */

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
      //surplusColSpan,
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
