import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.ValueSet,
  group: WidgetGroupType.Advanced,
  uid: '',
  name: '值集',
  label: '值集',
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
    setCode: '', //集编码
    multiple: false, //是否可以多选，默认为false
    maxTagCount: 1, //最多显示多少个 tag
    codeValue: true, //是否使用编码作为值存储
    parentValue: null, //绑定的父值集字段
    parentCodeValue: true, //父值集是否使用编码作为值存储
  },
};
