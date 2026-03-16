<template>
  <div class="login-input-wrapper">
    <slot name="prefix" />
    <input
      type="text"
      :value="value"
      @input="($event: InputEvent) => $emit('update:value', $event.target.value)"
      v-bind="$attrs"
    />
    <slot name="suffix" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'LoginInput',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  setup() {
    return {};
  },
});
</script>

<style lang="less" scoped>
.login-input-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 0.6rem;
  padding: 0 0.17rem;
  font-size: 0.16rem;
  background: #fafcff;
  border: 0.01rem solid #e9f3ff;
  border-radius: 4px;
  input {
    flex: 1;
    height: 0.6rem;
    margin-left: 0.17rem;
    padding-right: 0.17rem;
    background: #fafcff !important;
    border: none;
    outline: none;
  }
}
</style>
