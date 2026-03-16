import { reactive } from 'vue';

import { copyCommonProperties } from '@/utils/util';

type Resetable<T> = [T, () => void] & { state: T; reset: () => void };

export function useResetableObject<T extends object>(
  initialState: () => T,
  /**不响应 */
  notReactive = false,
): Resetable<T> {
  const state = notReactive ? initialState() : reactive(initialState());
  const reset = () => {
    copyCommonProperties(state, initialState());
  };

  return Object.assign([state, reset], { state, reset }) as unknown as Resetable<T>;
}
