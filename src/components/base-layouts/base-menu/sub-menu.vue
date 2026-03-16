<template>
  <a-sub-menu v-if="!menu.meta?.hideInMenu" :key="menu.path">
    <template #icon>
      <!-- <component v-if="menu.meta.icon !== undefined" :is="menu.meta.icon" :key="menu.meta.icon" />-->
      <a-lazy-icon v-if="menu.meta.icon !== undefined" :icon="menu.meta.icon" />
      <component
        v-else-if="collapsed && menu.meta.collapsedIcon !== undefined"
        :is="menu.meta.collapsedIcon"
        :key="menu.meta.collapsedIcon"
      />
    </template>
    <template #title>
      <span :title="t(menu.meta.title)">{{ t(menu.meta.title) }}</span>
    </template>
    <template v-for="child in menu.children">
      <a-menu-item
        @mouseenter="$emit('itemHover', { key: child.path })"
        v-if="(!child.children || child.meta?.hideChildrenInMenu) && !child.meta?.hideInMenu"
        :key="child.path"
      >
        <template #icon>
          <!-- <component
            v-if="child.meta.icon !== undefined"
            :is="child.meta.icon"
            :key="child.meta.icon"
          /> -->
          <a-lazy-icon v-if="child.meta.icon !== undefined" :icon="child.meta.icon" />
          <component
            v-else-if="collapsed && child.meta.collapsedIcon !== undefined"
            :is="child.meta.collapsedIcon"
            :key="child.meta.collapsedIcon"
          />
        </template>
        <span :title="t(child.meta.title)">{{ t(child.meta.title) }}</span>
      </a-menu-item>
      <template v-else>
        <sub-menu :menu="child" :key="child.path" :collapsed="collapsed" />
      </template>
    </template>
  </a-sub-menu>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import type { RouteProps } from '../typing';
// import ALazyIcon from './lazy-icon.vue';
const ALazyIcon = defineAsyncComponent(() => import('./lazy-icon.vue'));

export interface SubMenuProps {
  menu: RouteProps;
}

export default defineComponent({
  name: 'SubMenu',
  emits: ['itemHover'],
  props: {
    menu: {
      type: Object,
      required: true,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
  components: {
    ALazyIcon,
  },
});
</script>

<style scoped></style>
