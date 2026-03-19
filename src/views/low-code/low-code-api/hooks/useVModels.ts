import { computed, ref, watch } from 'vue';

export function useVModels(props, propName, emit) {
  const propValue = ref(props[propName]);

  watch(propValue, newValue => {
    emit(`update:${propName}`, newValue);
  });

  return computed({
    get() {
      return propValue.value;
    },
    set(value) {
      propValue.value = value;
    },
  });
}
