import { BlockType, MainType } from '../typing';

export const defaultConfig = {
  mainType: MainType.Block,
  type: BlockType.Tabs,
  name: '标签页',
  children: [],
  options: {
    size: 'default', //large | default | small
    type: 'line', //line | card
    centered: false, //标签居中展示
    tabBarGutter: null, //tabs 之间的间隙
    tabPosition: 'top', //页签位置， top | right | bottom |
  },
};
