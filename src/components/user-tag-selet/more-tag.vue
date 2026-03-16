<template>
  <a-tooltip placement="top" title="查看更多用户" :get-popup-container="getPopupContainer">
    <div class="more-tag" v-if="moreNum > 0">
      <span class="more-num">+{{ moreNum }}</span>
    </div>
  </a-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'moreTag',
  props: {
    moreNum: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const getPopupContainer = (trigger: HTMLElement) => {
      return trigger.parentElement;
    };
    return { getPopupContainer };
  },
});
</script>

<style lang="less" scoped>
.more-tag {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 12px;
  background-color: rgba(50, 150, 250, 0.8);
  border-radius: 6px;
  cursor: pointer;
  .more-num {
    color: #fff;
    font-size: 18px;
  }
}
</style>
