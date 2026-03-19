<template>
  <base-config-form>
    <template v-slot="{ config, size }">
      <a-collapse-panel key="2" header="属性设置">
        <a-form-item label="大小">
          <a-radio-group v-model:value="config.options.size" button-style="solid" :size="size">
            <a-radio-button value="small">小</a-radio-button>
            <a-radio-button value="default">中</a-radio-button>
            <a-radio-button value="large">大</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="编码规则设置">
        <!-- <a-form-item label="编码规则">
          <popup-edit
            v-model:value="config.options.encodeRuleId"
            :options="popeditOptions"
            :size="size"
            @change="(_v, item) => (config.options.encodeRuleCode = item?.ruleCode)"
          ></popup-edit>
        </a-form-item> -->
        <a-form-item label="编码规则代码">
          <a-input v-model:value="config.options.encodeRuleCode" :size="size"></a-input>
        </a-form-item>
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseConfigForm from '../common/base-config-form.vue';
// import PopupEdit from '@/components/popup-edit/index.vue';
// import type { Options } from '@/components/popup-edit/typing';
// import { findecodeRuleByPage, findEncodeRuleById } from '@/api/system/encodeRule/index';

export default defineComponent({
  name: '',
  setup() {
    /* const popeditOptions: Options = {
      valueField: 'encodeRuleId',
      textField: 'ruleDes',
      searchFormFields: [
        {
          label: '规则代码',
          field: 'ruleCode',
        },
        {
          label: '规则描述',
          field: 'ruleDes',
        },
      ],
      tableColumns: [
        {
          title: '规则代码',
          dataIndex: 'ruleCode',
        },
        {
          title: '规则描述',
          dataIndex: 'ruleDes',
        },
      ],
      getDataById: findEncodeRuleById,
      getDataByPage: findecodeRuleByPage,
      modalWidth: 640,
      modalTitle: '选择编码规则',
    }; */
    return {
      /* popeditOptions */
    };
  },
  components: {
    BaseConfigForm,
    //PopupEdit,
  },
});
</script>

<style lang="less" scoped></style>
