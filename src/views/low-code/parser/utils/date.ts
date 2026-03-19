import dayjs from 'dayjs';

//日期代码
export enum DateCode {
  CURRENT_DATE_TIME = 'currentDateTime', //当前时间
  CURRENT_DATE_START_TIME = 'currentDateStartTime', // 当天开始(当天00:00:00)
  CURRENT_DATE_END_TIME = 'currentDateEndTime', //当天结束(当天23:59:59)
}

//日期代码对应的日期函数
export const DateCodeFn = {
  [DateCode.CURRENT_DATE_TIME]: (): string => {
    return dayjs().format('YYYY-MM-DD HH:mm:ss');
  },
  [DateCode.CURRENT_DATE_START_TIME]: (): string => {
    return dayjs().format('YYYY-MM-DD 00:00:00');
  },
  [DateCode.CURRENT_DATE_END_TIME]: (): string => {
    return dayjs().format('YYYY-MM-DD 23:59:59');
  },
};

//根据日期代码获取对应的日期时间
export const getDateStringByCode = (code: string): string => {
  //没有对应类型日期代码，则返回当前日期时间
  return DateCodeFn[code]?.() || DateCodeFn[DateCode.CURRENT_DATE_TIME]();
};
