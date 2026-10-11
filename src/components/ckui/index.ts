/**
 * CRRC UI 组件库统一导出入口
 *
 * 使用方式：
 *   import { CkButton, CkInput, CkCard } from '@/components/ckui'
 *
 * 或直接引入全量组件：
 *   import '@/components/ckui'
 */

/* ---- 主题样式（CSS Variables，必须在组件之前引入） ---- */
import './theme/index.less';

/* ---- 组件导入 ---- */
import CkButton from './components/CkButton/index.vue';
import CkInput from './components/CkInput/index.vue';
import CkSelect from './components/CkSelect/index.vue';
import CkCheckbox from './components/CkCheckbox/index.vue';
import CkRadio from './components/CkRadio/index.vue';
import CkSwitch from './components/CkSwitch/index.vue';
import CkTag from './components/CkTag/index.vue';
import CkBadge from './components/CkBadge/index.vue';
import CkCard from './components/CkCard/index.vue';
import CkAlert from './components/CkAlert/index.vue';
import CkModal from './components/CkModal/index.vue';
import CkTable from './components/CkTable/index.vue';
import CkTabs from './components/CkTabs/index.vue';
import CkSteps from './components/CkSteps/index.vue';
import CkProgress from './components/CkProgress/index.vue';
import CkDrawer from './components/CkDrawer/index.vue';

/* ---- 主题切换工具函数 ---- */
export { setTheme, getTheme } from './theme/theme-switcher';

/* ---- 导出所有组件 ---- */
export {
  CkButton,
  CkInput,
  CkSelect,
  CkCheckbox,
  CkRadio,
  CkSwitch,
  CkTag,
  CkBadge,
  CkCard,
  CkAlert,
  CkModal,
  CkTable,
  CkTabs,
  CkSteps,
  CkProgress,
  CkDrawer,
};

/**
 * 全量组件列表（用于 Vue.use() 全局注册）
 *
 * 使用方式：
 *   import { ckuiComponents } from '@/components/ckui'
 *   app.use(ckuiComponents)
 */
export const ckuiComponents = {
  install(app: any) {
    const components = [
      CkButton, CkInput, CkSelect, CkCheckbox, CkRadio,
      CkSwitch, CkTag, CkBadge, CkCard, CkAlert,
      CkModal, CkTable, CkTabs, CkSteps, CkProgress, CkDrawer,
    ];
    components.forEach((component) => {
      app.component(component.name, component);
    });
  },
};

/* ---- 默认导出：全量组件列表（支持解构导入） ---- */
export default {
  CkButton, CkInput, CkSelect, CkCheckbox, CkRadio,
  CkSwitch, CkTag, CkBadge, CkCard, CkAlert,
  CkModal, CkTable, CkTabs, CkSteps, CkProgress, CkDrawer,
};
