import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.Password,
  group: WidgetGroupType.Common,
  uid: '',
  name: '密码',
  label: '密码框',
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
    //maxlength: null, //最大长度
  },
  rules: [],
};
