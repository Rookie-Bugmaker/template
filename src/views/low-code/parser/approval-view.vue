<template>
  <v-page-wrapper :loading="vPageLoading">
    <v-page
      ref="vPageRef"
      :config="workflowConfig"
      :params="
        relation
          ? { primaryKey: bizId, [relation.childKey]: bizId }
          : {
              primaryKey: bizId,
            }
      "
    />
    <a-button
      v-if="isChildPage && editable"
      type="primary"
      style="float: right; margin-top: 8px"
      @click="handleClickSave"
    >
      保存修改
    </a-button>
  </v-page-wrapper>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import VPage from './components/page.vue';
import VPageWrapper from './components/page-wrapper.vue';
import { useParserState } from './hooks/useParserState';
import { BlockType } from '@/views/low-code/parser/typing/index';
import { flatten } from 'lodash';
import {
  disabledTable,
  disabledChildPage,
  onlyEditChildPage,
  onlyEditTable,
} from '@/views/low-code/parser/utils/disable-view';

//审批界面专用组件
export default defineComponent({
  name: '',
  props: {
    pageId: {
      type: String,
      default: '',
    },
    bizId: {
      type: String,
      default: '',
    },
    //处理人权限下，可编辑表单
    editable: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { state } = useParserState(props.pageId);

    //寻找配置了工作流的表格列表
    const getWorkflowTable = blockConfigs => {
      return blockConfigs.reduce((a, b) => {
        if (b.type === BlockType.Table && b.workflow?.enabled) {
          a.push(b);
        }
        if (b.children?.length) {
          a.push(...getWorkflowTable(b.children));
        }
        return a;
      }, []);
    };

    //如果审批页绑定的是行编辑的表格，则调整行编辑表格配置属性（只读）并返回表格配置
    const convertInlineTable = config => {
      //关闭表格编辑等操作功能
      const newConfig = props.editable ? onlyEditTable(config) : disabledTable(config);
      //限定只能查询当前bizId对应的审批单据数据
      newConfig.dataSource.filter = {
        field: config.dataSource.dataObjectPrimaryKey,
        operator: 'eq',
        value: props.bizId,
      };
      return newConfig;
    };

    const relation = ref(null);

    //复制parser-table的getRelationInfo方法
    const getRelationInfo = config => {
      let result = { parentDataKey: '', parentKey: '', childKey: '' };
      //如果当前表格的编辑数据源作为子表出现在关系中，需要在新增构建数据时获取主表的主键
      const target = state.relations.find(f => f.subId === config.dataSource.dataObjectId);
      if (target) {
        result = {
          parentDataKey: `data_${target.mainId}`,
          parentKey: target.columnRelations?.[0]?.mainColumnCode,
          childKey: target.columnRelations?.[0]?.subColumnCode,
        };
        return result;
      } else {
        return null;
      }
    };

    //如果审批页绑定的是弹出编辑的表格，则返回弹出编辑页的配置，并调整配置属性（只读）
    const convertPopupTable = config => {
      relation.value = getRelationInfo(config);
      const editPageConfig = state.configTrees.find(
        f => f.uid === config.editable.popup.configTreeId,
      );
      return props.editable
        ? onlyEditChildPage(editPageConfig.children)
        : disabledChildPage(editPageConfig.children);
    };

    //此配置是以一个配置功能只有一个审批页的前提下实现的
    const workflowConfig = computed(() => {
      const workflowViews = state.configTrees
        .reduce((a, b) => {
          return a.concat(getWorkflowTable([b]));
        }, [])
        .map(m => {
          if (m.editable.mode === 'inline') {
            return convertInlineTable(m);
          } else if (m.editable.mode === 'popup') {
            return convertPopupTable(m);
          }
        });
      //包装一个新的设置页，用于展示
      return {
        uid: 'workflowConfig',
        type: 'root',
        name: '工作流查看页',
        children: flatten(workflowViews),
      };
    });

    //判断审批界面是表格的弹出编辑页（有表单）（true），还是行编辑的表格(false)
    const isChildPage = computed(() => {
      return workflowConfig.value?.children?.some((s: any) => s?.type === BlockType.Table);
    });

    const vPageLoading = ref(false);
    const vPageRef = ref(null);

    const handleClickSave = async () => {
      vPageLoading.value = true;
      await vPageRef.value?.savePageData();
      vPageLoading.value = false;
    };

    return {
      state,
      workflowConfig,
      relation,
      isChildPage,
      vPageLoading,
      vPageRef,
      handleClickSave,
    };
  },
  components: {
    VPage,
    VPageWrapper,
  },
});
</script>

<style lang="less" scoped></style>
