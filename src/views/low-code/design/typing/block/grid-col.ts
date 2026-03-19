import { BlockType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.Block,
  type: BlockType.GridCol,
  name: '栅格列',
  children: [],
  options: {
    span: 12,
    offset: 0,
    pull: 0,
    push: 0,
  },
};
