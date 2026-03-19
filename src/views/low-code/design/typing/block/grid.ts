import { BlockType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.Block,
  type: BlockType.Grid,
  name: '栅格',
  children: [],
  options: {
    align: 'top',
    justify: 'start',
    gutter: 0,
    wrap: false,
    height: 200,
  },
};
