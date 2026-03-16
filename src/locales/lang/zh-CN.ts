import globals from './global/zh-CN';
import routes from './routes/zh-CN';
import pages from './pages/zh-CN';
import hooks from './hook/zh-CN';
import antd from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs/locale/zh-cn';

import settingDrawerLocales from '@/components/setting-drawer/locales/zh-CN';
import dataAuthTableLocales from '@/components/system/data-auth-table/locales/zh-CN';

import ylButtonLocales from '@/components/yl/button/locales/zh-CN';

import systemOrgLocales from '@/views/system/org/locales/zh-CN';

const locales = {
  localeName: 'zhCN',
  dayjsLocaleName: 'zh-cn',
  antd,
  dayjs,

  ...hooks,
  ...globals,
  ...routes,
  ...pages,

  ...settingDrawerLocales,
  ...dataAuthTableLocales,
  ...ylButtonLocales,

  ...systemOrgLocales,
};

export default {
  ...locales,
};
