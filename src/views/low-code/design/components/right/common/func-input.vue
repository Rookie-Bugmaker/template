<template>
  <a-input
    :value="value"
    style="width: 100%"
    @focus="() => (state.funcOpen = true)"
    v-bind="$attrs"
    placeholder="无"
  ></a-input>

  <a-drawer
    :open="state.funcOpen"
    :title="title"
    :width="600"
    @close="() => (state.funcOpen = false)"
    :body-style="{ padding: '16px' }"
  >
    <span>{{ isAsyncFunc ? 'async' : '' }} function({{ argsTips }}){</span>
    <codemirror
      :modelValue="value"
      @update:modelValue="v => $emit('update:value', v)"
      :placeholder="placeholder"
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
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Codemirror } from 'vue-codemirror';

export default defineComponent({
  name: '',
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    title: {
      type: String,
      default: '事件函数',
    },
    isAsyncFunc: {
      type: Boolean,
      default: false,
    },
    argsTips: {
      type: String,
      default: 'value, modelData, state, eh',
    },
    placeholder: {
      type: String,
      default: '请输入函数体',
    },
  },
  emits: ['update:value'],
  setup() {
    const state = reactive({
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
