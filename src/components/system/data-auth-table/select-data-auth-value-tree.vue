<template>
  <a-tree-select
    :value="value"
    @change="handleChangValue"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    style="width: 100%"
    allow-clear
    multiple
    :size="size"
    :maxTagCount="1"
    :dropdownMatchSelectWidth="false"
    tree-checkable
    tree-default-expand-all
    :tree-data="state.valueTree"
    :field-names="{
      children: 'children',
      label: 'desc',
      value: 'id',
    }"
    treeCheckStrictly
    :get-popup-container="getPopupContainer"
  ></a-tree-select>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import type { PropType } from 'vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import { getValueSetListAccordingToProfileId } from '@/api/system/profile/index';
import type { ValueSetItem } from '@/api/system/profile/index';
import { arrayToTree } from '@/utils/tree-util';

interface ValueSetTreeItem extends ValueSetItem {
  // disabled: boolean;
  children?: ValueSetTreeItem[];
}

export default defineComponent({
  name: 'SelectProfile',
  props: {
    //值v-model:value
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    profileId: {
      type: String,
      default: '',
    },
    // 大小 small middle large
    size: {
      type: String as PropType<SizeType>,
      default: 'middle',
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const state = reactive({
      loading: false,
      valueList: [] as ValueSetItem[],
      valueTree: [] as ValueSetTreeItem[],
    });

    const getValueList = (profileId: string): void => {
      state.loading = true;
      getValueSetListAccordingToProfileId({ profileId })
        .then(({ success, result }) => {
          if (success && result) {
            state.valueList = result;
            const data = result; /* .map(m => {
              const hasChildren = result.some(s => m.id === s.parentId);
              const isRoot = m.parentId === null;
              return Object.assign(m, { disabled: hasChildren || isRoot });
            }); */
            state.valueTree = arrayToTree(data);
          } else {
            state.valueTree = [];
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          state.loading = false;
        });
    };

    watch(
      () => props.profileId,
      (n, o) => {
        if (n !== o) {
          if (n) {
            getValueList(n);
          } else {
            state.valueTree = [];
          }
        }
      },
      { immediate: true },
    );

    const findAllChildId = (ids: string[]) => {
      return ids.reduce((a, b) => {
        const childIds = state.valueList.filter(f => f.parentId === b).map(m => m.id);
        return a.concat([b], findAllChildId(childIds));
      }, []);
    };

    const handleChangValue = (val: any[], _node, extra) => {
      const ids = findAllChildId([extra.triggerValue]);
      let updateIds = [];
      if (extra.checked) {
        //数组去重
        const oldIds = val.map(m => m.value);
        ids.forEach(id => {
          if (!oldIds.includes(id)) {
            oldIds.push(id);
          }
        });
        updateIds = oldIds;
      } else {
        updateIds = val.filter(f => !ids.find(x => x === f.value)).map(m => m.value);
      }

      emit(
        'update:value',
        updateIds.map(m => {
          const target = state.valueList.find(f => f.id === m);
          return { authValue: target.id, authValueDesc: target.desc };
        }),
      );
    };

    const getPopupContainer = () => document.body;

    return {
      state,
      handleChangValue,
      getPopupContainer,
    };
  },
});
</script>

<style lang="less" scoped></style>
