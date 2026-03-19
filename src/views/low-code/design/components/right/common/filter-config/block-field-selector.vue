<template>
  <a-input v-model:value="inputValue" style="width: 100%" :readonly="true" v-bind="$attrs">
    <template #suffix>
      <close-circle-filled
        v-if="inputValue"
        style="color: rgba(0, 0, 0, 0.25); font-size: 12px"
        @click="handleClearValue"
      />
    </template>
    <template #addonAfter>
      <menu-outlined @click="handleModalOpen" />
    </template>
  </a-input>
  <yl-modal
    title="请选择块字段"
    v-model:open="state.open"
    @ok="state.open = false"
    @cancel="state.open = false"
    :footer="null"
  >
    <a-tabs v-model:activeKey="state.activeKey" tab-position="left" size="small" animated>
      <a-tab-pane v-for="block in state.blockList" :key="block.uid" :tab="block.name">
        <a-list
          size="small"
          bordered
          :data-source="state.blockFieldMap[block.uid] || []"
          style="height: 350px; overflow: auto"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <div
                class="list-item"
                @click="handleClickListItem({ block: block.uid, field: item.key })"
              >
                <a-radio
                  :checked="item.key === value?.field"
                  @change="handleClickListItem({ block: block.uid, field: item.key })"
                ></a-radio>
                <span>{{ item.fieldCode }}</span>
                <span class="desc">{{ item.fieldDesc }}</span>
              </div>
            </a-list-item>
          </template>
          <template #header>
            <div>{{ block.name }}字段列表</div>
          </template>
        </a-list>
      </a-tab-pane>
    </a-tabs>
  </yl-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, inject, computed } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { BlockType } from '@/views/low-code/design/typing/index';
import { getTableById } from '@/api/low-code/data-set/table';
import { getViewById } from '@/api/low-code/data-set/sql';

export default defineComponent({
  name: '',
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          block: null,
          field: null,
        };
      },
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const designerState = inject(designerStateInjectKey);

    const state = reactive({
      open: false,
      activeKey: '',
      blockList: [],
      blockFieldMap: {},
    });

    const inputValue = computed(() => {
      if (props.value?.block && props.value?.field) {
        const b = state.blockList.find(f => f.uid === props.value.block);
        const f = state.blockFieldMap[props.value.block]?.find(f => f.key === props.value.field);
        return `[${b?.name}]${f?.fieldCode}`;
      }
      return '';
    });

    const getFieldList = async (type: string, objectId: string) => {
      if (type === 'table') {
        const { success, result } = await getTableById(objectId);
        if (success && result) {
          return result.fieldList.map(m => Object.assign(m, { key: m.fieldCode }));
        }
      }
      if (type === 'view') {
        const { success, result } = await getViewById(objectId);
        if (success && result) {
          return result.fieldList.map(m => Object.assign(m, { key: m.fieldCode }));
        }
      }
      return [];
    };

    state.blockList = Array.from(designerState.currentBlockMap?.values() || []).filter((f: any) =>
      [BlockType.SearchForm, BlockType.Form, BlockType.Table].includes(f.type),
    );

    if (state.blockList?.length) {
      state.activeKey = state.blockList[0].uid;

      state.blockList.forEach(async e => {
        //查询块直接用字段uid作为关联条件绑定字段
        if (e.type === BlockType.SearchForm) {
          state.blockFieldMap[e.uid] = e.fieldList.map(m => {
            return {
              key: m.uid,
              fieldCode: m.label,
              // fieldDesc: m.label,
            };
          });
        } else {
          //其他数据块，使用数据源的字段作为关联条件绑定字段
          const source = e.dataSource;
          const objectId = source?.objectId || source?.dataObjectId;
          if (source.type && objectId) {
            state.blockFieldMap[e.uid] = await getFieldList(source.type, objectId);
          }
        }
      });
    }

    const handleModalOpen = () => {
      state.open = true;
    };

    const handleClearValue = () => {
      emit('update:value', null);
    };

    const handleClickListItem = data => {
      emit('update:value', data);
      state.open = false;
    };

    return {
      designerState,
      state,
      inputValue,
      handleModalOpen,
      handleClearValue,
      handleClickListItem,
    };
  },
});
</script>

<style lang="less" scoped>
.list-item {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  .desc {
    margin-left: auto;
    color: #c4c4c4;
  }
}
</style>
