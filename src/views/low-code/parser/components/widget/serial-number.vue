<template>
  <encode-rule :size="config.options.size" :rule-code="config.options.encodeRuleCode" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EncodeRule from '@/components/encode-rule/index.vue';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {};
  },
  components: {
    EncodeRule,
  },
});
</script>

<style lang="less" scoped></style>
