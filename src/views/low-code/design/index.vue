<template>
  <a-spin :spinning="state.loading" :delay="300" wrapperClassName="designer-layout-spin">
    <a-layout class="designer-layout">
      <a-layout-header class="designer-header-wrapper">
        <deisgner-header
          @save="saveDesignerConfig"
          @release="releaseDesignerConfig"
          @preview="handlePreviewPage"
        />
      </a-layout-header>
      <a-layout>
        <a-layout-sider class="designer-left-wrapper"><designer-left /></a-layout-sider>
        <a-layout-content class="designer-container-wrapper"><designer-content /></a-layout-content>
        <a-layout-sider class="designer-right-wrapper"><designer-right /></a-layout-sider>
      </a-layout>
    </a-layout>
  </a-spin>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue';
import DeisgnerHeader from './components/header/index.vue';
import DesignerLeft from './components/left/index.vue';
import DesignerContent from './components/content/index.vue';
import DesignerRight from './components/right/index.vue';
import { useDesignerState } from './hooks/useDesignerState';
import { designerStateInjectKey, designerStateFnInjectKey } from './keys';

export default defineComponent({
  name: 'DesignerLayout',
  setup() {
    const { state, saveDesignerConfig, releaseDesignerConfig, useTemplate } = useDesignerState();

    provide(designerStateInjectKey, state);
    provide(designerStateFnInjectKey, { useTemplate });

    const handlePreviewPage = () => {
      console.log(state);
    };

    return { state, saveDesignerConfig, releaseDesignerConfig, handlePreviewPage };
  },
  components: { DeisgnerHeader, DesignerLeft, DesignerContent, DesignerRight },
});
</script>

<style lang="less" scoped>
@bg-color: #fff;
@area-border: 1px solid #e4e4e4;
@left-width: 300px;
@right-width: 300px;

.designer-layout-spin {
  width: 100%;
  height: 100%;
  :deep(.ant-spin-container) {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
.designer-layout {
  width: 100%;
  height: 100%;
  background-color: @bg-color;
  .designer-header-wrapper {
    height: 50px;
    padding: 15px;
    line-height: 50px;
    background-color: @bg-color;
    border: @area-border;
  }
  .designer-left-wrapper {
    flex: 0 0 @left-width !important;
    width: @left-width !important;
    min-width: @left-width !important;
    max-width: @left-width !important;
    background-color: @bg-color;
    border: @area-border;
  }
  .designer-container-wrapper {
    background-color: @bg-color;
    border: @area-border;
  }

  .designer-right-wrapper {
    flex: 0 0 @right-width!important;
    width: @right-width!important;
    min-width: @right-width!important;
    max-width: @right-width!important;
    background-color: @bg-color;
    border: @area-border;
  }
}
</style>
