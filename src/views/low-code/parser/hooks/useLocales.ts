import { inject } from 'vue';
import { parserStateInjectKey } from '@/views/low-code/parser/keys';
import { isString } from 'lodash';
import i18n from '@/locales/index';

export interface LocalesItem {
  uid: string;
}

export function useLocales() {
  const parserState = inject(parserStateInjectKey);

  const getLocaleMessage = (config: string | LocalesItem) => {
    if (!config || isString(config)) {
      return config;
    } else {
      return parserState.locales.find(f => f.uid === config.uid)?.[i18n.global.locale.value];
    }
  };

  return {
    getLocaleMessage,
  };
}
