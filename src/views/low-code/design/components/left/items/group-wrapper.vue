<template>
  <div class="group-wrapper">
    <h3 class="title">{{ title }}</h3>
    <div class="items-wrapper">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'GroupWrapper',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="less" scoped>
.group-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding: 10px 12px;
  .title {
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 14px;
    text-align: left;
  }
  .items-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }
}
</style>
