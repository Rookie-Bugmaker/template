import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.Switch,
  group: WidgetGroupType.Common,
  uid: '',
  name: '开关',
  label: '开关',
  layout: {
    colspan: null,
    itemRatio: null,
    frontCol: null,
    rearCol: null,
  },
  options: {
    disabled: false, //是否禁用
    hidden: false, //是否隐藏
    size: 'default', //default | small
    checkedValue: 'Y',
    unCheckedValue: 'N',
    checkedChildren: '',
    unCheckedChildren: '',
  },
};
