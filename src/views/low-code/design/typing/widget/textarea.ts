import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.Textarea,
  group: WidgetGroupType.Common,
  uid: '',
  name: '多行文本',
  label: '多行文本框',
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
    allowClear: true,
    showCount: false, //是否展示字数
    autosize: { minRows: 2, maxRows: 4 },
  },
  rules: [],
};
