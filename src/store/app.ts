import { acceptHMRUpdate, defineStore } from 'pinia';

import type { PureSettings } from '@/components/base-layouts/defaultSettings';
import type { Locale } from '@/locales';
import { loadLanguageAsync } from '@/locales';

import type {
  ContentWidth,
  LayoutType,
  MenuTheme,
  MultiTabType,
} from '@/components/base-layouts/typing';

import { localStorage } from '@/utils/local-storage';
export const STORAGE_LANG_KEY = 'app_lang';

export interface AppState extends PureSettings {
  lang: string;
  device: 'mobile' | 'desktop' | string;
  transitionName: string;
  multiTab: boolean;
  multiTabFixed: boolean;
  multiTabType: MultiTabType;
}

const SET_LANG = 'SET_LANG';
const SET_DEVICE = 'SET_DEVICE';
const SET_LAYOUT = 'SET_LAYOUT';
const SET_NAV_THEME = 'SET_NAV_THEME';
const SET_CONTENT_WIDTH = 'SET_CONTENT_WIDTH';
const SET_FIXED_HEADER = 'SET_FIXED_HEADER';
const SET_FIXED_SIDEBAR = 'SET_FIXED_SIDEBAR';
const SET_PRIMARY_COLOR = 'SET_PRIMARY_COLOR';
const SET_COLOR_WEAK = 'SET_COLOR_WEAK';
const SET_SPLIT_MENUS = 'SET_SPLIT_MENUS';
const SET_TRANSITION_NAME = 'SET_TRANSITION_NAME';
const SET_MULTI_TAB = 'SET_MULTI_TAB';
const SET_FIXED_MULTI_TAB = 'SET_FIXED_MULTI_TAB';
const SET_MULTI_TAB_TYPE = 'SET_MULTI_TAB_TYPE';

export const DEFAULT_PRIMARY_COLOR = '#c7001a'; //165EFF
export const useAppStore = defineStore('app', {
  // https://github.com/prazdevs/pinia-plugin-persistedstate 提供
  persist: true, //process.env.NODE_ENV !== 'production',
  state: (): AppState => ({
    lang: 'zh-CN',
    device: 'desktop',
    layout: 'side',
    navTheme: 'light',
    contentWidth: 'Fluid',
    fixedHeader: true,
    fixedSidebar: true,
    menu: { locale: false },
    splitMenus: false,
    title: '中车长客',
    primaryColor: DEFAULT_PRIMARY_COLOR,
    colorWeak: false,
    transitionName: '',
    multiTab: true,
    multiTabFixed: false,
    multiTabType: 'smooth',
  }),
  actions: {
    async [SET_LANG](lang: Locale) {
      loadLanguageAsync(lang)
        .then(() => {
          this.lang = lang;
          localStorage.set(STORAGE_LANG_KEY, lang);
        })
        .catch(() => {});
    },
    [SET_DEVICE](device: string) {
      this.device = device;
    },
    [SET_LAYOUT](layout: LayoutType) {
      this.layout = layout;
    },
    [SET_NAV_THEME](navTheme: MenuTheme | 'realDark' | undefined) {
      this.navTheme = navTheme;
    },
    [SET_CONTENT_WIDTH](contentWidth: ContentWidth) {
      this.contentWidth = contentWidth;
    },
    [SET_FIXED_HEADER](fixedHeader: boolean) {
      this.fixedHeader = fixedHeader;
    },
    [SET_FIXED_SIDEBAR](fixedSidebar: boolean) {
      this.fixedSidebar = fixedSidebar;
    },
    [SET_PRIMARY_COLOR](color: string) {
      this.primaryColor = color;
    },
    [SET_COLOR_WEAK](colorWeak: boolean) {
      this.colorWeak = colorWeak;
    },
    [SET_SPLIT_MENUS](split: boolean) {
      this.splitMenus = split;
    },
    [SET_TRANSITION_NAME](name: string) {
      this.transitionName = name;
    },
    [SET_MULTI_TAB](isOpen: boolean) {
      this.multiTab = isOpen;
    },
    [SET_FIXED_MULTI_TAB](fixed: boolean) {
      this.multiTabFixed = fixed;
    },
    [SET_MULTI_TAB_TYPE](multiTabType: MultiTabType) {
      this.multiTabType = multiTabType;
    },
  },
  getters: {},
});
const hot = import.meta.webpackHot || (import.meta as any).hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useAppStore, hot));
}
