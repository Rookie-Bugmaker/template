import globals from './global/en-US';
import routes from './routes/en-US';
import pages from './pages/en-US';
import hooks from './hook/en-US';
import antd from 'ant-design-vue/es/locale/en_US';
import dayjs from 'dayjs/locale/en';

import settingDrawerLocales from '@/components/setting-drawer/locales/en-US';
import dataAuthTableLocales from '@/components/system/data-auth-table/locales/en-US';

import ylButtonLocales from '@/components/yl/button/locales/en-US';

import systemOrgLocales from '@/views/system/org/locales/en-US';

const locales = {
  localeName: 'enUS',
  dayjsLocaleName: 'en',
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

export default locales;
