<script lang="ts">
import { defineComponent, h, resolveComponent, mergeProps, inject, /* ref, */ nextTick } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { flatten } from 'lodash';
import { BlockType } from '@/views/low-code/parser/typing/index';
import { parserStateInjectKey } from '@/views/low-code/parser/keys';
import DPageWrapper from './page-wrapper.vue';
import DForm from './block/form/index.vue';
import DTable from './block/table/index.vue';
import DSearchForm from './block/search-form/index.vue';
import DCard from './block/card/index.vue';
import DTabs from './block/tabs/index.vue';
import DTabPane from './block/tab-pane/index.vue';
import DGrid from './block/grid/index.vue';
import DGridCol from './block/grid-col/index.vue';
import DTree from './block/tree/index.vue';

export default defineComponent({
  name: 'ConfigPage',
  props: {
    config: {
      type: Object,
      required: true,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    withoutRelation: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { expose }) {
    const parserState = inject(parserStateInjectKey);

    const blockMap = new Map();

    const blockRefMap = new Map(); //莫名bug,用ref([])会导致多次渲染问题

    const setBlockRef = (el, uid) => {
      if (el) {
        blockRefMap.set(uid, el);
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
        // return h('div', null, { default: () => childDoms });
        return childDoms as any[];
      } else if (isBlockNode(blockConfig)) {
        blockMap.set(blockConfig.uid, blockConfig);
        const childDoms = flatten(
          blockConfig.children?.map(child => renderConfigTree(child)) || [],
        );
        return [decodeDom(blockConfig, childDoms)];
      }
    };

    const renderTabTitle = blockConfig => {
      const title = blockConfig?.options?.title;
      const titleFunc = blockConfig?.options?.titleFunc;
      if (titleFunc) {
        const f = eval(`(function x (modelData, state){${titleFunc}})`);
        const r = f(title, parserState);
        return r ? r : title;
      } else {
        return title;
      }
    };

    //解码渲染的时候插入dom到同级
    const decodeDom = (blockConfig, childDoms: any[], pProps = {}) => {
      const otherProps = {};
      if (blockConfig.type === BlockType.TabPane) {
        otherProps['tab'] = renderTabTitle(blockConfig); //blockConfig.options?.title;
      }
      return h(
        resolveComponent(`d-${blockConfig.type}`),
        {
          ...mergeProps(
            pProps,
            {
              config: blockConfig,
              blockMap,
              params: props.params,
              withoutRelation: props.withoutRelation,
            },
            otherProps,
          ),
          ref: el => setBlockRef(el, blockConfig.uid),
          key: blockConfig.uid,
        },
        childDoms,
      );
    };

    // const pageLoading = ref(false);

    //获取当前是新增还是修改，表单要么全都是新增，要么全都是修改，表单新增则整个页面都是新增
    const isCreate = () => {
      const formConfigArr = Array.from(blockMap.values()).filter(f => f?.type === BlockType.Form);
      return formConfigArr.some(m => blockRefMap.get(m.uid)?.getIsCreate?.());
    };

    //保存子页面数据（仅表单）
    const savePageData = async () => {
      //找到全部表格配置（表格需要先提示保存，然后再处理表单数据）
      const tableConfigArr = Array.from(blockMap.values()).filter(f => f?.type === BlockType.Table);
      if (tableConfigArr.some(s => blockRefMap.get(s.uid)?.hasEditingRow?.())) {
        message.warning('请先保存正在编辑的行数据！');
        return;
      }
      //找到全部表单配置
      const formConfigArr = Array.from(blockMap.values()).filter(f => f?.type === BlockType.Form);
      try {
        //全部表单验证
        await Promise.all(formConfigArr.map(m => blockRefMap.get(m.uid)?.validate()));

        //去重，拥有相同dataObjectId的form，属于同一个model，只调用第一个form的submit即可
        const submitFormConfigArr = formConfigArr.filter(
          (item, index) =>
            index ===
            formConfigArr.findIndex(
              f => f?.dataSource?.dataObjectId === item?.dataSource?.dataObjectId,
            ),
        );
        try {
          // pageLoading.value = true;
          parserState.pageLoading = true;
          const result = await Promise.all(
            submitFormConfigArr.map(m => blockRefMap.get(m.uid)?.submit()),
          );
          message.success(result?.[0]?.title);
          return true;
        } catch (err: any) {
          Modal.error({
            title: err.title,
            content: err.message,
          });
          return false;
        } finally {
          // pageLoading.value = false;
          parserState.pageLoading = false;
        }
      } catch (e) {
        // console.trace(e);
        message.warning('校验失败');
        return false;
      }
    };

    expose({ savePageData, isCreate });

    /* if (!parserState.pageLoading) {
      parserState.pageLoading = pageLoading.value;
    } */

    return () => {
      blockMap.clear();
      blockRefMap.clear();

      const domTree = props.config ? renderConfigTree(props.config) : [];

      //要等渲染完才能正确获取到Ref
      nextTick(() => {
        //子页面和父页面公用parserState.block，父页面的block信息不能被覆盖，所以要判断之前block有没有数据，有的话是赋值而不是覆盖
        if (parserState.block?.get) {
          Array.from(blockRefMap.keys()).forEach(k => {
            parserState.block?.set(k, blockRefMap.get(k));
          });
        } else {
          parserState.block = blockRefMap;
        }

        if (parserState.blockConfig?.get) {
          Array.from(blockMap.keys()).forEach(k => {
            parserState.blockConfig?.set(k, blockMap.get(k));
          });
        } else {
          parserState.blockConfig = blockMap;
        }
      });

      return h(DPageWrapper, { ...mergeProps({ loading: parserState.pageLoading }) }, domTree);
      // return renderConfigTree(props.config);
    };
  },
  components: {
    DPageWrapper,
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
