<template>
  <select-person
    :disabled="config.options.disabled"
    :placeholder="config.options.placeholder"
    :size="config.options.size"
    :allow-clear="config.options.allowClear"
    :multiple="config.options.multiple"
    :maxTagCount="config.options.maxTagCount"
    :mini-select-btn="config.options.miniSelectBtn"
    @bring="handleBring"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SelectPerson from '@/components/select-person/index.vue';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  emits: ['bring'],
  setup(props, { emit }) {
    const handleBring = (val, dataItem) => {
      //暂不支持带出配置，brings一直为空数组，写在这里防止后续程序报错
      if (props.config.options.brings?.length) {
        if (val) {
          emit('bring', dataItem, props.config.options.brings, !!props.config.options.multiple);
        } else {
          emit('bring', null, props.config.options.brings, !!props.config.options.multiple);
        }
      }
    };
    return { handleBring };
  },
  components: {
    SelectPerson,
  },
});
</script>

<style lang="less" scoped></style>
