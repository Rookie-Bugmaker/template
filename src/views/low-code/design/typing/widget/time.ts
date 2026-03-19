import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.Time,
  group: WidgetGroupType.Common,
  uid: '',
  name: '时间',
  label: '时间',
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
    size: 'middle', //large | middle | small
    allowClear: true,
    inputReadOnly: false, //设置输入框为只读
    format: 'HH:mm:ss', //HH:mm:ss
  },
  rules: [],
};
