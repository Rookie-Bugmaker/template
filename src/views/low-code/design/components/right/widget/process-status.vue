<template>
  <base-config-form>
    <a-collapse-panel key="2" header="属性设置">
      <a-alert
        message="此控件必须与PROCESS_INSTANCE_ID字段绑定才会生效"
        type="info"
        show-icon
        style="margin-bottom: 10px"
      />
    </a-collapse-panel>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseConfigForm from '../common/base-config-form.vue';

export default defineComponent({
  name: '',
  setup() {
    return {};
  },
  components: {
    BaseConfigForm,
  },
});
</script>

<style lang="less" scoped></style>
