import { message, Modal } from 'ant-design-vue';
import to from 'await-to-js';

export const friendlyErrorFeedback = (code, msg, friendlyMsg = '网络异常', forceTip = true) => {
  const m = msg?.trim?.() ?? '';

  if (code >= 500 && code < 600) {
    if (forceTip) {
      Modal.error({ title: '异常', content: m ?? friendlyMsg });
      return;
    }
    message.error(friendlyMsg);
    return;
  }

  code != 200 && m && message.warn(m);
};

export const checkValidErrStr = async (validate, silent = false) => {
  try {
    const [err] = await to(validate());
    const errStr =
      (err as any)?.errorFields?.map(({ errors }) => errors.join(','))?.join(',') ?? '';
    if (errStr) throw new Error(errStr);
    return true;
  } catch (error) {
    if (error instanceof Error && !silent) message.error(error.message);
    return false;
  }
};
