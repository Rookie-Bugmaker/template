<template>
  <a-breadcrumb
    :routes="breadcrumb"
    :itemRender="customBreadcrumbRender"
    class="base-breadcrumb"
  ></a-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, h, withCtx, createTextVNode } from 'vue';
import { Breadcrumb as ABreadcrumb } from 'ant-design-vue';
import { injectMenuState } from '@/layouts/use-menu-state';
import { RouterLink } from 'vue-router';

export interface Route {
  path: string;
  breadcrumbName: string;
  children: Array<{
    path: string;
    breadcrumbName: string;
  }>;
}

export interface BreadcrumbItemRender {
  route: Route;
  params: Record<any, any>;
  routes: Route[];
  paths: string[];
}

export default defineComponent({
  name: 'BaseBreadcrumb',
  setup() {
    const { breadcrumb } = injectMenuState();

    // 自定义面包屑渲染逻辑
    const customBreadcrumbRender = ({ route, params, routes }: BreadcrumbItemRender) => {
      const breadcrumbName = route.breadcrumbName;
      return (
        (routes.indexOf(route) === routes.length - 1 &&
          h('span', null, { default: withCtx(() => [createTextVNode(breadcrumbName)]) })) ||
        h(
          RouterLink,
          { to: { path: route.path || '/', params } as any },
          { default: withCtx(() => [createTextVNode(breadcrumbName)]) },
        )
      );
    };

    return { breadcrumb, customBreadcrumbRender };
  },
  components: {
    ABreadcrumb,
  },
});
</script>

<style lang="less" scoped>
.base-breadcrumb {
  display: flex;
  align-items: center;
  margin: 0 14px;
  :deep(li) {
    text-wrap: nowrap;
  }
}
</style>
