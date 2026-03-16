import { type Ref } from 'vue';
import { useAsyncState } from '@vueuse/core';

import type { ResponseBody } from '@/api/typing';

type ApiFunction<T = unknown> = (params?: T, silent?: boolean) => Promise<ResponseBody>;

interface UseRequstResult<T> {
  isLoading: Ref<boolean>;
  request: (params?: T, silent?: boolean) => Promise<ResponseBody>;
}

export function useRequest<T extends any[]>(apis: { [K in keyof T]: ApiFunction<T[K]> }): {
  [K in keyof T]: UseRequstResult<T[K]>;
} {
  return apis.map(apiFn => {
    const { isLoading, execute } = useAsyncState<ResponseBody, Parameters<typeof apiFn>>(
      (params, silent) => apiFn(params, silent),
      { success: false, message: '', result: null, code: 0 },
      { immediate: false },
    );

    return {
      isLoading,
      request: (params, silent = false) => execute(0, params, silent),
    };
  }) as any;
}
