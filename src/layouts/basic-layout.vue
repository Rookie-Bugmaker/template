<template>
  <pro-provider :content-width="contentWidth">
    <a-layout class="ant-pro-basicLayout" ref="elRef">
      <template v-if="isMobile">
        <a-drawer
          :bodyStyle="{ padding: 0, height: '100%' }"
          placement="left"
          :width="sideWidth"
          :closable="false"
          :open="!collapsed"
          @update:open="updateCollapsed"
        >
          <sider-menu
            style="height: 100%"
            :theme="theme"
            :layout="layout"
            :fixed="fixedSidebar"
            :menus="menus"
            :sider-width="sideWidth"
            :split-menus="false"
            :collapsed-button="false"
            :collapsed="false"
            :menu-loading="menuLoading"
            v-model:open-keys="openKeys"
            v-model:selected-keys="selectedKeys"
          />
        </a-drawer>
      </template>
      <sider-menu
        v-else-if="!hasTopMenu"
        :theme="theme"
        :layout="layout"
        :fixed="fixedSidebar"
        :menus="menus"
        :sider-width="sideWidth"
        :split-menus="splitMenus"
        :collapsed-button="!splitMenus"
        :menu-loading="menuLoading"
        v-model:collapsed="collapsed"
        v-model:open-keys="openKeys"
        v-model:selected-keys="selectedKeys"
      />
      <a-layout>
        <header-view
          :theme="theme"
          :layout="layout"
          :menus="menus"
          :sider-width="sideWidth"
          :has-sider-menu="hasSideMenu"
          :fixed-header="fixedHeader"
          :split-menus="splitMenus"
          :menu-loading="menuLoading"
          v-model:collapsed="collapsed"
          v-model:open-keys="openKeys"
          v-model:selected-keys="selectedKeys"
        >
          <div style="text-align: right; display: flex; align-items: center">
            <global-search />
            <!-- <notice-icon /> -->
            <setting-fullscreen
              :screen-state="screenState"
              @set-full="setFull"
              @exit-full="exitFull"
            />
            <select-lang />
            <setting-drawer />
            <avatar-dropdown :current-user="currentUser" />
          </div>
        </header-view>
        <multi-tab-vue
          v-if="multiTab"
          :fixed="multiTabFixed"
          :sider-width="sideWidth"
          :custom-type="multiTabType"
        />
        <router-view v-slot="{ Component }" v-show="!(externalLink && isKeepAlive)">
          <wrap-content>
            <component :is="Component"></component>
          </wrap-content>
        </router-view>
        <external-link-keep-alive-view />
        <!-- <global-footer /> -->
      </a-layout>
    </a-layout>
  </pro-provider>
</template>

<script lang="ts">
import { defineComponent, computed, inject, ref /*  watch  */ } from 'vue';
import { useI18n } from 'vue-i18n';
import { genMenuInfo } from '@/utils/menu-util';
import { default as WrapContent } from '@/components/base-layouts/wrap-content/index.vue';
// import { default as GlobalFooter } from '@/components/base-layouts/global-footer/index.vue';
import { default as SiderMenu } from '@/components/base-layouts/sider-menu/index.vue';
import { default as HeaderView } from '@/components/base-layouts/header/index.vue';
import { default as GlobalSearch } from '@/components/global-search/index.vue';
import { default as SettingFullscreen } from '@/components/setting-fullscreen/index.vue';
import { default as SelectLang } from '@/components/select-lang/index.vue';
import { default as AvatarDropdown } from '@/components/avatar-dropdown/index.vue';
import { default as SettingDrawer } from '@/components/setting-drawer/index.vue';
// import { default as NoticeIcon } from '@/components/notice-icon/index.vue';

import { useFullscreen } from '@/utils/hooks/useFullscreen';

import { MultiTab as MultiTabVue } from '@/components/multi-tab';
import { injectMenuState } from './use-menu-state';
import { useAuth } from '@/utils/authority';
import { useUserStore } from '@/store/user';

import { useRoute } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import ExternalLinkKeepAliveView from './external-link-keep-alive-view.vue';
import { MultiTabStoreConsumer } from '@/components/multi-tab';

export enum Action {
  ADD = 'add',
  DELETE = 'delete',
  UPDATE = 'update',
  QUERY = 'query',
  IMPORT = 'import',
  EXPORT = 'export',
}

export default defineComponent({
  name: 'BasicLayout',
  setup() {
    const userStore = useUserStore();
    const { t } = useI18n();
    const menuState = injectMenuState();
    const isMobile = inject('isMobile', ref(false));
    const currentUser = computed(() => userStore.currentUser);
    const menuLoading = computed(() => userStore.loadingDynamicRouters);
    const hasSideMenu = computed(
      () => menuState.layout.value === 'side' || menuState.layout.value === 'left',
    );
    const hasTopMenu = computed(() => menuState.layout.value === 'top');
    const hasAuth = useAuth([Action.DELETE, Action.ADD]);
    /* watch(
      hasAuth,
      () => {
        console.log('hasAuth', hasAuth.value);
      },
      { immediate: true },
    ); */
    // gen menus
    const allowRouters = computed(() => userStore.allowRouters); // genMenuInfo(filterMenu(routes)).menus;
    const menus = computed(() => genMenuInfo(allowRouters.value as RouteRecordRaw[]).menus);

    const [elRef, screenState, { setFull, exitFull }] = useFullscreen();

    const route = useRoute();
    const isKeepAlive = computed(() => route?.meta?.keepAlive);
    const externalLink = computed(() => route?.meta?.externalLink);

    return {
      t,
      currentUser,
      menuLoading,
      menus,
      ...menuState,
      hasSideMenu,
      hasTopMenu,
      isMobile,
      hasAuth,

      //fullScreen
      elRef,
      screenState,
      setFull,
      exitFull,

      isKeepAlive,
      externalLink,
    };
  },
  components: {
    MultiTabVue,
    WrapContent,
    SiderMenu,
    // GlobalFooter,
    HeaderView,
    GlobalSearch,
    SettingFullscreen,
    SelectLang,
    AvatarDropdown,
    SettingDrawer,
    // NoticeIcon,
    ExternalLinkKeepAliveView,
    MultiTabStoreConsumer,
  },
});
</script>

<style lang="less">
body {
  @import '../components/base-layouts/basic-layout.less';
}
</style>
