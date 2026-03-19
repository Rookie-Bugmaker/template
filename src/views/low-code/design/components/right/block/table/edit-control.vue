<template>
  <a-form-item label="可编辑">
    <a-switch
      v-model:checked="tableConfig.editable.enabled"
      checked-children="是"
      un-checked-children="否"
      :size="size"
    />
  </a-form-item>
  <template v-if="tableConfig.editable.enabled">
    <a-form-item label="编辑模式">
      <a-radio-group v-model:value="tableConfig.editable.mode" button-style="solid" :size="size">
        <a-radio-button value="inline">行内编辑</a-radio-button>
        <a-radio-button value="popup">弹出编辑</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <template v-if="tableConfig.editable.mode === 'popup'">
      <a-form-item label="弹窗标题">
        <a-input v-model:value="tableConfig.editable.popup.title" :size="size" />
      </a-form-item>
      <a-form-item label="弹窗宽度">
        <a-input-number
          v-model:value="tableConfig.editable.popup.width"
          :size="size"
          :min="1"
          :step="1"
        />
      </a-form-item>
      <a-form-item label="弹窗默认最大化">
        <a-switch
          v-model:checked="tableConfig.editable.popup.defaultMaximize"
          checked-children="是"
          un-checked-children="否"
          :size="size"
        />
      </a-form-item>
      <a-form-item label="弹窗页">
        <a-select
          v-model:value="tableConfig.editable.popup.configTreeId"
          :size="size"
          :dropdown-match-select-width="false"
          :get-popup-container="getPopupContainer"
        >
          <a-select-option
            v-for="item in designerState.config.configTrees.filter(
              f => f.uid !== designerState.currentConfigTreeId,
            )"
            :key="item.uid"
            :value="item.uid"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="保存后关闭弹窗">
        <a-switch
          v-model:checked="tableConfig.editable.popup.closeAfterSave"
          checked-children="是"
          un-checked-children="否"
          :size="size"
        />
      </a-form-item>
      <a-form-item label="">
        <a-button type="primary" block @click="() => (paramsConfigOpen = true)">弹窗参数</a-button>
      </a-form-item>
      <params-config v-model:open="paramsConfigOpen"></params-config>
    </template>
    <a-form-item label="保存前事件">
      <func-input
        v-model:value="tableConfig.editable.beforeSaveEvent"
        title="保存前事件"
        :isAsyncFunc="true"
        argsTips="type, state, eh, [modelData]"
        placeholder="type:insert(新增) | update(编辑), 弹出编辑类型下, 无modelData, return false可阻止后续事件"
        :size="size"
      />
    </a-form-item>
    <a-form-item label="保存后事件">
      <func-input
        v-model:value="tableConfig.editable.afterSaveEvent"
        title="保存后事件"
        :isAsyncFunc="true"
        argsTips="type, state, eh, [modelData]"
        placeholder="type:insert(新增) | update(编辑), 弹出编辑类型下, 无modelData, return false可阻止后续事件"
        :size="size"
      />
    </a-form-item>
    <a-form-item label="可新增">
      <a-switch
        v-model:checked="tableConfig.editable.create.enabled"
        checked-children="是"
        un-checked-children="否"
        :size="size"
      />
    </a-form-item>
    <a-form-item label="可修改">
      <a-switch
        v-model:checked="tableConfig.editable.edit.enabled"
        checked-children="是"
        un-checked-children="否"
        :size="size"
      />
    </a-form-item>
    <a-form-item label="可删除">
      <a-switch
        v-model:checked="tableConfig.editable.remove.enabled"
        checked-children="是"
        un-checked-children="否"
        :size="size"
      />
    </a-form-item>
    <template v-if="tableConfig.editable.remove.enabled">
      <a-form-item label="删除确认">
        <a-switch
          v-model:checked="tableConfig.editable.remove.confirm.enabled"
          checked-children="是"
          un-checked-children="否"
          :size="size"
        />
      </a-form-item>
      <!--   <a-form-item label="删除确认提示" v-if="tableConfig.editable.remove.confirm.enabled">
        <a-input v-model:value="tableConfig.editable.remove.confirm.title" :size="size" />
      </a-form-item> -->
    </template>
    <a-form-item label="新增禁用条件" v-if="tableConfig.editable.create.enabled">
      <condition-selector
        v-model:value="tableConfig.editable.create.options.disabledCondition"
        :size="size"
      />
    </a-form-item>
    <a-form-item label="修改禁用条件" v-if="tableConfig.editable.edit.enabled">
      <condition-selector
        v-model:value="tableConfig.editable.edit.options.disabledCondition"
        :size="size"
      />
    </a-form-item>
    <a-form-item label="删除禁用条件" v-if="tableConfig.editable.remove.enabled">
      <condition-selector
        v-model:value="tableConfig.editable.remove.options.disabledCondition"
        :size="size"
      />
    </a-form-item>
  </template>
</template>

<script lang="ts">
import { defineComponent, computed, inject, ref } from 'vue';
import type { PropType } from 'vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import { designerStateInjectKey } from '@/views/low-code/design/keys';

import ConditionSelector from '../../common/condition-selector.vue';
import FuncInput from '../../common/func-input.vue';

import ParamsConfig from './params-config.vue';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
    size: {
      type: String as PropType<SizeType>,
      default: 'small',
    },
  },
  setup(props) {
    const tableConfig = computed(() => props.config);
    const designerState = inject(designerStateInjectKey);
    const getPopupContainer = () => document.body;
    const paramsConfigOpen = ref(false);
    return { tableConfig, designerState, getPopupContainer, paramsConfigOpen };
  },
  components: { ParamsConfig, ConditionSelector, FuncInput },
});
</script>

<style lang="less" scoped></style>
