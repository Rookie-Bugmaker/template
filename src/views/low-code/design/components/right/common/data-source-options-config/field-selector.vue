<template>
  <a-select
    :value="value"
    @update:value="e => $emit('update:value', e)"
    v-bind="$attrs"
    :dropdown-match-select-width="false"
    :get-popup-container="getPopupContainer"
    @select="handleSelect"
  >
    <a-select-option
      v-for="item in state.options"
      :key="item.fieldCode"
      :value="item.fieldCode"
      :label="item.fieldCode"
    >
      <span>{{ item.fieldCode }}</span>
      <span style="float: right; color: rgb(180 180 180)">{{ item.fieldDesc }}</span>
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, onMounted } from 'vue';
import { getTableById } from '@/api/low-code/data-set/table';
import { getViewById } from '@/api/low-code/data-set/sql';

export default defineComponent({
  name: '',
  props: {
    value: {
      type: String,
      default: '',
    },
    dataSourceId: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'table',
    },
  },
  emits: ['update:value', 'select'],
  setup(props, { emit }) {
    const state = reactive({
      options: [],
    });

    const loadDataById = () => {
      if (props.type === 'table') {
        getTableById(props.dataSourceId).then(({ success, result }) => {
          if (success && result) {
            state.options = result.fieldList;
          } else {
            state.options = [];
          }
        });
      }
      if (props.type === 'view') {
        getViewById(props.dataSourceId).then(({ success, result }) => {
          if (success && result) {
            state.options = result.fieldList;
          } else {
            state.options = [];
          }
        });
      }
    };

    watch(
      () => props.dataSourceId,
      (n, o) => {
        if (n) {
          if (n !== o) {
            if (o) {
              //防止初始化时清空了值
              emit('update:value', null);
            }
            loadDataById();
          }
        } else {
          emit('update:value', null);
          state.options = [];
        }
      },
      {
        immediate: true,
      },
    );

    onMounted(() => {
      if (props.value) {
        loadDataById();
      }
    });

    const handleSelect = v => {
      const target = state.options.find(f => f.fieldCode === v);
      emit('select', v, target);
    };

    const getPopupContainer = () => document.body;

    return {
      state,
      handleSelect,
      getPopupContainer,
    };
  },
});
</script>
