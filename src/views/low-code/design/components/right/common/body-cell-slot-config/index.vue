<template>
  <!-- 版本差异,缺少属性:这个template是为了兼容不同版本，旧版本没有bodyCellSlot这个属性 -->
  <template v-if="designerState.currentConfig.bodyCellSlot">
    <a-form-item label="插槽类型">
      <a-radio-group
        v-model:value="designerState.currentConfig.bodyCellSlot.type"
        button-style="solid"
        :size="size"
      >
        <a-radio-button value="none">无</a-radio-button>
        <a-radio-button value="presets">预设</a-radio-button>
        <a-radio-button value="function">函数</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <template v-if="designerState.currentConfig.bodyCellSlot?.type === 'function'">
      <a-form-item label="作为HTML插入">
        <a-switch
          v-model:checked="designerState.currentConfig.bodyCellSlot.options.asHtml"
          checked-children="是"
          un-checked-children="否"
          :size="size"
        />
      </a-form-item>
      <a-form-item label="插槽函数">
        <span>({ text, record, index, column })=> {</span>
        <a-textarea
          v-model:value="designerState.currentConfig.bodyCellSlot.options.fn"
          :size="size"
          :auto-size="{ minRows: 4, maxRows: 10 }"
        />
        <span>}</span>
      </a-form-item>
    </template>

    <template v-if="designerState.currentConfig.bodyCellSlot?.type === 'presets'">
      <a-form-item label="预设组件">
        <a-select
          v-model:value="designerState.currentConfig.bodyCellSlot.options.presets.type"
          :size="size"
          :dropdown-match-select-width="false"
          :get-popup-container="getPopupContainer"
        >
          <a-select-option value="status-tag">状态标签</a-select-option>
          <a-select-option value="date-format">日期格式化</a-select-option>
          <a-select-option value="value-set">值集描述</a-select-option>
          <a-select-option value="user-info">用户信息</a-select-option>
        </a-select>
      </a-form-item>
      <status-list
        v-if="designerState.currentConfig.bodyCellSlot.options.presets.type === 'status-tag'"
      />
      <a-form-item
        label="日期格式化"
        v-if="designerState.currentConfig.bodyCellSlot.options.presets.type === 'date-format'"
      >
        <a-select
          v-model:value="designerState.currentConfig.bodyCellSlot.options.presets.dateFormat"
          :size="size"
          allow-clear
          :dropdown-match-select-width="false"
          :get-popup-container="getPopupContainer"
        >
          <a-select-option value="">无</a-select-option>
          <a-select-option value="YYYY-MM-DD">YYYY-MM-DD</a-select-option>
          <a-select-option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</a-select-option>
          <a-select-option value="YYYY年MM月DD日">YYYY年MM月DD日</a-select-option>
          <a-select-option value="YYYY年MM月DD日 HH:mm:ss">YYYY年MM月DD日 HH:mm:ss</a-select-option>
          <a-select-option value="YYYY年MM月DD日 HH时mm分ss秒">
            YYYY年MM月DD日 HH时mm分ss秒
          </a-select-option>
          <a-select-option value="YYYY-MM">YYYY-MM</a-select-option>
        </a-select>
      </a-form-item>
      <template
        v-if="designerState.currentConfig.bodyCellSlot.options.presets.type === 'value-set'"
      >
        <a-form-item label="集编码">
          <a-input
            v-model:value="designerState.currentConfig.bodyCellSlot.options.presets.setCode"
            :size="size"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item label="值为值编码">
          <a-switch
            v-model:checked="designerState.currentConfig.bodyCellSlot.options.presets.codeValue"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="父集编码">
          <a-input
            v-model:value="designerState.currentConfig.bodyCellSlot.options.presets.parentSetCode"
            :size="size"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item label="父值字段">
          <data-source-field-selector
            v-model:value="
              designerState.currentConfig.bodyCellSlot.options.presets.parentValueField
            "
            :field-list="objectFieldList"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="父值为值编码">
          <a-switch
            v-model:checked="
              designerState.currentConfig.bodyCellSlot.options.presets.parentCodeValue
            "
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
      </template>
      <a-form-item
        label="用户信息描述字段"
        v-if="designerState.currentConfig.bodyCellSlot.options.presets.type === 'user-info'"
      >
        <a-select
          v-model:value="designerState.currentConfig.bodyCellSlot.options.presets.userInfoField"
          :size="size"
          allow-clear
          :dropdown-match-select-width="false"
          :get-popup-container="getPopupContainer"
          placeholder="不设置默使用用户描述"
        >
          <a-select-option value="userDescription">用户描述</a-select-option>
          <a-select-option value="userName">用户名</a-select-option>
        </a-select>
      </a-form-item>
    </template>
  </template>
</template>

<script lang="ts">
import { defineComponent, inject, ref, watch } from 'vue';
import type { PropType } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { MainType } from '@/views/low-code/design/typing/typing';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import StatusList from './status-list.vue';

import { getFieldBlock } from '@/views/low-code/design/utils/move';
import { getTableById } from '@/api/low-code/data-set/table';
import { getViewById } from '@/api/low-code/data-set/sql';
import DataSourceFieldSelector from '../data-source-field-selector.vue';

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

    const currentBlock = getFieldBlock(
      designerState.currentConfig.uid,
      designerState.currentBlockMap,
    );

    const objectFieldList = ref([]);

    const getFieldList = async (type: string, objectId: string) => {
      if (type === 'table') {
        const { success, result } = await getTableById(objectId);
        if (success && result) {
          return result.fieldList;
        }
      }
      if (type === 'view') {
        const { success, result } = await getViewById(objectId);
        if (success && result) {
          return result.fieldList;
        }
      }
      return [];
    };

    watch(
      () => currentBlock?.dataSource?.objectId,
      async (n, o) => {
        if (
          n &&
          n !== o &&
          designerState.currentConfig?.bodyCellSlot?.options?.presets?.type == 'value-set'
        ) {
          const fieldList = await getFieldList(currentBlock.dataSource.type, n);
          objectFieldList.value = fieldList;
        }
      },
      { immediate: true },
    );

    const getPopupContainer = () => document.body;

    return { MainType, designerState, objectFieldList, getPopupContainer };
  },
  components: { StatusList, DataSourceFieldSelector },
});
</script>

<style lang="less" scoped></style>
