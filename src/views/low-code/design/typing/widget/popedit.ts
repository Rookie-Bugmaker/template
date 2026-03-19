import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.Popedit,
  group: WidgetGroupType.Common,
  uid: '',
  name: '弹出框',
  label: '弹出框',
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
    valueField: '',
    textField: '',
    dataSource: {
      objectId: '',
      type: 'table', //'table' | 'view'
    },
    searchFormFields: [],
    tableColumns: [],
    brings: [], //带出字段设置 {sourceField:null,targetBlock:null,targetWidget:null}
    modalTitle: '',
    modalWidth: 750,
    multiple: false,
  },
  rules: [],
};
