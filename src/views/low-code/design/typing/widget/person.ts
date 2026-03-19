import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.Person,
  group: WidgetGroupType.Advanced,
  uid: '',
  name: '人员',
  label: '人员',
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
    requiredMessage: '此项必选', //必填提示
    placeholder: '',
    size: 'default', //default | small  | large
    allowClear: true,
    multiple: false,
    maxTagCount: null,
    miniSelectBtn: false, //弹窗button大小
  },
  rules: [],
};
