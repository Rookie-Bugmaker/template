<template>
  <component
    :is="buttonComponent"
    :confirm="confirm"
    :withoutPermission="withoutPermission"
    :stopPropagation="stopPropagation"
    v-bind="$attrs"
  >
    <template #default>
      <slot name="default" />
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, resolveDynamicComponent, computed } from 'vue';
import type { PropType } from 'vue';
const YlButtonAdd = defineAsyncComponent(() => import('./buttons/add.vue'));
const YlButtonCancelInline = defineAsyncComponent(() => import('./buttons/cancel-inline.vue'));
const YlButtonCancel = defineAsyncComponent(() => import('./buttons/cancel.vue'));
const YlButtonDownload = defineAsyncComponent(() => import('./buttons/download.vue'));
const YlButtonEditInline = defineAsyncComponent(() => import('./buttons/edit-inline.vue'));
const YlButtonEdit = defineAsyncComponent(() => import('./buttons/edit.vue'));
const YlButtonExport = defineAsyncComponent(() => import('./buttons/export.vue'));
const YlButtonImport = defineAsyncComponent(() => import('./buttons/import.vue'));
const YlButtonPublish = defineAsyncComponent(() => import('./buttons/publish.vue'));
const YlButtonRemoveBatch = defineAsyncComponent(() => import('./buttons/remove-batch.vue'));
const YlButtonRemoveInline = defineAsyncComponent(() => import('./buttons/remove-inline.vue'));
const YlButtonRemove = defineAsyncComponent(() => import('./buttons/remove.vue'));
const YlButtonReset = defineAsyncComponent(() => import('./buttons/reset.vue'));
const YlButtonSaveInline = defineAsyncComponent(() => import('./buttons/save-inline.vue'));
const YlButtonSave = defineAsyncComponent(() => import('./buttons/save.vue'));
const YlButtonSearch = defineAsyncComponent(() => import('./buttons/search.vue'));

type ActType =
  | 'add'
  | 'cancel-inline'
  | 'cancel'
  | 'download'
  | 'edit-inline'
  | 'edit'
  | 'export'
  | 'import'
  | 'publish'
  | 'remove-batch'
  | 'remove-inline'
  | 'remove'
  | 'reset'
  | 'save-inline'
  | 'save'
  | 'search';

export default defineComponent({
  name: 'YlButton',
  props: {
    //按钮类型，不传默认返回a-button
    actType: {
      type: String as PropType<ActType>,
      default: '',
    },
    //按钮点击确认，只有'cancel-inline' |  'remove-inline' | 'remove' 有效
    //启用后，传入的click时间会在confirm事件中触发
    confirm: {
      type: [Boolean, String],
      default: false,
    },
    //不受权限控制
    withoutPermission: {
      type: Boolean,
      default: false,
    },
    //阻止confirm启用时的按钮冒泡事件
    stopPropagation: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const buttonComponent = computed(() => {
      const c = resolveDynamicComponent(`yl-button-${props.actType}`);
      return typeof c !== 'string' ? c : 'a-button';
    });
    return {
      buttonComponent,
    };
  },
  components: {
    YlButtonAdd,
    YlButtonCancelInline,
    YlButtonCancel,
    YlButtonDownload,
    YlButtonEditInline,
    YlButtonEdit,
    YlButtonExport,
    YlButtonImport,
    YlButtonPublish,
    YlButtonRemoveBatch,
    YlButtonRemoveInline,
    YlButtonRemove,
    YlButtonReset,
    YlButtonSaveInline,
    YlButtonSave,
    YlButtonSearch,
  },
});
</script>

<style lang="less" scoped></style>
