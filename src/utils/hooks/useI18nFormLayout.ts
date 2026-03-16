import { useI18n } from 'vue-i18n';
import type { Ref } from 'vue';
import { watch, ref } from 'vue';

export type FormLayout = {
  labelCol: {
    xs: { span: number };
    sm: { span: number };
  };
  wrapperCol: {
    xs: { span: number };
    sm: { span: number };
  };
  [key: string]: any;
};

const defaultFormLayout: FormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

export const useI18nFormLayout = (keys: string[]): Ref<FormLayout>[] => {
  const { messages, locale } = useI18n();
  const formLayoutList: Ref<FormLayout>[] = [];
  keys.forEach((str: string, index: number) => {
    formLayoutList[index] = ref<FormLayout>(
      (messages.value[locale.value][str] as FormLayout) || defaultFormLayout,
    );
  });
  watch(locale, (newLocale: string) => {
    keys.forEach((str: string, index: number) => {
      formLayoutList[index].value =
        (messages.value[newLocale][str] as FormLayout) || defaultFormLayout;
    });
  });
  return formLayoutList;
};
