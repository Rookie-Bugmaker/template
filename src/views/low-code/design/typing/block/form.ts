import { BlockType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.Block,
  type: BlockType.Form,
  name: '表单',
  fieldList: [],
  dataSource: {
    objectId: '',
    type: 'table',
    dataObjectId: '',
    dataObjectPrimaryKey: '',
    mappingRelations: [],
    beanName: null, //前后置增强
  },
  options: {
    title: '表单块',
    layout: 'horizontal',
    colNum: 2,
    labelAlign: 'right',
    itemRatio: [8, 16],
    gutter: [12, 12],
  },
  editable: {
    enabled: true, // default: true. if false, the form will not be editable.
  },
};
