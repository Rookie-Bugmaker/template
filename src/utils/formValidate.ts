import { message } from 'ant-design-vue';
import to from 'await-to-js';

export const handleFormValidation = async <T>(validateFn: () => Promise<T>) => {
  const [err] = await to(validateFn());

  if (err) {
    const errorMessage = (err as any)?.errorFields?.[0]?.errors?.[0];
    if (errorMessage) {
      message.warning(errorMessage);
    } else {
      message.warning('表单验证失败，请检查输入');
    }
    return false;
  }

  return true;
};
