import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.UploadImage,
  group: WidgetGroupType.Common,
  uid: '',
  name: '图片上传',
  label: '图片上传',
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
    type: 'preview', //preview | dialog | input
    placeholder: '',
    size: 'middle', //large | middle | small
    multiple: false,
    maxFileSize: null,
    maxCount: null,
    accept: '',
    width: 60,
    height: 60,
    miniSelectBtn: false, //input模式下的button大小
  },
  rules: [],
};
