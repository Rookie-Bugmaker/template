import { hasIn } from 'lodash-es';
import { isRef } from 'vue';

/**
 * 达夫设备循环
 * @param items 数据
 * @param process 循环处理句柄
 */
export function duffDevice<T>(items: T[], process: (item: T, index: number, items: T[]) => any) {
  const len = items.length;
  let startAt = len % 8,
    iterations = Math.ceil(len / 8),
    i = 0;

  do {
    switch (startAt) {
      case 0:
        process(items[i], i++, items);
      // eslint-disable-next-line no-fallthrough
      case 7:
        process(items[i], i++, items);
      // eslint-disable-next-line no-fallthrough
      case 6:
        process(items[i], i++, items);
      // eslint-disable-next-line no-fallthrough
      case 5:
        process(items[i], i++, items);
      // eslint-disable-next-line no-fallthrough
      case 4:
        process(items[i], i++, items);
      // eslint-disable-next-line no-fallthrough
      case 3:
        process(items[i], i++, items);
      // eslint-disable-next-line no-fallthrough
      case 2:
        process(items[i], i++, items);
      // eslint-disable-next-line no-fallthrough
      case 1:
        process(items[i], i++, items);
    }
    startAt = 0;
  } while (--iterations);
}

/**
 * 将 b 的属性复制到 a
 * @param a
 * @param b
 * @param forceMatchRight 强制匹配 b 的属性
 */
export const copyCommonProperties = (a, b, forceMatchRight = false) => {
  if (!b) return;
  const aKeys = Object.keys(a);
  aKeys.forEach(key => {
    if (hasIn(b, key)) {
      a[key] = b[key];
    } else if (forceMatchRight) {
      if (hasIn(b, key)) a[key] = b[key];
      else delete a[key];
    }
  });
};

export const len = arr => (isRef<any>(arr) ? arr.value?.length ?? 0 : arr?.length ?? 0);

/**隐式转换bool 但0视为true */
export const toBoolean = value => {
  if (value === 0) return true; // 特别处理0，不转换为false
  return Boolean(value);
};
/**
 * 重试函数
 * @param fn 异步函数
 * @param retries 重试次数
 * @param delay 重试延迟时间(毫秒)
 * @returns
 */
export function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const attempt = (currentAttempt: number) => {
      fn()
        .then(resolve)
        .catch(error => {
          if (currentAttempt < retries) {
            setTimeout(() => attempt(currentAttempt + 1), delay);
          } else {
            reject(error);
          }
        });
    };
    attempt(1);
  });
}

export function convertStringToNumber(str) {
  const num = parseFloat(str);
  if (isNaN(num)) {
    return null;
  }

  return num;
}

export const tryParseJson = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
};
