<template>
  <a-button
    v-if="!hideAdd"
    type="primary"
    size="small"
    style="margin-bottom: 8px"
    @click="handleClickAdd"
  >
    {{ $t('components.system.data.auth.add') }}
  </a-button>
  <yl-table
    :columns="columns"
    :data-source="dataAuthList"
    :bordered="false"
    size="small"
    v-bind="$attrs"
    :pagination="false"
    :hide-toolbar="true"
    wrapper-type="default"
    :column-default-width="false"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="['profileId', 'dataAuthValueList'].includes(column.dataIndex)">
        <div>
          <select-profile
            v-if="column.dataIndex === 'profileId'"
            v-model:value="record[column.dataIndex]"
            :disabled-profile-ids="dataAuthList.map(m => m.profileId)"
            v-model:auth-value-is-tree="record['authValueIsTree']"
            @change="() => (record['dataAuthValueList'] = [])"
          />
          <template v-else-if="column.dataIndex === 'dataAuthValueList'">
            <select-data-auth-value-tree
              v-if="record['authValueIsTree']"
              :value="(record[column.dataIndex] as any[])?.map(m => m.authValue)"
              @update:value="v => (record[column.dataIndex] = v)"
              :profile-id="record['profileId']"
            />
            <select-data-auth-value
              v-else
              :value="(record[column.dataIndex] as any[])?.map(m => m.authValue)"
              @update:value="v => (record[column.dataIndex] = v)"
              :profile-id="record['profileId']"
            />
          </template>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'operation'">
        <!-- <delete-outlined @click="handleClickRemove(index)" /> -->
        <yl-button act-type="remove-inline" confirm @click="handleClickRemove(index)"></yl-button>
      </template>
    </template>
  </yl-table>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PropType } from 'vue';
import type { DataAuthItem } from '@/api/system/role/index';

import SelectProfile from './select-profile.vue';
import SelectDataAuthValue from './select-data-auth-value.vue';
import SelectDataAuthValueTree from './select-data-auth-value-tree.vue';

export default defineComponent({
  name: 'DataAuthTable',
  props: {
    dataAuthList: {
      type: Array as PropType<DataAuthItem[]>,
      default: () => [],
    },
    hideAdd: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { expose }) {
    const { t } = useI18n();
    const columns = [
      {
        title: () => t('components.system.data.auth.table.profileId.title'),
        dataIndex: 'profileId',
        width: 140,
      },
      {
        title: () => t('components.system.data.auth.table.dataAuthValueList.title'),
        dataIndex: 'dataAuthValueList',
      },
      {
        title: () => t('components.system.data.auth.operation'),
        dataIndex: 'operation',
        width: 90,
      },
    ];

    const data = computed(() => props.dataAuthList);

    const addRow = () => {
      data.value.push({
        profileId: '',
        dataAuthValueList: [],
      });
    };

    const handleClickAdd = () => {
      addRow();
    };

    const handleClickRemove = (index: number) => {
      data.value.splice(index, 1);
    };

    expose({
      addRow,
    });

    return { columns, handleClickAdd, handleClickRemove };
  },
  components: {
    SelectProfile,
    SelectDataAuthValue,
    SelectDataAuthValueTree,
  },
});
</script>

<style lang="less" scoped></style>
