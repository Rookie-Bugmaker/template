import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.Input,
  group: WidgetGroupType.Common,
  uid: '',
  name: '单行文本',
  label: '单行文本框',
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
    allowClear: true,
    allowSpaces: false, //允许输入空格，默认input在v-model:value时都会带trim
    //maxlength: null, //最大长度
  },
  rules: [],
};
