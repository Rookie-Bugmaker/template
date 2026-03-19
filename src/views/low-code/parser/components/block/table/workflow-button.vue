<template>
  <workflow-button
    :biz-id="record?.[config.dataSource.dataObjectPrimaryKey]"
    :biz-code="record?.[config.workflow?.bizCodeField]"
    :templateAlias="config.workflow?.templateAlias"
    :form-data="record"
    :process-instance-id="record?.['PROCESS_INSTANCE_ID']"
    :lowCodeFlag="true"
    :objectId="config.dataSource.dataObjectId"
    @handle="$emit('handle')"
    :disabled="!record?.[config.dataSource.dataObjectPrimaryKey]"
  >
    <template #bizView="{ editable }">
      <approva-view
        :pageId="parserState.pageId"
        :biz-id="record?.[config.dataSource.dataObjectPrimaryKey]"
        :editable="editable"
      />
    </template>
  </workflow-button>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
import WorkflowButton from '@/components/workflow/index.vue';
const ApprovaView = defineAsyncComponent(() => import('@/views/low-code/parser/approval-view.vue'));
import { injectParserState } from '@/views/low-code/parser/hooks/useParserState';

defineProps({
  config: {
    type: Object,
    required: true,
  },
  record: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
defineEmits(['handle']);

const parserState = injectParserState();
</script>

<style lang="less" scoped></style>
