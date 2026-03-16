<template>
  <component :is="currentComponent" class="list-item" v-bind="$attrs" style="padding: 0">
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent, computed, resolveDynamicComponent, h } from 'vue';
import type { PropType } from 'vue';
import type { MessageType } from '@/api/dashboard/items/system/notice';

import ProcessApproval from '@/components/workflow/process-approval/index.vue';

import { Button as AButton } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const CustomRouterLink = defineComponent({
  setup(props, { attrs, slots }) {
    const router = useRouter();
    return () =>
      h(
        AButton,
        {
          ...props,
          ...attrs,
          type: 'link',
          size: 'small',
          onClick: async () => {
            router.push(attrs.to).then(() => {
              history.pushState({ ...history.state, params: { ...(attrs.to as any).params } }, '');
            });
          },
        },
        slots.default(),
      );
  },
  components: {
    AButton,
  },
});

const NormalMessage = defineComponent({
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...props,
          ...attrs,
        },
        slots.default(),
      );
  },
});

export default defineComponent({
  name: 'DynamicListItem',
  inheritAttrs: false,
  props: {
    messageType: {
      type: Number as PropType<MessageType>,
      defalut: null,
    },
  },
  setup(props) {
    const componentMap = {
      1: ProcessApproval,
      3: CustomRouterLink,
      4: NormalMessage,
    };

    const currentComponent = computed(() => {
      const type = props.messageType;
      return componentMap[type] ? resolveDynamicComponent(componentMap[type]) : 'div';
    });
    return { currentComponent };
  },
  components: { ProcessApproval },
});
</script>

<style lang="less" scoped></style>
