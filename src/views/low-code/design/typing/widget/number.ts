import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.Number,
  group: WidgetGroupType.Common,
  uid: '',
  name: '数值',
  label: '数值输入框',
  layout: {
    colspan: null,
    itemRatio: null,
    frontCol: null,
    rearCol: null,
  },
  options: {
    disabled: false, //是否禁用
    hidden: false, //是否隐藏
    required: false, //是否必填
    requiredMessage: '此项必填', //必填提示
    placeholder: '',
    size: 'default', //default | small  | large
    controls: true, //是否显示增减按钮
    max: null,
    min: null,
    step: 1,
    precision: null, //数值精度
  },
  rules: [],
};
