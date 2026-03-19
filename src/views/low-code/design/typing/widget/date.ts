import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.Date,
  group: WidgetGroupType.Common,
  uid: '',
  name: '日期时间',
  label: '日期时间',
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
    //mode: 'date', //time | date | month | year | decade
    picker: '', // '' | month(YYYY-MM) | week(YYYY-wo) | year(YYYY) | quarter(YYYY-\QQ)
    format: '',
    showTime: false,
    valueFormat: null,
  },
  rules: [],
};
