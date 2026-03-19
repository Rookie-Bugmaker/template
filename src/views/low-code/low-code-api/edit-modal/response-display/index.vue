<template>
  <div class="code-container" v-if="modelRef?.apiId">
    <a-spin :spinning="loading">
      <a-button class="code-btn" type="primary" @click="handleTest" :disabled="!modelRef?.apiId">
        测试接口
      </a-button>
    </a-spin>
    <codemirror
      v-model="code"
      placeholder="实时响应"
      :style="{ height: '400px' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @ready="handleReady"
      :disabled="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import type { ApiOperationParams } from '@/api/low-code/low-code-api/index';
import {
  facadeList,
  facadeListByPage,
  facadeInsert,
  facadeUpdate,
  facadeDelete,
} from '@/api/low-code/low-code-api/index';
import { useVModels } from '../../hooks/useVModels';
import { uuid } from '@/utils/unique-key-util';

type Props = {
  modelValue: ApiOperationParams;
  isReset?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  isReset: false,
});

const emit = defineEmits(['update:modelValue']);

const loading = ref(false);

const modelRef = useVModels(props, 'modelValue', emit);
const code = ref('');

const apiMap = {
  query: facadeList,
  queryByPagination: facadeListByPage,
  insert: facadeInsert,
  update: facadeUpdate,
  delete: facadeDelete,
};

const extensions = [javascript(), oneDark];

const view = shallowRef();
const handleReady = payload => {
  view.value = payload.view;
};

watch(
  () => props.isReset,
  n => {
    if (n && code.value) {
      code.value = '';
    }
  },
);

/* 测试接口操作 */
const handleTest = async () => {
  const params = handleParams();
  if (loading.value) return;
  loading.value = true;
  const res = await apiMap[modelRef.value.type](params);
  loading.value = false;
  code.value = JSON.stringify(res, null, '\t');
  modelRef.value.responseMap = res;
  modelRef.value.fieldList = handleFieldList(handleMapPath(res));
};

const handleParams = () => {
  const params = {
    lowCodeApiCode: modelRef.value.lowCodeApiCode,
  };
  if (modelRef.value.type === 'delete') {
    const data = [];
    // data.push();
    const obj = {};
    modelRef.value.parameterList.forEach(item => {
      obj[item.parameter] = item.parameterValue || '';
    });
    data.push(obj);
    params['data'] = data;
  } else {
    modelRef.value.parameterList.forEach(item => {
      params[item.parameter] = item.parameterValue || '';
    });
  }

  return params;
};

const handleFieldList = obj => {
  const ret = [];
  if (!obj) {
    return ret;
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const fieldType =
        typeof value === 'number'
          ? 'NUMBER'
          : typeof value === 'boolean'
          ? 'BOOLEAN'
          : !isNaN(Date.parse(value))
          ? 'DATE'
          : 'STRING';
      ret.push({
        key: uuid(32),
        fieldCode: key,
        fieldValue: value,
        fieldType: fieldType,
        primaryKey: 'N',
      });
    }
  }
  return ret;
};

const handleMapPath = res => {
  if (modelRef.value.type === 'query') return res?.result?.[0];
  else if (modelRef.value.type === 'queryByPagination') return res.result?.rows?.[0];
  else return null;
};
</script>

<style lang="less" scoped>
.code-container {
  .code-btn {
    margin-bottom: 10px;
  }
}
</style>
