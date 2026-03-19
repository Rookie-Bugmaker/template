<template>
  <d-modal v-bind="$attrs" :footer="null">
    <v-page :config="config" :params="params" :without-relation="true" />
  </d-modal>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue';
import DModal from './modal.vue';
import VPage from '@/views/low-code/parser/components/page.vue';
import { parserStateInjectKey } from '@/views/low-code/parser/keys';

const props = defineProps({
  configTreeId: {
    type: String,
    default: '',
  },
  params: {
    type: Object,
    default: () => ({}),
  },
});

const parserState = inject(parserStateInjectKey);

const config = computed(() => {
  return parserState.configTrees.find(f => f.uid === props.configTreeId);
});
</script>

<style lang="less" scoped></style>
