<template>
  <a-tag v-if="tagProps" :color="tagProps.color" v-bind="$attrs">
    <template #icon>
      <icon :name="tagProps.icon" />
    </template>
    {{ isFunction(tagProps.text) ? tagProps.text?.() : tagProps.text }}
  </a-tag>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { isFunction } from 'lodash';

interface StatusItem {
  value: string | number | boolean;
  text: string | number | (() => string);
  color?: string;
  icon?: string;
}
//defineProps() in <script setup> cannot reference locally declared variables because it will be hoisted outside of the setup() function. If your component options require initialization in the module scope, use a separate normal <script> to export the options instead.
const props = defineProps({
  //状态值
  value: {
    type: [String, Number],
    default: '',
  },
  //状态列表
  statusList: {
    type: Array as PropType<StatusItem[]>,
    default: (): StatusItem[] => [],
  },
});

const { t } = useI18n();

const defaultStatusList: StatusItem[] = [
  { value: 'Y', text: () => t('global.effective'), color: 'green' },
  { value: 'N', text: () => t('global.expired'), color: 'red' },
];

const tagProps = computed(() => {
  const list = props.statusList?.length ? props.statusList : defaultStatusList;
  return list.find(f => f.value === props.value);
});
</script>

<style lang="less" scoped></style>
