<template>
  <div :class="classNames">
    <div ref="headRef" :class="headerClassName">
      <div :class="`${prefixedClassName}-main-left`" @click="handleMenuHeaderClick">
        <div :class="`${prefixedClassName}-logo`" key="logo" id="logo">
          <slot v-if="hasLogoSlot" name="logo" />
          <div v-else>
            <router-link :to="{ name: 'index' }">
              <!-- <h1>中车长客</h1> -->
              <img
                v-if="theme === 'dark'"
                src="@/assets/image/menu/header-logo-cccar-dark.png"
                alt="logo"
              />
              <img v-else src="@/assets/image/menu/header-logo-cccar-light.png" alt="logo" />
            </router-link>
          </div>
        </div>
      </div>
      <div :style="{ flex: 1 }" :class="`${prefixedClassName}-menu`">
        <Suspense>
          <base-menu
            v-if="menus && menus.length > 0 && !menuLoading"
            mode="horizontal"
            :theme="theme"
            :menus="menus"
            :open-keys="openKeys"
            :selected-keys="selectedKeys"
            @update:openKeys="handleOpenKeys"
            @update:selectedKeys="handleSelectedKeys"
          />
          <template #fallback>
            <div class="menu-loading">
              <loading-outlined :style="{ marginRight: '8px', marginLeft: '-18px' }" />
              菜单加载中
            </div>
          </template>
        </Suspense>
        <div v-if="menuLoading" class="menu-loading">
          <loading-outlined :style="{ marginRight: '8px', marginLeft: '-18px' }" />
          菜单加载中
        </div>
      </div>
      <right-content>
        <slot name="rightContent" />
      </right-content>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, computed, toRefs, defineAsyncComponent } from 'vue';
import { useProProvider } from '../pro-provider/index';
// import BaseMenu from '@/components/base-layouts/base-menu/index.vue';
const BaseMenu = defineAsyncComponent(
  () => import('@/components/base-layouts/base-menu/index.vue'),
);
import RightContent from '../top-nav-header/right-content.vue';
import type { RouteProps } from '../typing';
import type { MenuTheme } from 'ant-design-vue';

export default defineComponent({
  props: {
    prefixCls: {
      type: String,
      default: undefined,
    },
    layout: {
      type: String,
      default: 'side',
    },
    theme: {
      type: String as PropType<MenuTheme>,
      default: 'dark',
    },
    contentWidth: {
      type: String,
      default: 'Fluid',
    },

    // menu
    menus: {
      type: Array as PropType<RouteProps[]>,
      default: () => [],
    },
    openKeys: {
      type: Array as PropType<string[]>,
      required: true,
    },
    selectedKeys: {
      type: Array as PropType<string[]>,
      required: true,
    },
    menuLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:openKeys', 'update:selectedKeys'],
  setup(props, { slots, emit }) {
    const { theme, contentWidth, prefixCls: customizePrefixCls } = toRefs(props);
    const { getPrefixCls } = useProProvider();
    const prefixedClassName = customizePrefixCls.value || getPrefixCls('top-nav-header');

    const hasMix = computed(() => props.layout === 'mix');
    const classNames = computed(() => {
      return {
        [prefixedClassName]: true,
        ['light']: theme.value === 'light',
      };
    });
    const headerClassName = computed(() => {
      return {
        [`${prefixedClassName}-main`]: true,
        ['wide']: contentWidth.value === 'Fixed',
      };
    });
    const { logo: hasLogoSlot } = slots;

    /** events */
    const handleSelectedKeys = (selectedKeys: string[]): void => {
      emit('update:selectedKeys', selectedKeys);
    };
    const handleOpenKeys = (openKeys: string[]): void => {
      emit('update:openKeys', openKeys);
    };
    const handleMenuHeaderClick = (): void => {};

    return {
      classNames,
      headerClassName,
      prefixedClassName,
      hasMix,
      hasLogoSlot,

      handleSelectedKeys,
      handleOpenKeys,
      handleMenuHeaderClick,
    };
  },
  components: {
    BaseMenu,
    RightContent,
  },
});
</script>

<style lang="less">
#app-body {
  @import url('./index.less');
}
</style>
