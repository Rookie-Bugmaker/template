<template>
  <div class="sub-service-page">
    <iframe
      ref="subIframeRef"
      :src="src"
      frameborder="0"
      style="height: 100%; width: 100%"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
const props = defineProps<{
  projectPath: string;
  componentPath: string;
  bizId: string;
  editable: boolean;
  nodeCode: string;
  processInstanceId: string;
}>();

const src = computed(() => {
  const p = props.componentPath.slice(0, props.componentPath.lastIndexOf('/'));
  return `${props.projectPath}approval-view?path=${encodeURIComponent(p)}&bizId=${
    props.bizId
  }&editable=${props.editable}&nodeCode=${props.nodeCode}&processInstanceId=${
    props.processInstanceId
  }`;
});

const state = reactive({
  loading: false,
  deferred: null,
});

const subIframeRef = ref(null);

class Deferred {
  promise = null;
  resolve = null;
  reject = null;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

const sendMessage = () => {
  const data = {
    type: 'approval-view-save-data',
    processInstanceId: props.processInstanceId,
  };
  subIframeRef.value?.contentWindow?.postMessage(data, props.projectPath);
};

const saveData = async () => {
  state.loading = true;
  sendMessage();
  state.deferred = await new Deferred();
};

const receiveMessage = event => {
  if (
    event.data?.type === 'approval-view-save-data-result' &&
    event.data?.processInstanceId === props.processInstanceId
  ) {
    if (event.data?.result === true) {
      state.deferred?.resolve?.();
    } else {
      state.deferred?.reject?.();
    }
    state.loading = false;
  }
};

onMounted(() => {
  window.addEventListener('message', receiveMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', receiveMessage);
});

defineExpose({
  saveData,
});
</script>

<style lang="less" scoped>
.sub-service-page {
  height: 100%;
  width: 100%;
  min-height: 500px;
}
</style>
