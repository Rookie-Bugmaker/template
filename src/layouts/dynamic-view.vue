<template>
  <component v-if="viewComponent" :is="viewComponent" v-bind="state.props"></component>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted, defineAsyncComponent } from 'vue';
export default defineComponent({
  name: 'DynamicView',
  setup() {
    const state = reactive({
      path: '',
      props: {
        bizId: '',
        functionId: '',
        editable: '',
      },
    });
    const viewComponent = computed(() => {
      return state.path
        ? defineAsyncComponent(
            async () => import(/* @vite-ignore */ `../views/${state.path}/approval-view.vue`),
          )
        : null;
    });
    onMounted(() => {
      const { dynamicViewData } = window.microApp.getData();
      Object.assign(state, dynamicViewData);
    });

    return { state, viewComponent };
  },
});
</script>

<style lang="less" scoped></style>
