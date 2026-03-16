import { ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useCompRef<T extends abstract new (...args: any) => any>(_comp: T) {
  return ref<InstanceType<T>>();
}
