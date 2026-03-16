import dayjs from 'dayjs';

/* 处理时间 */
export const formatTime = (time: any, format = 'YYYY-MM-DD') => {
  if (!time) return '';
  return dayjs(time).format(format);
};

/* 获取值集名称 */
export const formatVs = (arr: any[], value: any) => {
  return arr.find(v => v.vsCode === value)?.vsName || value;
};

/* 获取标签名称*/
export const getLabel = (
  arr: any[],
  value: any,
  option = { fieldLabel: 'label', fieldValue: 'value' },
) => {
  const { fieldLabel, fieldValue } = option;
  return arr.find(v => v[fieldValue] === value)?.[fieldLabel] || value;
};
