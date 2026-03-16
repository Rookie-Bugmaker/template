<template>
  <a-popover v-model:open="visible" title="" trigger="click">
    <template #content>
      <a-textarea
        v-model:value.trim="updateValue"
        :placeholder="placeholder"
        :auto-size="{ minRows: 4, maxRows: 6 }"
      />
    </template>
    <a-input
      v-bind="$attrs"
      :style="{
        width: '100%',
      }"
      v-model:value="updateValue"
      @change="emits('update:value', updateValue)"
      @click="
        () => {
          visible = true;
        }
      "
    ></a-input>
  </a-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['update:value']);
const updateValue = ref(props.value);
const visible = ref<boolean>(false);
</script>
