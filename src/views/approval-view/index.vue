<template>
  <component
    v-if="info.path"
    :is="bizViewComponent"
    :bizId="info.bizId"
    :editable="info.editable"
    :nodeCode="info.nodeCode"
    ref="approvalViewRef"
  />
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const approvalViewRef = ref(null);

const route = useRoute();

const info = computed(() => {
  const query = route.query;
  const path = decodeURIComponent(query.path as string);
  const bizId = query.bizId;
  const editable = query.editable == 'true';
  const nodeCode = query.nodeCode;
  const processInstanceId = query.processInstanceId;
  return {
    path,
    bizId,
    editable,
    nodeCode,
    processInstanceId,
  };
});

const bizViewComponent = defineAsyncComponent(
  async () => import(/* @vite-ignore */ `../${info.value.path}/approval-view.vue`) as any,
);

const sendMessage = (result: boolean) => {
  window.parent.postMessage(
    {
      type: 'approval-view-save-data-result',
      processInstanceId: info.value.processInstanceId,
      result,
    },
    location.origin,
  );
};

const receiveMessage = async (event: MessageEvent) => {
  if (
    event.data?.type === 'approval-view-save-data' &&
    event.data?.processInstanceId === info.value.processInstanceId
  ) {
    if (!approvalViewRef.value?.saveData) {
      sendMessage(true);
      return;
    }
    const result = await approvalViewRef.value?.saveData?.();
    sendMessage(result);
  }
};

onMounted(() => {
  window.addEventListener('message', receiveMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', receiveMessage);
});
</script>

<style lang="scss" scoped></style>
