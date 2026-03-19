<template>
  <div class="list-title">
    <div class="title">规则名称</div>
  </div>
  <sort-list @move="move">
    <sort-item v-for="item in designerState.currentConfig.rules || []" :key="item.uid">
      <a-input v-model:value="item.name" size="small" style="margin-right: 5px"></a-input>
      <template #action>
        <a-space>
          <form-outlined class="action-icon" @click="edit(item.uid)" />
          <delete-outlined class="action-icon" @click="remove(item.uid)" />
        </a-space>
      </template>
    </sort-item>
  </sort-list>
  <a-button type="primary" block @click="add">添加规则</a-button>
  <a-drawer
    :open="state.open"
    title="规则设置"
    :width="660"
    @close="() => (state.open = false)"
    :body-style="{ padding: '16px' }"
  >
    <template v-if="currentRuleItem">
      <a-form :model="currentRuleItem" :labelCol="{ span: 3 }">
        <a-form-item label="规则名称">
          <a-input v-model:value="currentRuleItem.name" :size="size" />
        </a-form-item>
        <a-form-item label="提示信息">
          <a-textarea
            v-model:value="currentRuleItem.message"
            placeholder="请输入提示信息"
            :rows="2"
          />
        </a-form-item>
        <a-form-item label="值类型">
          <a-select
            v-model:value="currentRuleItem.type"
            :dropdown-match-select-width="false"
            :size="size"
          >
            <a-select-option value="string" label="string">字符串</a-select-option>
            <a-select-option value="number" label="number">数字</a-select-option>
            <!-- <a-select-option value="date" label="date">日期</a-select-option>
            <a-select-option value="url" label="url">链接</a-select-option>
            <a-select-option value="email" label="email">邮箱</a-select-option>
            <a-select-option value="integer" label="integer">整形</a-select-option>
            <a-select-option value="float" label="float">浮点数</a-select-option>
            <a-select-option value="array" label="array">数组</a-select-option>
            <a-select-option value="object" label="object">对象</a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-item label="触发时机">
          <a-radio-group v-model:value="currentRuleItem.trigger" button-style="solid" :size="size">
            <a-radio-button :value="undefined">默认</a-radio-button>
            <a-radio-button :value="'blur'">失去焦点</a-radio-button>
            <a-radio-button :value="'change'">改变</a-radio-button>
            <!-- <a-radio-button :value="['change', 'blur']">失去焦点/改变</a-radio-button> -->
          </a-radio-group>
        </a-form-item>
        <a-form-item label="不可为空">
          <a-switch
            v-model:checked="currentRuleItem.required"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="正则表达式">
          <a-switch
            v-model:checked="currentRuleItem.enabledPattern"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <template v-if="currentRuleItem.enabledPattern">
          <codemirror
            v-model="currentRuleItem.pattern"
            placeholder="请输入正则表达式"
            :style="{ height: '170px' }"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
          />
        </template>
        <a-form-item label="自定义校验">
          <a-switch
            v-model:checked="currentRuleItem.enabledValidator"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <template v-if="currentRuleItem.enabledValidator">
          <span>function(rule, value, callback, state, modelData){</span>
          <codemirror
            v-model="currentRuleItem.validator"
            placeholder="请输入自定义校验代码"
            :style="{ height: '370px' }"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
          />
          <span>}</span>
        </template>
      </a-form>
    </template>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, computed } from 'vue';
import type { PropType } from 'vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import SortList from './sort-list.vue';
import SortItem from './sort-item.vue';
import { generateKey } from '@/views/low-code/design/utils/key';
import { designerStateInjectKey } from '@/views/low-code/design/keys';

import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Codemirror } from 'vue-codemirror';

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

    const move = ({ removedIndex, addedIndex }) => {
      const newRules = designerState.currentConfig.rules.slice();
      const ruleItem = newRules[removedIndex];
      newRules.splice(removedIndex, 1);
      if (addedIndex === 0) {
        newRules.unshift(ruleItem);
      } else {
        newRules.splice(addedIndex, 0, ruleItem);
      }
      designerState.currentConfig.rules = newRules;
    };

    const state = reactive({
      open: false,
      currentRuleUid: null,
    });

    const add = () => {
      const newItem = {
        name: '规则',
        message: '请按规则填写',
        type: 'string',
        trigger: undefined,
        required: false,
        enabledPattern: false,
        pattern: '',
        enabledValidator: false,
        validator: '',
        uid: generateKey(),
      };
      designerState.currentConfig.rules.push(newItem);
    };

    const edit = (ruleUid: string) => {
      state.currentRuleUid = ruleUid;
      state.open = true;
    };

    const remove = (ruleUid: string) => {
      const removeIndex = designerState.currentConfig.rules.findIndex(f => f.uid == ruleUid);
      designerState.currentConfig.rules.splice(removeIndex, 1);
    };

    const extensions = [javascript(), oneDark];

    const currentRuleItem = computed(() => {
      return designerState.currentConfig?.rules?.find(f => f.uid == state.currentRuleUid);
    });

    return {
      designerState,
      move,
      add,
      edit,
      remove,
      state,
      extensions,
      currentRuleItem,
    };
  },
  components: {
    SortList,
    SortItem,
    Codemirror,
  },
});
</script>

<style lang="less" scoped>
.list-title {
  display: flex;
  padding: 5px 45px 8px 37px;
  color: #747a83;
  border-top: 1px solid #efefef;
  .title {
    flex: 1 1 50%;
    font-size: 14px;
    line-height: 20px;
  }
}
.action-icon {
  color: #747a83;
  cursor: pointer;
}
</style>
