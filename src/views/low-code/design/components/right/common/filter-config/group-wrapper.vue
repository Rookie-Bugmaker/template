<template>
  <div class="group-wrapper">
    <div class="group-header">
      <span class="title">{{ title }}</span>
      <div class="extra">
        <slot name="extra" />
      </div>
    </div>
    <div class="group-content">
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
      default: '标题',
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="less" scoped>
.group-wrapper {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #e4e5e7;
  border-radius: 4px;

  .group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    padding: 0 10px;
    padding: 0 16px;
    line-height: 36px;
    background-color: #f5f6f7;
    .title {
      color: #1f2329;
      font-weight: 600;
      font-size: 14px;
    }
    .extra {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .group-content {
    padding: 15px 20px;
  }
}
</style>
