<template>
  <a-select
    :value="value"
    @update:value="handleUpdateValue"
    style="width: 100%"
    allow-clear
    :size="size"
    v-bind="$attrs"
  >
    <a-select-option
      v-for="item in state.valueList"
      :key="item.profileId"
      :value="item.profileId"
      :label="item.profileName"
      :description="item.profileCode"
      :disabled="disabledProfileIds.includes(item.profileId)"
    >
      <span>{{ item.profileName }}</span>
      <span v-if="showValueCode" style="float: right; color: rgb(180 180 180)">
        {{ item.profileCode }}
      </span>
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { defineComponent, reactive, watchEffect } from 'vue';
import type { PropType } from 'vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import { findByType } from '@/api/system/profile/index';
import type { ProfileItem } from '@/api/system/profile/index';
export default defineComponent({
  name: 'SelectProfile',
  props: {
    //值v-model:value
    value: {
      type: String,
      default: '',
    },
    disabledProfileIds: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    //下拉选择中是否显示值编码
    showValueCode: {
      type: Boolean,
      default: false,
    },
    // 大小 small middle large
    size: {
      type: String as PropType<SizeType>,
      default: 'middle',
    },
    //根据选择的配置文件类型，判断值选择类别是否是树形结构
    authValueIsTree: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value', 'update:authValueIsTree'],
  setup(props, { emit }) {
    const state = reactive({
      loading: false,
      valueList: [] as ProfileItem[],
    });

    const getValueList = (): void => {
      state.loading = true;
      findByType('SYS_DATA_PERMISSION')
        .then(({ success, result }) => {
          if (success && result) {
            state.valueList = result;
          } else {
            state.valueList = [];
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          state.loading = false;
        });
    };

    getValueList();

    const handleUpdateValue = (v: string) => {
      emit('update:value', v === '' || v === undefined ? null : v);
    };

    watchEffect(() => {
      emit(
        'update:authValueIsTree',
        !!state.valueList.find(f => f.profileId === props.value)?.profileParentColumn,
      );
    });

    return {
      state,
      handleUpdateValue,
    };
  },
});
</script>

<style lang="less" scoped></style>
