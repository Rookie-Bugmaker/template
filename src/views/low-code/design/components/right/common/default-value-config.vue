<template>
  <a-input
    v-if="defaultValueType === 'string'"
    :value="value"
    @update:value="v => $emit('update:value', v)"
    allow-clear
    style="width: 100%"
  ></a-input>
  <a-input-number
    v-else-if="defaultValueType === 'number'"
    :value="value"
    @update:value="v => $emit('update:value', v)"
    style="width: 100%"
  ></a-input-number>
  <a-select
    v-else-if="defaultValueType === 'date'"
    :value="value"
    @update:value="v => $emit('update:value', v)"
    allow-clear
    style="width: 100%"
    :dropdown-match-select-width="false"
  >
    <a-select-option value="currentDateTime">当前时间</a-select-option>
    <a-select-option value="currentDateStartTime">当天开始(当天00:00:00)</a-select-option>
    <a-select-option value="currentDateEndTime">当天结束(当天23:59:59)</a-select-option>
  </a-select>
  <a-select
    v-else-if="defaultValueType === 'currentUser'"
    :value="value"
    @update:value="v => $emit('update:value', v)"
    allow-clear
    style="width: 100%"
    :dropdown-match-select-width="false"
  >
    <a-select-option value="userId">当前用户ID</a-select-option>
    <a-select-option value="roleId">当前角色ID</a-select-option>
    <a-select-option value="orgId">当前数据组织ID</a-select-option>
  </a-select>
  <a-input
    v-else-if="defaultValueType === 'computed'"
    :value="value"
    style="width: 100%"
    @focus="() => (state.computedOpen = true)"
  ></a-input>
  <a-input
    v-else-if="defaultValueType === 'func'"
    :value="value"
    style="width: 100%"
    @focus="() => (state.funcOpen = true)"
  ></a-input>
  <a-input v-else allow-clear style="width: 100%" disabled></a-input>

  <a-drawer
    :open="state.computedOpen"
    title="计算值设定"
    :width="600"
    @close="() => (state.computedOpen = false)"
    :body-style="{ padding: '16px' }"
  >
    <span>async function(state, modelData, eh){</span>
    <codemirror
      :modelValue="value"
      @update:modelValue="v => $emit('update:value', v)"
      placeholder="请输入计算函数,需要return计算值(modelData为computed对象，需要.value取值)"
      :style="{ height: 'calc(100vh - 135px)' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
    />
    <span>}</span>
  </a-drawer>

  <a-drawer
    :open="state.funcOpen"
    title="函数值设定"
    :width="600"
    @close="() => (state.funcOpen = false)"
    :body-style="{ padding: '16px' }"
  >
    <span>{{ isSearchFrom ? 'async function(state, eh)' : 'function()' }}{</span>
    <codemirror
      :modelValue="value"
      @update:modelValue="v => $emit('update:value', v)"
      :placeholder="
        isSearchFrom
          ? '请返回函数值，如同步等待返回值，则需关闭查询表格的初始化后自动查询'
          : '请返回函数值'
      "
      :style="{ height: 'calc(100vh - 135px)' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
    />
    <span>}</span>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import type { PropType } from 'vue';

import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Codemirror } from 'vue-codemirror';

type DefaultValueType = 'string' | 'number' | 'date' | 'computed' | 'currentUser' | 'func';

export default defineComponent({
  name: '',
  props: {
    defaultValueType: {
      type: String as PropType<DefaultValueType>,
      default: '',
    },
    value: {
      type: [String, Number],
      default: null,
    },
    isSearchFrom: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value'],
  setup() {
    const state = reactive({
      computedOpen: false,
      funcOpen: false,
    });

    const extensions = [javascript(), oneDark];

    return { state, extensions };
  },
  components: {
    Codemirror,
  },
});
</script>

<style lang="less" scoped></style>
