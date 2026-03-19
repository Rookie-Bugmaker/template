<template>
  <a-drawer
    :open="open"
    title="条件设置"
    :width="660"
    @close="$emit('update:open', false)"
    :body-style="{ padding: '16px' }"
  >
    <template v-if="currentConditionItem">
      <a-form :model="currentConditionItem" :labelCol="{ span: 3 }">
        <a-form-item label="条件名称">
          <a-input v-model:value="currentConditionItem.name" size="small" />
        </a-form-item>
        <a-form-item label="条件描述">
          <a-textarea
            v-model:value="currentConditionItem.desc"
            placeholder="请输入提示信息"
            :rows="2"
          />
        </a-form-item>

        <a-tooltip placement="right">
          <template #title>
            <div>value当前控件值</div>
            <div>modelData.value当前表单数据/当前表格行数据（表格按钮直接取modelData）</div>
            <div>return boolean</div>
          </template>
          <info-circle-outlined style="margin-right: 5px" />
        </a-tooltip>
        <span>function(value, modelData, state, eh){</span>
        <codemirror
          v-model="currentConditionItem.func"
          placeholder="请输入条件代码，需返回布尔值"
          :style="{ height: '370px' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="extensions"
        />
        <span>}</span>
      </a-form>
    </template>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';

import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Codemirror } from 'vue-codemirror';

export default defineComponent({
  name: '',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    uid: {
      type: String,
      default: null,
    },
  },
  emits: ['update:open'],
  setup(props) {
    const designerState = inject(designerStateInjectKey);

    const extensions = [javascript(), oneDark];

    const currentConditionItem = computed(() => {
      return designerState?.config?.conditions?.find(f => f.uid == props.uid);
    });

    return {
      extensions,
      currentConditionItem,
    };
  },
  components: {
    Codemirror,
  },
});
</script>

<style lang="less" scoped></style>
