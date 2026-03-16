<template>
  <a-spin :spinning="showLoading && loading" :wrapperClassName="wrapperClassName">
    <iframe :src="previewSrc" frameborder="0" class="preview-frame" v-bind="$attrs"></iframe>
  </a-spin>
</template>

<script lang="ts" setup>
import { useFileView } from '@/utils/hooks/useFileView';
import type { Options } from '@/utils/hooks/useFileView';

interface Props {
  options: Options;
  wrapperClassName?: string;
  showLoading: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showLoading: true,
});

const { loading, previewSrc } = useFileView(props.options);
</script>

<style lang="less" scoped>
.preview-frame {
  height: 100%;
  width: 100%;
}
</style>
