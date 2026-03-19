import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.Checkbox,
  group: WidgetGroupType.Common,
  uid: '',
  name: '复选组',
  label: '复选组',
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
    orientation: 'horizontal', //'horizontal' | 'vertical'
    optionsType: 'fixed', // 'fixed' | 'dataSource'
    valueField: '',
    textField: '',
    optionsValueType: 'string', // 'string' | 'number'
    options: [],
    dataSource: {
      objectId: '',
      type: 'table', //'table' | 'view'
    },
  },
  rules: [],
};
