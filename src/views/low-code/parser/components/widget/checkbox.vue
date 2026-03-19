<template>
  <a-checkbox-group
    :value="arrValue"
    @update:value="handleUpdateValue"
    :disabled="config.options.disabled"
    name="checkboxgroup"
    :size="config.options.size"
  >
    <template v-if="config.options.orientation === 'horizontal'">
      <a-checkbox
        v-for="item in plainOptions"
        :key="item.uid"
        :value="item[config.options.valueField || 'value']"
      >
        {{ item[config.options.textField || 'label'] }}
      </a-checkbox>
    </template>
    <template v-else>
      <a-row :gutter="[12, 12]">
        <a-col v-for="item in plainOptions" :key="item.uid" :span="24">
          <a-checkbox :value="item[config.options.valueField || 'value']">
            {{ item[config.options.textField || 'label'] }}
          </a-checkbox>
        </a-col>
      </a-row>
    </template>
  </a-checkbox-group>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { queryByList } from '@/api/low-code/parser';
import type { QueryObjectType, QueryFilterLogic } from '@/api/low-code/parser';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
  },
  emit: ['update:value'],
  setup(props, { emit }) {
    const plainOptions = ref([]);

    const queryParams = {
      pageId: '',
      //functionId?: string;
      objectId: props.config.options.dataSource.objectId as string,
      type: props.config.options.dataSource.type as QueryObjectType,
      fuzzyQuery: {
        fields: [],
        value: '',
      },
      params: [],
      filter: {
        logic: 'and' as QueryFilterLogic,
        filters: [],
      },
      sort:
        props.config?.options?.dataSource?.sort?.filter(f => f.field && f.type && f.nulls) || [],
    };

    if (props.config.options.optionsType == 'fixed') {
      plainOptions.value = props.config.options?.options || [];
    } else {
      queryByList(queryParams).then(({ success, result }) => {
        if (success && result) {
          plainOptions.value = result;
        }
      });
    }

    const arrValue = computed(() => {
      const v = props.value;
      if (v) {
        return v.split(',');
      } else {
        return [];
      }
    });

    const handleUpdateValue = v => {
      emit('update:value', v.join(','));
    };

    return {
      plainOptions,
      arrValue,
      handleUpdateValue,
    };
  },
});
</script>

<style lang="less" scoped></style>
