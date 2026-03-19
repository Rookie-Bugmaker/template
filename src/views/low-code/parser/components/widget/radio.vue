<template>
  <a-radio-group
    :disabled="config.options.disabled"
    name="radioGroup"
    :size="config.options.size"
    :button-style="config.options.buttonStyle"
  >
    <template v-if="config.options.orientation === 'horizontal'">
      <component
        :is="optionComponent"
        v-for="item in plainOptions"
        :key="item.uid"
        :value="item[config.options.valueField || 'value']"
      >
        {{ item[config.options.textField || 'label'] }}
      </component>
    </template>
    <template v-else>
      <a-row :gutter="[12, 12]">
        <a-col v-for="item in plainOptions" :key="item.uid" :span="24">
          <component :is="optionComponent" :value="item[config.options.valueField || 'value']">
            {{ item[config.options.textField || 'label'] }}
          </component>
        </a-col>
      </a-row>
    </template>
  </a-radio-group>
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
  },
  setup(props) {
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

    const optionComponent = computed(() => {
      const cgf = props.config;
      if (cgf.options.optionType === 'button') {
        return 'a-radio-button';
      } else {
        return 'a-radio';
      }
    });
    return { plainOptions, optionComponent };
  },
});
</script>

<style lang="less" scoped></style>
