import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.TreeSelect,
  group: WidgetGroupType.Common,
  uid: '',
  name: '树形选择',
  label: '树形选择',
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
    optionsType: 'dataSource', // 'fixed' | 'dataSource'
    valueField: '',
    textField: '',
    parentField: '',
    options: [],
    dataSource: {
      objectId: '',
      type: 'table', //'table' | 'view'
    },
    limit: 'none', //选择限制 'none'无限制|'leaf'仅能叶子节点|'notRoot'非根节点
  },
  rules: [],
};
