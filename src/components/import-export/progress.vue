<template>
  <a-modal :open="open">
    <a-progress :percent="progress" :show-info="false"></a-progress>
  </a-modal>
</template>

<script lang="ts">
import request from '@/utils/request';
import { defineComponent, ref } from 'vue';
import { Progress as AProgress } from 'ant-design-vue';

export default defineComponent({
  name: 'ProgressModal',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  setup(props) {
    const progress = ref(0);
    const progressVisible = ref(props.open);
    const timeout = request.defaults.timeout;
    setInterval(function () {
      if (progress.value < 60) {
        progress.value += 200 / (timeout / 100);
      } else {
        progress.value += 70 / (timeout / 100);
      }
      if (progress.value > 100) {
        // this.$emit(open = false);
      }
    }, 100);
    progressVisible.value = false;
    return {
      progressVisible,
      progress,
    };
  },
  components: { AProgress },
});
</script>
