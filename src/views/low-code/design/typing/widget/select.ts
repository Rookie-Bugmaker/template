import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.Select,
  group: WidgetGroupType.Common,
  uid: '',
  name: '下拉框',
  label: '下拉框',
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
    mode: '', // '' | 'multiple'
    maxTagCount: 1,
    optionsType: 'fixed', // 'fixed' | 'dataSource'
    valueField: '',
    textField: '',
    optionsValueType: 'string', // 'string' | 'number'
    options: [],
    dataSource: {
      objectId: '',
      type: 'table', //'table' | 'view'
    },
    brings: [], //带出字段设置 {sourceField:null,targetBlock:null,targetWidget:null}
    autoSelectSingleOption: false, //值列表只有一条数据时自动选中
    showDescription: false,
    descriptionField: '',
  },
  rules: [],
};
