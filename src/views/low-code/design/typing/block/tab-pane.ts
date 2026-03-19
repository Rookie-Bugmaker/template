import { BlockType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.Block,
  type: BlockType.TabPane,
  name: '选项卡',
  children: [],
  options: {
    title: '选项卡',
    //icon: '',
    height: null,
  },
};
