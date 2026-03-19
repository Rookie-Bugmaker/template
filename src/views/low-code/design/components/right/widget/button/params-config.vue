<template>
  <a-drawer
    :open="open"
    title="弹窗页参数"
    :width="700"
    @close="closeDrawer"
    :body-style="{ padding: '16px' }"
  >
    <template v-if="designerState.currentConfig?.options?.openModal.params">
      <div
        v-for="(cItem, cIndex) in designerState.currentConfig?.options?.openModal.params"
        :key="cIndex"
        style="margin-bottom: 12px; display: flex"
      >
        <a-input
          v-model:value="cItem.key"
          allow-clear
          style="width: 30%"
          placeholder="请输入参数名"
        ></a-input>
        <a-select
          v-model:value="cItem.valueType"
          :dropdown-match-select-width="false"
          style="width: 20%"
          placeholder="值类型"
          @change="v => handleChangeValueType(v, cItem)"
        >
          <a-select-option value="string">字符串</a-select-option>
          <a-select-option value="number">数字</a-select-option>
          <a-select-option value="block">块字段</a-select-option>
          <a-select-option value="modelData">当前块数据字段</a-select-option>
          <!-- <a-select-option value="currentUser">用户信息</a-select-option> -->
        </a-select>
        <block-field-selector
          v-if="cItem.valueType === 'block'"
          v-model:value="cItem.value"
          style="width: 40%"
          placeholder="请选择值字段"
        />
        <a-input-number
          v-else-if="cItem.valueType === 'number'"
          v-model:value="cItem.value"
          style="width: 40%"
          placeholder="请输入数字值"
        ></a-input-number>
        <!-- <a-select
          v-else-if="cItem.valueType === 'currentUser'"
          v-model:value="cItem.value"
          allow-clear
          style="width: 40%"
          :dropdown-match-select-width="false"
        >
          <a-select-option value="userId">当前用户ID</a-select-option>
          <a-select-option value="roleId">当前角色ID</a-select-option>
          <a-select-option value="orgId">当前数据组织ID</a-select-option>
        </a-select> -->
        <a-input
          v-else-if="cItem.valueType === 'modelData'"
          v-model:value="cItem.value"
          style="width: 40%"
          placeholder="请选输入当前块数据字段"
        />
        <a-input
          v-else
          v-model:value="cItem.value"
          allow-clear
          style="width: 40%"
          placeholder="请输入字符值"
        ></a-input>
        <delete-outlined
          style="margin-left: 20px"
          @click="() => designerState.currentConfig?.options?.openModal.params.splice(cIndex, 1)"
        />
      </div>
      <a-button type="dashed" block @click="addParam">
        <template #icon><plus-outlined /></template>
        添加参数
      </a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, inject } from 'vue';
import { useLocales } from '@/views/low-code/design/hooks/useLocales';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { FieldType } from '@/views/low-code/design/typing/index';

import BlockFieldSelector from '../../common/filter-config/block-field-selector.vue';

export default defineComponent({
  name: '',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  emit: ['update:open'],
  setup(_props, { emit }) {
    const designerState = inject(designerStateInjectKey);

    const state = reactive({
      fieldList: [],
    });

    const closeDrawer = () => {
      emit('update:open', false);
    };

    const addParam = () => {
      designerState.currentConfig?.options?.openModal.params.push({
        key: null,
        valueType: 'string',
        value: null,
      });
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
      handleChangeValueType,
    };
  },
  components: {
    BlockFieldSelector,
  },
});
</script>

<style lang="less" scoped></style>
