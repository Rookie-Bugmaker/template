<template>
  <div class="user-tag-select">
    <a-avatar-group size="large" :max-count="maxTagCount" :maxStyle="{ background: '#3296fa' }">
      <user-tag
        v-for="(item, index) in selectedRows"
        :key="index"
        :user-data="item"
        @unselect-user="removeSelectedItem(item.userId)"
        :readonly="readonly"
      />
    </a-avatar-group>
    <!-- <more-tag :more-num="moreNum" @click="handleClickShowMoreUser" /> -->
    <add-tag v-if="!readonly" :show-required="isRequired" @add-user="handleClickAddUser" />
    <select-modal
      v-if="state.open"
      v-model:open="state.open"
      :multiple="maxSelectNum != 1"
      :readonly="readonly"
      :max-select-num="maxSelectNum"
      :designatedUserIds="designatedUserIds"
      @ok="state.open = false"
      @cancel="state.open = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch } from 'vue';
import type { PropType } from 'vue';
import { useProvideUserState } from './hooks/useUserState';

import UserTag from './user-tag.vue';
// import MoreTag from './more-tag.vue';
import AddTag from './add-tag.vue';
import SelectModal from './select-modal.vue';
import { difference } from 'lodash';

export default defineComponent({
  name: 'UserTagSelect',
  props: {
    selectedUserIds: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    //最大显示tag数
    maxTagCount: {
      type: Number,
      default: 0,
    },
    //最少需要选择用户数
    minSelectNum: {
      type: Number,
      default: null,
    },
    //最大选择用户数
    maxSelectNum: {
      type: Number,
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    //指定用户可选列表
    designatedUserIds: {
      type: Array as PropType<string | string[]>,
      default: null,
    },
  },
  emits: ['update:selectedUserIds'],
  setup(props, { emit, expose }) {
    const state = reactive({
      open: false,
    });

    const { selectedRows, loadSelectedRows, removeSelectedItem } = useProvideUserState();

    watch(
      () => props.selectedUserIds,
      async () => {
        const selectedKeys = selectedRows.value?.map(m => m.userId) || [];
        if (
          difference(props.selectedUserIds, selectedKeys).length > 0 ||
          props.selectedUserIds.length !== selectedKeys.length
        ) {
          await loadSelectedRows(props.selectedUserIds);
        }
      },
      {
        immediate: true,
      },
    );

    watch(
      () => selectedRows.value,
      () => {
        const selectedKeys = selectedRows.value?.map(m => m.userId) || [];
        if (
          difference(props.selectedUserIds, selectedKeys).length > 0 ||
          props.selectedUserIds.length !== selectedKeys.length
        ) {
          emit('update:selectedUserIds', selectedKeys);
        }
      },
    );

    const moreNum = computed(() => {
      const num = props.selectedUserIds.length - props.maxTagCount;
      return num > 0 ? num : 0;
    });

    const handleClickShowMoreUser = () => {
      state.open = true;
    };

    const handleClickAddUser = () => {
      state.open = true;
    };

    const isRequired = computed(() => {
      let flag = false;
      if (null !== props.minSelectNum) {
        flag = props.selectedUserIds.length < props.minSelectNum;
      }
      return flag;
    });

    const selectedNum = computed(() => props.selectedUserIds.length);

    const validate = () => {
      let flag = true;
      let message = '';
      if (!props.readonly) {
        const min = props.minSelectNum;
        const max = props.maxSelectNum;
        if (null !== min && undefined !== min && selectedNum.value < min) {
          flag = false;
          message += `请至少选择${min}名用户`;
        }

        if (null !== max && undefined !== max && selectedNum.value > max) {
          flag = false;
          message += `最多选择${max}名用户`;
        }
      }

      return [flag, message];
    };

    expose({
      validate,
    });

    return {
      state,
      removeSelectedItem,
      selectedRows,
      moreNum,
      isRequired,

      handleClickShowMoreUser,
      handleClickAddUser,
      validate,
    };
  },
  components: {
    UserTag,
    // MoreTag,
    AddTag,
    SelectModal,
  },
});
</script>

<style lang="less" scoped>
.user-tag-select {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
