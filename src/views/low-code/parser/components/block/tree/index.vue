<template>
  <div class="parser-tree" :style="config.style">
    <a-input
      v-if="config.options.showSearch"
      class="tree-search-input"
      v-model:value="searchValue"
      placeholder="输入节点信息进行搜索"
      allow-clear
    >
      <template #suffix>
        <search-outlined style="color: rgba(0, 0, 0, 0.45)" />
      </template>
    </a-input>
    <div class="tree-wrapper">
      <a-spin :spinning="state.loading">
        <a-tree
          v-if="dataList.length > 0"
          v-bind="config.options"
          :tree-data="filteredTreeData"
          :field-names="{
            key: keyField,
            title: titleField,
            children: 'children',
          }"
          :blockNode="true"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
          @expand="onExpand"
          @select="handleSelect"
        >
          <template #title="record">
            <div style="display: flex">
              <span
                style="white-space: nowrap"
                v-if="searchValue && record[titleField].indexOf(searchValue) > -1"
              >
                {{ record[titleField].substr(0, record[titleField].indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{
                  record[titleField].substr(
                    record[titleField].indexOf(searchValue) + searchValue.length,
                  )
                }}
              </span>
              <span style="white-space: nowrap" v-else>{{ record[titleField] }}</span>
              <span
                v-if="descField"
                style="
                  float: right;
                  margin-left: 10px;
                  text-align: right;
                  white-space: nowrap;
                  color: rgb(180 180 180);
                "
              >
                <span
                  v-if="
                    searchValue && record[descField] && record[descField].indexOf(searchValue) > -1
                  "
                >
                  {{ record[descField].substr(0, record[descField].indexOf(searchValue)) }}
                  <span style="color: #f50">{{ searchValue }}</span>
                  {{
                    record[descField].substr(
                      record[descField].indexOf(searchValue) + searchValue.length,
                    )
                  }}
                </span>
                <span v-else>{{ record[descField] }}</span>
              </span>
            </div>
          </template>
        </a-tree>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, /* onUnmounted, */ inject } from 'vue';
import { Modal } from 'ant-design-vue';
import { parserStateInjectKey } from '@/views/low-code/parser/keys';
import { arrayToTree /*  findTreeItemPath */ } from '@/utils/tree-util';
import { getFilter } from '@/views/low-code/parser/utils/filter';
import { queryByList } from '@/api/low-code/parser/index';
import useEventHandler from '@/views/low-code/parser/hooks/useEventHandler/index';

const props = defineProps<{
  config: Record<string, any>;
  blockMap: Map<string, string>;
  params: {
    primarykey: string;
    parentParams: Record<string, any>;
  };
  withoutRelation: boolean;
}>();

const parserState = inject(parserStateInjectKey);

const treeId = `data_${props.config.dataSource.dataObjectId}`;

const {
  rootValue,
  disabledType,
  fieldNames: {
    key: keyField,
    title: titleField,
    parentKey: parentKeyField,
    descriptionKey: descField,
  },
} = props.config.options;

const state = reactive({
  loading: false,
});

const dataList = ref([]);
const searchValue = ref('');
const expandedKeys = ref<string[]>([]);
const autoExpandParent = ref<boolean>(true);

const dataModel = reactive({});

const getData = async () => {
  const ds = props.config.dataSource;
  const filter = getFilter(
    ds.filter,
    parserState.block,
    parserState.blockConfig,
    props.params?.parentParams,
  );
  const query = async () => {
    const r = await queryByList({
      pageId: parserState.pageId,
      objectId: ds.objectId || ds.dataObjectId, //如果有设置查询数据源，优先以查询数据源查询
      type: ds.objectId ? ds.type : 'table', //如果有设置查询数据源，使用数据源类型，否则直接使用表类型
      params: [],
      sort: ds.sort || [],
      fuzzyQuery: {
        fields: [],
        value: '',
      },
      filter,
    });
    return r;
  };

  try {
    state.loading = true;
    const res = await query();
    if (res.success) {
      //清空dataModel的值
      Object.keys(dataModel).forEach(key => {
        delete dataModel[key];
      });
      if (res.result) {
        dataList.value = res.result || [];
      } else {
        dataList.value = [];
      }
    } else {
      Modal.error({
        title: '获取数据失败',
        content: res.message,
      });
    }
  } catch (err: any) {
    Modal.error({
      title: '获取数据失败',
      content: err.message,
    });
  } finally {
    state.loading = false;
  }
};

getData();

const eh = useEventHandler();

const itemDisabledCondition = (data = null) => {
  const dc = props.config.options?.disabledCondition;
  const condition = dc && parserState?.conditions?.find(f => f.uid === dc);
  if (condition) {
    const f = eval(`(function x (value, modelData, state, eh){${condition.func}})`);
    return f(null, data, parserState, eh);
  } else {
    return false;
  }
};

const treeData = computed(() => {
  const t = arrayToTree(dataList.value, {
    key: keyField,
    parentKey: parentKeyField,
    rootValue,
  });
  // 处理节点禁用状态的函数
  const processDisabled = (node, isRoot = false, hasChildren = false) => {
    // 如果disabledType为false或null，不禁用任何节点
    if (!disabledType) return node;

    const newNode = { ...node };

    // 根据disabledType设置节点的disabled属性
    if (disabledType === 'root' && isRoot) {
      // 禁用根节点
      newNode.disabled = true;
    } else if (disabledType === 'notLeaf' && hasChildren) {
      // 禁用非叶子节点（有子节点的节点）
      newNode.disabled = true;
    } else if (disabledType === 'custom' && itemDisabledCondition(newNode)) {
      // 自定义禁用条件
      newNode.disabled = true;
    }

    return newNode;
  };

  // 处理树数据的函数，添加禁用状态
  const processTree = (tree, isRoot = true) => {
    if (!tree) return [];

    return tree.map(node => {
      // 创建节点副本并处理禁用状态
      const hasChildren = node.children && node.children.length > 0;
      const newNode = processDisabled({ ...node }, isRoot, hasChildren);

      // 递归处理子节点
      if (newNode.children) {
        newNode.children = processTree(newNode.children, false);
      }

      return newNode;
    });
  };

  // 先处理禁用状态
  const processedTreeData = processTree(t);
  return processedTreeData;
});

// 过滤树数据，根据搜索值筛选节点，并处理节点禁用状态
const filteredTreeData = computed(() => {
  // 如果没有搜索值，直接返回处理后的树数据
  if (!searchValue.value) {
    return treeData.value;
  }

  // 深拷贝树数据，避免修改原始数据，并根据搜索值筛选节点
  const filterTree = tree => {
    if (!tree) return [];

    return tree
      .map(node => {
        // 创建节点副本
        const newNode = { ...node };

        // 检查当前节点是否匹配
        const titleMatch =
          newNode[titleField] && newNode[titleField].indexOf(searchValue.value) > -1;
        const descMatch =
          descField && newNode[descField] && newNode[descField].indexOf(searchValue.value) > -1;

        // 递归处理子节点
        if (newNode.children) {
          newNode.children = filterTree(newNode.children);
        }

        // 如果当前节点匹配或者有匹配的子节点，则保留
        if (titleMatch || descMatch || (newNode.children && newNode.children.length > 0)) {
          return newNode;
        }

        // 否则过滤掉
        return null;
      })
      .filter(Boolean); // 过滤掉空值
  };

  return filterTree(treeData.value);
});

// 处理搜索
const handleSearch = () => {
  // 重置展开状态
  autoExpandParent.value = true;

  if (!searchValue.value) {
    expandedKeys.value = [];
    return;
  }

  // 查找所有匹配节点的路径并展开
  const findMatchedKeys = (tree, keys = []) => {
    if (!tree) return keys;

    tree.forEach(node => {
      const titleMatch = node[titleField] && node[titleField].indexOf(searchValue.value) > -1;
      const descMatch =
        descField && node[descField] && node[descField].indexOf(searchValue.value) > -1;

      if (titleMatch || descMatch) {
        // 添加当前节点的key到展开列表
        keys.push(node[keyField]);

        // 如果有父节点路径，也添加到展开列表
        let parent = node;
        while (parent && parent[parentKeyField] !== rootValue) {
          const parentNode = dataList.value.find(item => item[keyField] === parent[parentKeyField]);
          if (parentNode) {
            keys.push(parentNode[keyField]);
            parent = parentNode;
          } else {
            break;
          }
        }
      }

      // 递归处理子节点
      if (node.children) {
        findMatchedKeys(node.children, keys);
      }
    });

    return keys;
  };

  // 获取所有需要展开的节点key
  const keys = findMatchedKeys(treeData.value);
  expandedKeys.value = [...new Set(keys)]; // 去重
};

// 处理展开/折叠
const onExpand = keys => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};

// 监听搜索值变化
watch(searchValue, value => {
  if (value) {
    handleSearch();
  } else {
    expandedKeys.value = [];
  }
});

const handleSelect = (_selectedKeys: string[], info: any) => {
  if (info.selected) {
    Object.assign(dataModel, info.node);
  } else {
    //清空dataModel的值
    Object.keys(dataModel).forEach(key => {
      delete dataModel[key];
    });
  }
};

// onUnmounted(() => {
Object.assign(parserState.data, { [treeId]: dataModel });
// });

const getModel = () => {
  return parserState.data[treeId];
};

defineExpose({
  getModel,
});
</script>

<style lang="less" scoped>
.parser-tree {
  display: flex;
  flex-direction: column;
  height: 100%;
  .tree-search-input {
    margin-bottom: 8px;
  }
  .tree-wrapper {
    flex: 1;
    height: 100%;
    overflow: auto;
  }
}
</style>
