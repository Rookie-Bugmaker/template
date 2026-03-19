<template>
  <div class="right-panel">
    <transition name="slide-fade" class="config-wrapper">
      <component
        v-if="renderComponent"
        :is="configCompnent"
        :config="designerState.currentConfig"
      ></component>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed, resolveComponent, ref, watch, nextTick } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import DTableConfig from './block/table/index.vue';
import DFormConfig from './block/form/index.vue';
import DSearchFormConfig from './block/search-form/index.vue';
import DCardConfig from './block/card.vue';
import DTabsConfig from './block/tabs/index.vue';
import DGridConfig from './block/grid/index.vue';
import DTreeConfig from './block/tree/index.vue';

import DCheckboxConfig from './widget/checkbox.vue';
import DDateConfig from './widget/date.vue';
import DTimeConfig from './widget/time.vue';
import DInputConfig from './widget/input.vue';
import DNumberConfig from './widget/number.vue';
import DPersonConfig from './widget/person.vue';
import DPopeditConfig from './widget/popedit/index.vue';
import DRadioConfig from './widget/radio.vue';
import DSelectConfig from './widget/select.vue';
import DSerialNumberConfig from './widget/serial-number.vue';
import DValueSetConfig from './widget/value-set.vue';
import DTextareaConfig from './widget/textarea.vue';
import DUploadFileConfig from './widget/upload-file.vue';
import DUploadImageConfig from './widget/upload-image.vue';
import DTreeSelectConfig from './widget/tree-select.vue';
import DPasswordConfig from './widget/password.vue';
import DUserConfig from './widget/user.vue';
import DButtonConfig from './widget/button/index.vue';
import DSwitchConfig from './widget/switch.vue';
import DProcessStatusConfig from './widget/process-status.vue';
import DOrgConfig from './widget/org.vue';
import DCompanyConfig from './widget/company.vue';
import DDeptConfig from './widget/dept.vue';
import DDictConfig from './widget/dict.vue';

export default defineComponent({
  name: '',
  setup() {
    const designerState = inject(designerStateInjectKey);

    const configCompnent = computed(() => {
      if (!designerState.currentConfig) {
        return 'div';
      }
      const c = resolveComponent(`d-${designerState.currentConfig?.type}-config`);
      return typeof c == 'string' ? 'div' : c;
    });

    const renderComponent = ref(true);
    //切换选中元素的时候，重新渲染右侧设置栏，避免出现意外错误（如：两个下拉框之间切换，两个不同数据源，切换时清空值字段和描述字段）
    //同时也保证了动画效果一致性
    watch(
      () => designerState.currentConfig?.uid,
      () => {
        renderComponent.value = false;
        nextTick(() => {
          renderComponent.value = true;
        });
      },
    );

    return { designerState, configCompnent, renderComponent };
  },
  components: {
    DTableConfig,
    DFormConfig,
    DSearchFormConfig,
    DCardConfig,
    DTabsConfig,
    DGridConfig,
    DTreeConfig,
    DCheckboxConfig,
    DDateConfig,
    DTimeConfig,
    DInputConfig,
    DNumberConfig,
    DPersonConfig,
    DPopeditConfig,
    DRadioConfig,
    DSelectConfig,
    DSerialNumberConfig,
    DValueSetConfig,
    DTextareaConfig,
    DUploadFileConfig,
    DUploadImageConfig,
    DTreeSelectConfig,
    DPasswordConfig,
    DUserConfig,
    DButtonConfig,
    DSwitchConfig,
    DProcessStatusConfig,
    DOrgConfig,
    DCompanyConfig,
    DDeptConfig,
    DDictConfig,
  },
});
</script>

<style lang="less" scoped>
.right-panel {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .config-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.3, 0.5, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(80px);
  opacity: 0;
}
</style>
