<template>
  <a-card class="designer-card" :style="{ 'margin-bottom': '12px' }" :size="config?.options.size">
    <template #title>
      <icon
        v-if="config?.options.icon"
        :name="config?.options.icon"
        style="margin-right: 8px"
      ></icon>
      <span>
        {{ renderTitle() }}
      </span>
    </template>
    <slot />
  </a-card>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import type { PropType } from 'vue';
import { parserStateInjectKey } from '@/views/low-code/parser/keys';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
    blockMap: {
      type: Object as PropType<Map<string, string>>,
      required: true,
    },
  },
  setup(props) {
    const parserState = inject(parserStateInjectKey);
    const renderTitle = () => {
      const title = props.config?.options?.title;
      const titleFunc = props.config?.options?.titleFunc;
      if (titleFunc) {
        const f = eval(`(function x (modelData, state){${titleFunc}})`);
        const r = f(title, parserState);
        return r ? r : title;
      } else {
        return title;
      }
    };

    return { renderTitle };
  },
  components: {},
});
</script>

<style lang="less" scoped></style>
