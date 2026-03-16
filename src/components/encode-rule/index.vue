<template>
  <a-input :value="value" disabled :allow-clear="false" v-bind="$attrs">
    <template #suffix>
      <loading-outlined v-if="loading" style="color: rgba(0, 0, 0, 0.35)" />
    </template>
  </a-input>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { createEncode } from '@/api/system/encodeRule/index';
import { Modal } from 'ant-design-vue';

export default defineComponent({
  name: 'EncodeRule',
  props: {
    value: {
      type: String,
      default: '',
    },
    //编码规则编码
    ruleCode: {
      type: String,
      default: '',
    },
    //创建状态下的单据才会去获取编码（通过转换状态，触发获取编码）
    isCreate: {
      type: Boolean,
      default: false,
    },
    //是否手动消费编码，不开启则每次isCreate变化时会去获取新的编码；开启后需要手动调用consume函数，下次isCreate变化时才会获取新的编码
    manual: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value'],
  setup(props, { emit, expose }) {
    const loading = ref(false);
    const prevCode = ref(''); //上一次生成的编码规则

    watch(
      () => props.isCreate,
      (n, o) => {
        if (n && n !== o) {
          if (props.manual && prevCode.value) {
            emit('update:value', prevCode.value);
          } else if (props.ruleCode) {
            //生成编码
            loading.value = true;
            createEncode(props.ruleCode)
              .then(({ success, result }) => {
                if (success && result) {
                  prevCode.value = result;
                  emit('update:value', result);
                } else {
                  Modal.error({
                    title: '错误',
                    content: '获取编码规则失败，请刷新页面后重试',
                  });
                }
              })
              .catch(error => {
                console.error(error);
                Modal.error({
                  title: '错误',
                  content: '获取编码规则失败，请刷新页面后重试',
                });
              })
              .finally(() => {
                loading.value = false;
              });
          }
        }
      },
      {
        immediate: true,
      },
    );

    const consume = () => {
      prevCode.value = '';
    };

    expose({ consume });

    return { loading, consume };
  },
});
</script>

<style lang="less" scoped></style>
