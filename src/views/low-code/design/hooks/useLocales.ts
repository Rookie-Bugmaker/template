import { inject } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { isString } from 'lodash';

export interface LocalesItem {
  uid: string;
}

export function useLocales() {
  const designerState = inject(designerStateInjectKey);

  const getLocaleMessage = (config: string | LocalesItem) => {
    if (!config || isString(config)) {
      return config;
    } else {
      return designerState.config.locales.find(f => f.uid === config.uid)?.['zh-CN'];
    }
  };

  return {
    getLocaleMessage,
  };
}
