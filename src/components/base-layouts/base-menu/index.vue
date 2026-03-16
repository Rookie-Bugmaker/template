<template>
  <a-menu
    :theme="theme"
    :mode="mode"
    :open-keys="openKeys"
    :selected-keys="selectedKeys"
    @openChange="handleOpenChange"
    @select="handleSelect"
    v-bind="dynamicProps"
    @mouseenter="$emit('mouseenter', $event)"
    @mouseleave="$emit('mouseleave', $event)"
    :forceSubMenuRender="false"
  >
    <template v-for="menu in menus">
      <transform-vnode
        v-if="(!menu.children || menu.meta?.hideChildrenInMenu) && !menu.meta?.hideInMenu"
        :key="menu.path"
        :by="customItem"
        :opt="menu"
      >
        <a-menu-item @mouseenter="$emit('itemHover', { key: menu.path })" :key="menu.path">
          <template #icon>
            <!-- <template v-if="menu.meta.icon !== undefined">
              <component :is="menu.meta.icon" />
            </template> -->
            <a-lazy-icon v-if="menu.meta.icon !== undefined" :icon="menu.meta.icon" />
            <template v-else-if="collapsed && menu.meta.collapsedIcon !== undefined">
              <component :is="menu.meta.collapsedIcon" />
            </template>
          </template>
          <span :title="t(menu.meta.title)">{{ t(menu.meta.title) }}</span>
        </a-menu-item>
      </transform-vnode>
      <div v-else-if="menu.children" :key="'sub_' + menu.path">
        <sub-menu
          :key="menu.path"
          @itemHover="$emit('itemHover', $event)"
          :menu="menu"
          :collapsed="collapsed"
        />
      </div>
    </template>
  </a-menu>
</template>

<script lang="ts">
import type { MenuProps, MenuTheme } from 'ant-design-vue';
import type { ComputedRef, PropType } from 'vue';
import { defineComponent, computed, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import type { RouteProps } from '../typing';
// import SubMenu from './sub-menu.vue';
const SubMenu = defineAsyncComponent(() => import('./sub-menu.vue'));
// import ALazyIcon from './lazy-icon.vue';
const ALazyIcon = defineAsyncComponent(() => import('./lazy-icon.vue'));

export function useRootSubmenuKeys(menus: RouteProps[]): ComputedRef<string[]> {
  return computed(() => menus.map(it => it.path));
}

export const BaseMenuProps = {
  locale: {
    type: Boolean,
    default: false,
  },
  menus: {
    type: Array as PropType<RouteProps[]>,
    required: true,
  },
  // top-nav-header: horizontal
  mode: {
    type: String as PropType<MenuProps['mode']>,
    default: 'inline',
  },
  theme: {
    type: String as PropType<MenuTheme>,
    default: 'dark',
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
  openKeys: {
    type: Array as PropType<string[]>,
    required: true,
  },
  selectedKeys: {
    type: Array as PropType<string[]>,
    required: true,
  },
  customItem: {
    type: Function,
    default: undefined,
  },
  underSider: Boolean,
};

export default defineComponent({
  name: 'BaseMenu',
  props: { ...BaseMenuProps },
  emits: ['update:openKeys', 'update:selectedKeys', 'mouseenter', 'mouseleave', 'itemHover'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const isInline = computed(() => props.mode === 'inline');
    const dynamicProps = computed(() => {
      return isInline.value
        ? { [props.underSider ? 'collapsed' : 'inlineCollapsed']: props.collapsed }
        : {};
    });
    const handleOpenChange = (openKeys: string[]): void => {
      // console.log('openKeys', openKeys);
      //菜单自动收起
      const latestOpenKey = openKeys.find(
        (key: string) => (props.openKeys as string[]).indexOf(key) === -1,
      );
      if ((props.menus as RouteProps[]).find(m => m.path === latestOpenKey)) {
        emit('update:openKeys', latestOpenKey ? [latestOpenKey] : []);
      } else {
        emit('update:openKeys', openKeys);
      }
      //菜单不收起
      // emit('update:openKeys', openKeys);
    };
    const handleSelect = (ctx: { [key: string]: any }): void => {
      emit('update:selectedKeys', ctx.selectedKeys);
    };
    return {
      t,
      isInline,
      dynamicProps,
      handleOpenChange,
      handleSelect,
      handleTest: () => {},
    };
  },
  components: {
    SubMenu,
    ALazyIcon,
  },
});
</script>
