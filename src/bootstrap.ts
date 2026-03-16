import '../public-path';

import 'ant-design-vue/dist/reset.css';
// import '@surely-vue/table/dist/index.less';
import 'uno.css';
import '@/assets/font/index.less';
import '@/assets/styles/global.less';
import {
  Layout,
  Menu,
  Row,
  Col,
  Card,
  Form,
  Dropdown,
  Select,
  Button,
  Checkbox,
  Tabs,
  Tag,
  Input,
  DatePicker,
  TimePicker,
  Radio,
  Tooltip,
  Space,
  Steps,
  Divider,
  Descriptions,
  Alert,
  // Result,
  // Statistic,
  Popconfirm,
  Popover,
  Table,
  Avatar,
  List,
  // Progress,
  Switch,
  Modal,
  // Rate,
  // ConfigProvider,
  Empty,
  Spin,
  Drawer,
  // PageHeader,
  Carousel,
  // FloatButton,
  Upload,
  Badge,
  Tree,
  InputNumber,
  Collapse,
  // Transfer,
  TreeSelect,
  Image,
  // Calendar,
  // StyleProvider,
  // Watermark,
  // Tour,
} from 'ant-design-vue';
// import STable from '@surely-vue/table';
import { createApp, h } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import router from './router';
import locale from './locales';
import App from './App.vue';

import { ProProvider, PageContainer, TransformVnode } from '@/components';
// import { useIcons } from '@/icons';
import Icon from '@/icon/index';
import Authority from './utils/authority/authority.vue';
import './app.less';
import './router/router-guards';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

//custom
// import { basicSetup } from 'codemirror';

// import VueCodemirror from 'vue-codemirror';
import VueGridLayout from 'vue-grid-layout';

import { Permission as PermissionDirective } from '@/directives/index';

import YlButton from './components/yl/button/index';
import YlModal from './components/yl/modal/index';
import YlTable from './components/yl/table/index';

//自定义加载状态组件
import YlLoading from './components/yl/loading/index.vue';
Spin.setDefaultIndicator({
  indicator: h(YlLoading, { style: { width: 'auto' } }),
});

//全局默认下拉框加搜索
if (Select?.props?.showSearch) {
  Select.props.showSearch.default = true;
  Select.props.filterOption.default = (options: any) => {
    //options 为Select实例的设置
    const labelKey = options?.fieldNames?.label || 'label';
    const descriptionKey = options?.fieldNames?.description || 'description';
    return (input: string, option: any) => {
      if (input && option) {
        return (
          option?.[labelKey]?.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
          option?.[descriptionKey]?.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      } else {
        return true;
      }
    };
  };
}

//设置number最大最小安全值
if (InputNumber?.props?.max) {
  InputNumber.props.max.default = Number.MAX_SAFE_INTEGER;
}
if (InputNumber?.props?.min) {
  InputNumber.props.min.default = Number.MIN_SAFE_INTEGER;
}

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app
  .use(router)
  .use(locale)
  // .use(STable)
  .use(Layout)
  .use(Menu)
  .use(Row)
  .use(Col)
  .use(Card)
  .use(Form)
  .use(Dropdown)
  .use(Select)
  .use(Button)
  .use(Checkbox)
  .use(Tabs)
  .use(Tag)
  .use(Input)
  .use(DatePicker)
  .use(TimePicker)
  .use(Radio)
  .use(Tooltip)
  .use(Space)
  .use(Steps)
  .use(Divider)
  .use(Descriptions)
  .use(Alert)
  // .use(Result)
  // .use(Statistic)
  .use(Popconfirm)
  .use(Popover)
  .use(Table)
  .use(Avatar)
  .use(List)
  // .use(Progress)
  .use(Switch)
  .use(Modal)
  // .use(Rate)
  // .use(ConfigProvider)
  .use(Empty)
  .use(Spin)
  .use(Drawer)
  // .use(PageHeader)
  .use(ProProvider)
  .use(Badge)
  .use(Carousel)
  .use(Upload)
  .use(InputNumber)
  .use(Tree)
  .use(Collapse)
  // .use(Transfer)
  .use(TreeSelect)
  .use(Image)
  // .use(Calendar)
  // .use(FloatButton)
  // .use(StyleProvider)
  // .use(Watermark)
  // .use(Tour)
  .use(Icon)
  .component(PageContainer.name, PageContainer)
  .component(TransformVnode.name, TransformVnode)
  .component(Authority.name, Authority)
  // .use(VueCodemirror, {
  //   // optional default global options
  //   autofocus: true,
  //   disabled: false,
  //   indentWithTab: true,
  //   tabSize: 2,
  //   placeholder: 'Code goes here...',
  //   extensions: [basicSetup],
  //   // ...
  // })
  .use(VueGridLayout)
  .use(YlButton)
  .use(YlModal)
  .use(YlTable)
  .directive(PermissionDirective.name, PermissionDirective);

// useIcons(app);

app.mount('#app');
