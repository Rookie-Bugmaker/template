import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.Button,
  group: WidgetGroupType.Common,
  uid: '',
  name: '按钮',
  label: '',
  layout: {
    colspan: null,
    itemRatio: null,
    frontCol: null,
    rearCol: null,
  },
  options: {
    disabled: false, //是否禁用
    hidden: false, //是否隐藏
    text: '操作',
    type: 'link', // 'link' | '' | 'primary' | 'dashed'
    danger: false,
    size: 'middle', //large | middle | small
    shape: 'default', //default | circle | round
    eventType: '', //绑定事件类型 '':无 | 'config':图形化配置 | 'custom':自定义
    customFn: '', //自定义事件
  },
};
