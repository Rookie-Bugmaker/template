import { BlockType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.Block,
  type: BlockType.Tree,
  name: '树',
  dataSource: {
    type: 'table', //'table' | 'view'
    objectId: '',
    dataObjectId: '',
    dataObjectPrimaryKey: '',
    mappingRelations: [],
    beanName: null, //前后置增强
    sort: [],
  },
  options: {
    title: '树',
    disabled: false,
    disabledType: null, //禁用类型 null 不禁用 ｜ 'root' 禁用根节点 | 'notLeaf' 禁用非叶子节点 | 'custom' 自定义禁用
    disabledCondition: null, //自定义禁用条件
    autoExpandParent: false,
    defaultExpandAll: true,
    showLine: false,
    showIcon: false,
    showSearch: true,
    searchPlaceholder: '输入节点信息进行搜索',
    fieldNames: {
      key: '',
      title: '',
      children: 'children',
      parentKey: '',
      descriptionKey: '',
    },
  },
};
