import { WidgetType, WidgetGroupType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.FormWidget,
  type: WidgetType.UploadFile,
  group: WidgetGroupType.Common,
  uid: '',
  name: '附件上传',
  label: '附件上传',
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
    multiple: false,
    type: 'button', // button | input | dialog
    placeholder: '',
    size: 'middle', //large | middle | small
    maxFileSize: null,
    maxCount: null,
    accept: '',
    miniSelectBtn: false, //input模式下的button大小
    preview: true,
  },
  rules: [],
};
