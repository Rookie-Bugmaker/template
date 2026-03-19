<template>
  <drag-container
    class="group-item-wrapper"
    :group-name="groupName"
    behaviour="copy"
    :get-child-payload="() => config"
  >
    <draggable tag="div" class="group-item">
      <icon class="icon" :name="`icon-${config.type}`" color="#1890ff" style="margin-right: 10px" />
      <span>{{ config?.name }}</span>
    </draggable>
  </drag-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Container as DragContainer, Draggable } from '@/components/draggable';

export default defineComponent({
  name: 'GroupItem',
  props: {
    config: {
      type: Object,
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {};
  },
  components: { DragContainer, Draggable },
});
</script>

<style lang="less" scoped>
.group-item-wrapper {
  width: 50%;
  padding: 5px 2%;
  .group-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    padding: 3px 10px;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    border: 1px solid #c1c1c1;
    border-radius: 4px;
    &:hover {
      cursor: move;
    }
    .icon {
      margin: 0 10px 0 4px;
      font-size: 16px;
    }
  }
}
</style>
