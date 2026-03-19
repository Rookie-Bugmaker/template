import { BlockType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.Block,
  type: BlockType.SearchForm,
  name: '查询',
  fieldList: [],
  searchSetting: {
    type: 'table',
    objectId: '',
    mappingRelations: [],
    params: [], //[{uid:'',key:'',value:'',type:''}] type:'varchar2' | 'number' | 'date'
  },
  options: {
    title: '查询块',
    layout: 'horizontal',
    colNum: 2,
    labelAlign: 'right',
    itemRatio: [8, 16],
    gutter: [12, 12],
  },
};
