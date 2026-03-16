import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { uuid } from '../unique-key-util';

export function usePrevious(currentRef: Ref<any>, maunuTrigger = false) {
  const previousRef = ref(currentRef.value);
  const maunuTick = ref(uuid(32));

  if (maunuTrigger) {
    watch(maunuTick, () => {
      previousRef.value = currentRef.value;
    });
  } else {
    watch(currentRef, (_, oldValue) => {
      previousRef.value = oldValue;
    });
  }

  const triggerSave = () => {
    maunuTick.value = uuid(32);
  };

  return {
    previous: previousRef,
    current: currentRef,
    ...(maunuTrigger ? { triggerSave } : {}),
  };
}
