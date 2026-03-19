<template>
  <div class="designer-left">
    <div class="left-options">
      <div
        v-for="item in options"
        :class="['option-item', { 'is-active': state.activeKey === item.key }]"
        :key="item.key"
        @click="state.activeKey = item.key"
      >
        <icon :name="item.icon" :size="18" style="cursor: pointer"></icon>
      </div>
    </div>
    <div class="right-panel">
      <component :is="panelComponent"></component>
    </div>
  </div>
  <!-- 提前挂载出来，有可能其他地方要直接编辑条件 -->
  <edit-drawer
    :open="!!conditionEditingKey"
    @update:open="() => (conditionEditingKey = null)"
    :uid="conditionEditingKey"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import Items from './items/index.vue';
import Locales from './locales/index.vue';
import Conditions from './conditions/index.vue';
import EditDrawer from './conditions/edit-drawer.vue';
import useConditions from '@/views/low-code/design/hooks/useConditions';
import TemplateView from './template-view/index.vue';

const options = [
  {
    key: 1,
    icon: 'appstore-outlined',
    panel: 'items',
  },
  {
    key: 2,
    icon: 'global-outlined',
    panel: 'locales',
  },
  {
    key: 3,
    icon: 'control-outlined',
    panel: 'conditions',
  },
  {
    key: 4,
    icon: 'block-outlined',
    panel: 'template-view',
  },
];
export default defineComponent({
  name: 'DesignerLeft',
  setup() {
    const state = reactive({ activeKey: 1 });
    const panelComponent = computed(() => {
      return options.find(item => item.key === state.activeKey).panel;
    });

    const { editingKey: conditionEditingKey } = useConditions();

    return { options, state, panelComponent, conditionEditingKey };
  },
  components: {
    Items,
    Locales,
    Conditions,
    EditDrawer,
    TemplateView,
  },
});
</script>

<style lang="less" scoped>
.designer-left {
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  .left-options {
    display: flex;
    flex: 0 0 40px;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    border-right: 1px solid #e4e4e4;
    .option-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin-top: 5px;
      font-size: 18px;
      cursor: pointer;
      &:hover {
        color: #1890ff;
        opacity: 0.85;
      }
      &.is-active {
        color: #1890ff;
      }
    }
  }
  .right-panel {
    flex: 1;
    height: 100%;
    overflow: auto;
  }
}
</style>
