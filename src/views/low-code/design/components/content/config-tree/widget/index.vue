<template>
  <component :is="widgetCompnent" :config="config" v-bind="$attrs"></component>
</template>

<script lang="ts">
import { defineComponent, computed, resolveComponent } from 'vue';
import DInput from './input.vue';
import DNumber from './number.vue';
import DRadio from './radio.vue';
import DTextarea from './textarea.vue';
import DCheckbox from './checkbox.vue';
import DDate from './date.vue';
import DTime from './time.vue';
import DSelect from './select.vue';
import DPopedit from './popedit.vue';
import DUploadFile from './upload-file.vue';
import DUploadImage from './upload-image.vue';
import DTreeSelect from './tree-select.vue';
import DPassword from './password.vue';
import DSerialNumber from './serial-number.vue';
import DValueSet from './value-set.vue';
import DPerson from './person.vue';
import DUser from './user.vue';
import DButton from './button.vue';
import DSwitch from './switch.vue';
import DProcessStatus from './process-status.vue';
import DOrg from './org.vue';
import DCompany from './company.vue';
import DDept from './dept.vue';
import DDict from './dict.vue';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const widgetCompnent = computed(() => {
      if (!props.config?.type) {
        return 'span';
      }
      const c = resolveComponent(`d-${props.config.type}`);
      return typeof c == 'string' ? 'span' : c;
    });

    return {
      widgetCompnent,
    };
  },
  components: {
    DInput,
    DNumber,
    DRadio,
    DTextarea,
    DCheckbox,
    DDate,
    DTime,
    DSelect,
    DPopedit,
    DUploadFile,
    DUploadImage,
    DTreeSelect,
    DPassword,
    DSerialNumber,
    DValueSet,
    DPerson,
    DUser,
    DButton,
    DSwitch,
    DProcessStatus,
    DOrg,
    DCompany,
    DDept,
    DDict,
  },
});
</script>

<style lang="less" scoped></style>
