import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.Dept,
  group: WidgetGroupType.Advanced,
  uid: '',
  name: '部门',
  label: '部门',
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
    multiple: false, //是否可以多选，默认为false
    maxTagCount: 1, //最多显示多少个 tag
    treeDefaultExpandAll: false,
    parentValue: null,
  },
};
