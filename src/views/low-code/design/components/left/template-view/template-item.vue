<template>
  <drag-container
    class="item-wrapper w-full"
    group-name="block"
    behaviour="copy"
    :get-child-payload="() => Object.assign(itemInfo, { type: 'template' })"
  >
    <draggable tag="div" class="item">
      <a-list-item-meta>
        <template #title>
          <h4>{{ itemInfo.pageName }}</h4>
        </template>
        <template #avatar>
          <icon style="font-size: 20px" :name="itemInfo.pageIcon"></icon>
        </template>
        <template #description>
          <span>{{ itemInfo.pageDesc }}</span>
        </template>
      </a-list-item-meta>
    </draggable>
  </drag-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Container as DragContainer, Draggable } from '@/components/draggable';

export default defineComponent({
  name: 'TemplateItem',
  props: {
    itemInfo: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {};
  },
  components: { DragContainer, Draggable },
});
</script>

<style lang="less" scoped></style>
