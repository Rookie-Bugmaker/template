<template>
  <a-drawer
    :open="open"
    title="数据源自定义过滤条件设置"
    :width="760"
    @close="closeDrawer"
    :body-style="{ padding: '16px' }"
  >
    <template v-if="designerState.currentConfig?.options?.dataSource?.params">
      <div
        v-for="(cItem, cIndex) in designerState.currentConfig?.options?.dataSource?.params"
        :key="cIndex"
        style="margin-bottom: 12px"
      >
        <a-input
          v-model:value="cItem.key"
          allow-clear
          style="width: 30%"
          placeholder="请输入动态参数名"
        ></a-input>
        <a-select
          v-model:value="cItem.type"
          :dropdown-match-select-width="false"
          style="width: 15%"
          placeholder="参数类型"
          @change="handleChangeType(cItem)"
        >
          <a-select-option value="varchar2">字符串</a-select-option>
          <a-select-option value="number">数字</a-select-option>
          <a-select-option value="date">日期</a-select-option>
        </a-select>
        <a-select
          v-model:value="cItem.valueType"
          :dropdown-match-select-width="false"
          style="width: 15%"
          placeholder="值类型"
          @change="v => handleChangeValueType(v, cItem)"
        >
          <a-select-option value="string">字符串</a-select-option>
          <a-select-option value="number">数字</a-select-option>
          <!-- 解析器还没实现 block,实现的话，还得处理依赖条件问题(级联问题，清空前一个后一个清除之类的问题) -->
          <!-- <a-select-option value="block">块字段</a-select-option> -->
          <a-select-option value="currentUser">用户信息</a-select-option>
          <a-select-option value="parentParams">父页面参数</a-select-option>
        </a-select>
        <block-field-selector
          v-if="cItem.valueType === 'block'"
          v-model:value="cItem.value"
          style="width: 35%"
          placeholder="请选择值字段"
        />
        <a-input-number
          v-else-if="cItem.valueType === 'number'"
          v-model:value="cItem.value"
          style="width: 35%"
          placeholder="请输入数字值"
        ></a-input-number>
        <a-select
          v-else-if="cItem.valueType === 'currentUser'"
          v-model:value="cItem.value"
          allow-clear
          style="width: 35%"
          :dropdown-match-select-width="false"
        >
          <a-select-option value="userId">当前用户ID</a-select-option>
          <a-select-option value="roleId">当前角色ID</a-select-option>
          <a-select-option value="orgId">当前数据组织ID</a-select-option>
        </a-select>
        <a-input
          v-else-if="cItem.valueType === 'parentParams'"
          v-model:value="cItem.value"
          allow-clear
          style="width: 35%"
          placeholder="请输入父页面参数键"
        ></a-input>
        <a-input
          v-else
          v-model:value="cItem.value"
          allow-clear
          style="width: 35%"
          placeholder="请输入字符值"
        ></a-input>
        <delete-outlined
          style="margin-left: 20px"
          @click="() => designerState.currentConfig?.options?.dataSource?.params.splice(cIndex, 1)"
        />
      </div>
      <a-button type="dashed" block @click="addParam">
        <template #icon><plus-outlined /></template>
        添加自定义条件
      </a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, inject } from 'vue';
import { useLocales } from '@/views/low-code/design/hooks/useLocales';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { FieldType } from '@/views/low-code/design/typing/index';

import BlockFieldSelector from '../filter-config/block-field-selector.vue';

export default defineComponent({
  name: '',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      required: true,
    },
  },
  emit: ['update:open'],
  setup(_props, { emit }) {
    const designerState = inject(designerStateInjectKey);

    //版本差异,缺少属性,旧版本没有params这个属性
    if (!designerState.currentConfig?.options?.dataSource?.params) {
      designerState.currentConfig.options.dataSource['params'] = [];
    }

    const state = reactive({
      fieldList: [],
    });

    const closeDrawer = () => {
      emit('update:open', false);
    };

    const addParam = () => {
      designerState.currentConfig?.options?.dataSource?.params.push({
        key: null,
        type: null,
        valueType: 'string',
        value: null,
      });
    };

    const handleChangeType = (cItem: any) => {
      cItem.valueType = 'string';
      cItem.value = null;
    };

    const handleChangeValueType = (v, cItem: any) => {
      if (v === 'block') {
        cItem.value = { block: null, field: null };
      } else {
        cItem.value = null;
      }
    };

    const { getLocaleMessage } = useLocales();

    return {
      FieldType,
      designerState,
      state,
      closeDrawer,
      getLocaleMessage,
      addParam,
      handleChangeType,
      handleChangeValueType,
    };
  },
  components: {
    BlockFieldSelector,
  },
});
</script>

<style lang="less" scoped></style>
