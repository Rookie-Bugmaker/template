<script lang="ts">
import { defineComponent, h, resolveComponent, mergeProps, inject } from 'vue';
import { flatten } from 'lodash';
import { BlockType } from '../../../typing/index';
import Page from './page.vue';
import DForm from './block/form/index.vue';
import DTable from './block/table/index.vue';
import DSearchForm from './block/search-form/index.vue';
import DCard from './block/card/index.vue';
import DTabs from './block/tabs/index.vue';
import DTabPane from './block/tab-pane/index.vue';
import DGrid from './block/grid/index.vue';
import DGridCol from './block/grid-col/index.vue';
import DTree from './block/tree/index.vue';

import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { removeBlock } from '@/views/low-code/design/utils/index';

export default defineComponent({
  name: 'ConfigTree',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const designerState = inject(designerStateInjectKey);

    const blockMap = new Map();

    designerState.currentBlockMap = blockMap;

    const blockRefsMap = new Map(); //莫名bug,用ref([])会导致多次渲染问题

    const setBlockRef = (el, uid) => {
      if (el) {
        blockRefsMap.set(uid, el);
      }
    };

    const isBlockNode = blockConfig => {
      return Object.values(BlockType).includes(blockConfig.type);
    };

    const renderConfigTree = blockConfig => {
      if (blockConfig === null) {
        return [];
      } else if (blockConfig.type === 'root') {
        blockMap.set(blockConfig.uid, blockConfig);
        const childDoms = flatten(
          blockConfig.children?.map(child => renderConfigTree(child)) || [],
        );
        return h(Page, { config: blockConfig, blockMap }, { default: () => childDoms });
      } else if (isBlockNode(blockConfig)) {
        blockMap.set(blockConfig.uid, blockConfig);
        const childDoms = flatten(
          blockConfig.children?.map(child => renderConfigTree(child)) || [],
        );
        return [decodeDom(blockConfig, childDoms)];
      }
    };

    //解码渲染的时候插入dom到同级
    const decodeDom = (blockConfig, childDoms: any[], props = {}) => {
      const otherProps = {};
      if (blockConfig.type === BlockType.TabPane) {
        otherProps['tab'] = blockConfig.options?.title;
      }
      return h(
        resolveComponent(`d-${blockConfig.type}`),
        {
          ...mergeProps(props, { config: blockConfig, blockMap }, otherProps),
          ref: el => setBlockRef(el, blockConfig.uid),
          key: blockConfig.uid,
          /* //定义事件，插入节点，删除节点，选中节点，复制/移动
          onInsertNode: nodeType => insertNode(nodeType, blockConfig),
          onDelNode: () => delNode(blockConfig),
          onSelectNode: () => selectNode(blockConfig),
          onCopyNode: () => copyBranch(blockConfig),
          onLeftMove: () => branchMove(blockConfig, -1),
          onRightMove: () => branchMove(blockConfig, 1), */
          onClick: e => handleBlockClick(e, blockConfig),
          onRemove: e => handleBlockRemove(e, blockConfig),
        },
        childDoms,
      );
    };

    const handleBlockClick = (e, blockConfig) => {
      e.stopPropagation();
      designerState.currentConfig = blockConfig;
    };

    const handleBlockRemove = (e, blockConfig) => {
      e.stopPropagation();
      removeBlock(blockConfig.uid, props.config);
      designerState.currentConfig = null;
    };

    return () => {
      blockMap.clear();
      blockRefsMap.clear();

      const domTree = props.config ? renderConfigTree(props.config) : [];

      return h('div', { class: '_root' }, domTree);
      // return renderConfigTree(props.config);
    };
  },
  components: {
    Page,
    DForm,
    DTable,
    DSearchForm,
    DCard,
    DTabs,
    DTabPane,
    DGrid,
    DGridCol,
    DTree,
  },
});
</script>

<style lang="less" scoped>
._root {
  width: 100%;
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
}
</style>
