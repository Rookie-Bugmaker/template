<!-- 重要的事情说3遍 -->
<!-- 使用该组件请务必将包裹该组件的父容器设置 position relative，并控制好父容器的宽高，组将将自动适配table为容器尺寸 -->
<!-- 使用该组件请务必将包裹该组件的父容器设置 position relative，并控制好父容器的宽高，组将将自动适配table为容器尺寸 -->
<!-- 使用该组件请务必将包裹该组件的父容器设置 position relative，并控制好父容器的宽高，组将将自动适配table为容器尺寸 -->
<template>
  <div v-if="false" class="pos-absolute top-0 right-0 z-99">{{ scrollY }}</div>
  <page-container>
    <div class="ant-pro-table pos-absolute inset-0 flex flex-col">
      <div v-if="$slots.before" class="ant-pro-table-search shrink-0">
        <slot name="before"></slot>
      </div>

      <div class="flex-1 pos-relative overflow-hidden">
        <div ref="el" class="pos-absolute inset-0"></div>
        <div class="ant-pro-table-search !p-0">
          <slot :scrollY="scrollY"></slot>
        </div>
      </div>

      <div v-if="$slots.after" class="ant-pro-table-search !pb-16px box-border">
        <slot name="after"></slot>
      </div>
    </div>
  </page-container>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useElementSize, refDebounced } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    hideToolbar?: boolean;
    noPagination?: boolean;
  }>(),
  {
    hideToolbar: false,
    noPagination: false,
  },
);

const el = ref(null);
const { height } = useElementSize(el);
const debounced = refDebounced(height, 600);

const scrollY = computed(
  () =>
    debounced.value -
    //如果关闭了分页器
    (props.noPagination == false ? 65 : 10) -
    //如果隐藏了头部工具栏
    (props.hideToolbar == true ? 18 : 48) -
    42,
);
</script>
