<template>
  <base-config-form>
    <template v-slot="{ config, size }">
      <a-collapse-panel key="2" header="属性设置">
        <a-form-item label="文本">
          <a-input v-model:value="config.options.text" :size="size" />
        </a-form-item>
        <a-form-item label="按钮类型">
          <a-radio-group
            v-model:value="config.options.type"
            button-style="solid"
            :size="size"
            @change="e => handleChangeButtonType(e, config)"
          >
            <a-radio-button value="">次要</a-radio-button>
            <a-radio-button value="primary">主要</a-radio-button>
            <a-radio-button value="dashed">虚线</a-radio-button>
            <a-radio-button value="link">链接</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="危险按钮">
          <a-switch
            v-model:checked="config.options.danger"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="大小">
          <a-radio-group v-model:value="config.options.size" button-style="solid" :size="size">
            <a-radio-button value="small">小</a-radio-button>
            <a-radio-button value="middle">中</a-radio-button>
            <a-radio-button value="large">大</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="形状" v-show="config.options.type !== 'link'">
          <a-radio-group v-model:value="config.options.shape" button-style="solid" :size="size">
            <a-radio-button value="default">默认</a-radio-button>
            <a-radio-button value="circle">圆形</a-radio-button>
            <a-radio-button value="round">椭圆</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="绑定事件类型">
          <a-radio-group v-model:value="config.options.eventType" button-style="solid" :size="size">
            <a-radio-button value="">无</a-radio-button>
            <!-- <a-radio-button value="config">配置</a-radio-button> -->
            <a-radio-button value="custom">自定义</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="自定义事件函数"
          v-show="config.options.eventType === 'custom'"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
        >
          <span>({state,e,eh,rowData})=> {</span>
          <a-textarea
            v-model:value="config.options.customFn"
            :size="size"
            :auto-size="{ minRows: 4, maxRows: 10 }"
          />
          <span>}</span>
        </a-form-item>
        <a-form-item label="打开弹窗">
          <a-select
            v-model:value="config.options.openModal.configTreeId"
            :size="size"
            :dropdown-match-select-width="false"
            :get-popup-container="getPopupContainer"
            allow-clear
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
        <template v-if="config.options.openModal.configTreeId">
          <a-form-item label="弹窗标题">
            <a-input v-model:value="config.options.openModal.title" :size="size" />
          </a-form-item>
          <a-form-item label="弹窗宽度">
            <a-input-number
              v-model:value="config.options.openModal.width"
              :size="size"
              :min="1"
              :step="1"
            />
          </a-form-item>
          <a-form-item label="弹窗默认最大化">
            <a-switch
              v-model:checked="config.options.openModal.defaultMaximize"
              checked-children="是"
              un-checked-children="否"
              :size="size"
            />
          </a-form-item>
          <a-form-item label="">
            <a-button type="primary" block @click="() => (modalParamsConfigOpen = true)">
              弹窗参数
            </a-button>
          </a-form-item>
          <params-config v-model:open="modalParamsConfigOpen"></params-config>
        </template>
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import BaseConfigForm from '../../common/base-config-form.vue';
import ParamsConfig from './params-config.vue';

export default defineComponent({
  name: '',
  setup() {
    const designerState = inject(designerStateInjectKey);

    //版本差异,缺少属性,旧版本没有params这个属性
    if (!designerState.currentConfig?.options?.openModal) {
      designerState.currentConfig.options['openModal'] = {
        configTreeId: '',
        params: [],
      };
    }
    const handleChangeButtonType = (e, config) => {
      const v = e.target.value;
      if (v === 'link') {
        config.options.shape = 'default';
      }
    };
    const getPopupContainer = () => document.body;

    const modalParamsConfigOpen = ref(false);
    return {
      designerState,
      handleChangeButtonType,
      getPopupContainer,
      modalParamsConfigOpen,
    };
  },
  components: {
    BaseConfigForm,
    ParamsConfig,
  },
});
</script>

<style lang="less" scoped></style>
