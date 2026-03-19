import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.SerialNumber,
  group: WidgetGroupType.Advanced,
  uid: '',
  name: '流水号',
  label: '流水号',
  layout: {
    colspan: null,
    itemRatio: null,
    frontCol: null,
    rearCol: null,
  },
  options: {
    hidden: false, //是否隐藏
    size: 'default', //default | small  | large
    //填编码或者选编码,接口有问题，现在只能填编码
    //encodeRuleId: '',
    encodeRuleCode: '',
  },
};
