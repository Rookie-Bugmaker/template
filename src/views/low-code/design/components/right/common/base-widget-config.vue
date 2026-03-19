<template>
  <template
    v-if="
      designerState.currentConfig.mainType === MainType.FormWidget ||
      designerState.currentConfig.mainType === MainType.ColumnWidget
    "
  >
    <a-form-item label="标签" v-if="designerState.currentConfig.mainType === MainType.FormWidget">
      <!-- <a-input v-model:value="designerState.currentConfig.label" :size="size" /> -->
      <locales-input
        v-model:value="designerState.currentConfig.label"
        :size="size"
        @change="handleChangeLabelOrTitle"
      />
    </a-form-item>

    <a-form-item label="标题" v-if="designerState.currentConfig.mainType === MainType.ColumnWidget">
      <a-input
        v-model:value="designerState.currentConfig.title"
        :size="size"
        @change="handleChangeLabelOrTitle"
      />
    </a-form-item>

    <a-form-item
      :label="`${
        designerState.currentConfig.mainType === MainType.FormWidget ? '标签' : '标题'
      }函数`"
    >
      <func-input
        v-model:value="designerState.currentConfig.textFunc"
        :size="size"
        title="函数"
        :argsTips="
          designerState.currentConfig.mainType === MainType.FormWidget
            ? 'text, modelData, state'
            : 'text, state'
        "
        placeholder="请输入函数体，标签/标题会作为默认值显示，函数体返回的内容会动态替换标签/标题文本内容"
      />
    </a-form-item>
  </template>
  <template v-if="designerState.currentConfig.mainType === MainType.ColumnWidget">
    <a-form-item label="宽度">
      <a-input-number v-model:value="designerState.currentConfig.width" :min="1" :size="size" />
    </a-form-item>
    <a-form-item label="超出宽度隐藏" v-if="designerState.currentConfig.width">
      <a-switch
        v-model:checked="designerState.currentConfig.ellipsis"
        checked-children="是"
        un-checked-children="否"
        :size="size"
      />
    </a-form-item>
  </template>
  <a-form-item label="禁用">
    <a-switch
      v-model:checked="designerState.currentConfig.options.disabled"
      checked-children="是"
      un-checked-children="否"
      :size="size"
    />
  </a-form-item>
  <a-form-item
    label="必填"
    v-if="Object.prototype.hasOwnProperty.call(designerState.currentConfig.options, 'required')"
  >
    <a-switch
      v-model:checked="designerState.currentConfig.options.required"
      checked-children="是"
      un-checked-children="否"
      :size="size"
    />
  </a-form-item>
  <a-form-item label="必填提示" v-if="designerState.currentConfig.options?.required">
    <a-input
      v-model:value.trim="designerState.currentConfig.options.requiredMessage"
      :size="size"
    />
  </a-form-item>
  <a-form-item label="禁用条件" v-if="!designerState.currentConfig.options.disabled">
    <condition-selector
      v-model:value="designerState.currentConfig.options.disabledCondition"
      :size="size"
    />
  </a-form-item>
  <a-form-item label="隐藏条件" v-if="designerState.currentConfig.mainType === MainType.FormWidget">
    <condition-selector
      v-model:value="designerState.currentConfig.options.hiddenCondition"
      :size="size"
    />
  </a-form-item>
  <a-form-item
    label="不可修改(首次保存后)"
    v-if="!designerState.currentConfig.options.disabled && isEditBlockChildWidget"
  >
    <a-switch
      v-model:checked="designerState.currentConfig.options.unmodifiable"
      checked-children="是"
      un-checked-children="否"
      :size="size"
    />
  </a-form-item>
  <a-form-item label="改变事件函数" v-if="designerState.currentConfig.type !== WidgetType.Button">
    <func-input v-model:value="designerState.currentConfig.options.changeFunc" :size="size" />
  </a-form-item>
  <template v-if="designerState.currentConfig.mainType === MainType.ColumnWidget">
    <a-form-item label="单元格分组合并">
      <a-switch
        v-model:checked="designerState.currentConfig.cellGroupMerge"
        checked-children="是"
        un-checked-children="否"
        :size="size"
      />
    </a-form-item>
    <a-alert
      v-if="designerState.currentConfig.cellGroupMerge"
      message="选择单元格分组合并时，需要确保合并的列进行了数据排序，且当前列之前的所有列都需进行合并及排序"
      type="info"
      show-icon
      style="margin-bottom: 10px"
    />
  </template>
  <!--版本差异,缺少属性:layout-->
  <template
    v-if="
      designerState.currentConfig.mainType === MainType.FormWidget &&
      designerState.currentConfig.layout
    "
  >
    <a-form-item label="跨列数">
      <a-radio-group
        v-model:value="designerState.currentConfig.layout.colspan"
        button-style="solid"
        :size="size"
      >
        <!-- 不跨列 -->
        <a-radio-button :value="null">无</a-radio-button>
        <!-- <a-radio-button :value="1">一</a-radio-button> -->
        <a-radio-button :value="2">二</a-radio-button>
        <a-radio-button :value="3">三</a-radio-button>
        <a-radio-button :value="4">四</a-radio-button>
        <a-radio-button :value="5">五</a-radio-button>
        <a-radio-button :value="6">六</a-radio-button>
      </a-radio-group>
      <a-tooltip placement="topLeft" title="跨列数不能超过表单设置列数，超过则跨列设置无效">
        <question-circle-outlined style="margin-left: 10px" />
      </a-tooltip>
    </a-form-item>
    <a-form-item label="表单项比例">
      <a-select
        :value="designerState.currentConfig.layout.itemRatio?.join(',') || null"
        @change="
          (v: string) => {
            designerState.currentConfig.layout.itemRatio =
              v?.split(',').map(m => parseInt(m)) || null;
          }
        "
        :size="size"
        :dropdown-match-select-width="false"
        :get-popup-container="getPopupContainer"
      >
        <a-select-option :value="null">按表单设置比例</a-select-option>
        <a-select-option value="1,21">1:21</a-select-option>
        <a-select-option value="2,22">2:22</a-select-option>
        <a-select-option value="3,21">3:21</a-select-option>
        <a-select-option value="4,20">4:20</a-select-option>
        <a-select-option value="5,19">5:19</a-select-option>
        <a-select-option value="6,18">6:18</a-select-option>
        <a-select-option value="7,17">7:17</a-select-option>
        <a-select-option value="8,16">8:16</a-select-option>
        <a-select-option value="9,15">9:15</a-select-option>
        <a-select-option value="10,14">10:14</a-select-option>
        <a-select-option value="11,13">11:13</a-select-option>
        <a-select-option value="12,12">12:12</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="前占位列数">
      <a-radio-group
        v-model:value="designerState.currentConfig.layout.frontCol"
        button-style="solid"
        :size="size"
      >
        <a-radio-button :value="null">无</a-radio-button>
        <a-radio-button :value="1">一</a-radio-button>
        <a-radio-button :value="2">二</a-radio-button>
        <a-radio-button :value="3">三</a-radio-button>
        <a-radio-button :value="4">四</a-radio-button>
        <a-radio-button :value="5">五</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="后占位列数">
      <a-radio-group
        v-model:value="designerState.currentConfig.layout.rearCol"
        button-style="solid"
        :size="size"
      >
        <a-radio-button :value="null">无</a-radio-button>
        <a-radio-button :value="1">一</a-radio-button>
        <a-radio-button :value="2">二</a-radio-button>
        <a-radio-button :value="3">三</a-radio-button>
        <a-radio-button :value="4">四</a-radio-button>
        <a-radio-button :value="5">五</a-radio-button>
      </a-radio-group>
    </a-form-item>
  </template>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue';
import type { PropType } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { MainType, WidgetType, BlockType } from '@/views/low-code/design/typing/typing';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import LocalesInput from './locales-input.vue';
import ConditionSelector from './condition-selector.vue';
import FuncInput from './func-input.vue';

export default defineComponent({
  name: '',
  props: {
    size: {
      type: String as PropType<SizeType>,
      default: 'small',
    },
  },
  setup() {
    const designerState = inject(designerStateInjectKey);
    const getPopupContainer = () => document.body;

    const handleChangeLabelOrTitle = () => {
      if (
        Object.prototype.hasOwnProperty.call(designerState.currentConfig.options, 'placeholder')
        /* &&!designerState.currentConfig.options.placeholder */
      ) {
        const prefix = [
          WidgetType.Date,
          WidgetType.Person,
          WidgetType.Popedit,
          WidgetType.Select,
          WidgetType.Time,
          WidgetType.User,
          WidgetType.ValueSet,
          WidgetType.Org,
        ].includes(designerState.currentConfig.type)
          ? '请选择'
          : '请输入';
        if (
          designerState.currentConfig.mainType === MainType.FormWidget &&
          designerState.currentConfig.label
        ) {
          designerState.currentConfig.options.placeholder = `${prefix}${designerState.currentConfig.label}`;
        }
        if (
          designerState.currentConfig.mainType === MainType.ColumnWidget &&
          designerState.currentConfig.title
        ) {
          designerState.currentConfig.options.placeholder = `${prefix}${designerState.currentConfig.title}`;
        }
      }
    };

    //判断当前控件所处的块是否是编辑块（表单/行编辑表格）
    const isEditBlockChildWidget = computed(() => {
      const editBlockConfig = Array.from(designerState.currentBlockMap.values()).filter(
        (f: any) =>
          f?.type === BlockType.Form ||
          (f?.type === BlockType.Table && f?.editable?.mode === 'inline'),
      );
      return editBlockConfig?.some((s: any) => {
        const list = s.fieldList || s.columns;
        return list?.find(f => f.uid === designerState.currentConfig?.uid);
      });
    });

    return {
      MainType,
      WidgetType,
      designerState,
      getPopupContainer,
      handleChangeLabelOrTitle,
      isEditBlockChildWidget,
    };
  },
  components: {
    LocalesInput,
    ConditionSelector,
    FuncInput,
  },
});
</script>

<style lang="less" scoped></style>
