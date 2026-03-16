import request /* , { CONTENT_TYPE_APPLICATION_JSON } */ from '@/utils/request';
import { Service } from '@/api/typing';

/**
 * 日志分页查询对象
 */
export interface LogPageQuery extends PageParams {
  /** 搜索关键字 */
  username?: string;
  logType?: string;
  operationType?: string;
}

/**
 * 系统日志分页VO
 */
export interface LogPageVO {
  /** 主键 */
  id: number;
  /** 操作人 */
  userName: string;
  /** 方法名称 */
  funcName: string;
  /** 日志类型 */
  logType: string;
  /** 操作类型 */
  operationType: string;
  /** IP 地址 */
  remoteIp: string;
  /** 运行时长 */
  runTime: string;
  /** 结果 */
  result: string;
  /** 创建时间 */
  createDate: string;
}

/**  访问趋势视图对象 */
export interface VisitTrendVO {
  /** 日期列表 */
  dates: string[];
  /** 浏览量(PV) */
  pvList: number[];
  /** 访客数(UV) */
  uvList: number[];
  /** IP数 */
  ipList: number[];
}

/** 访问趋势查询参数 */
export interface VisitTrendQuery {
  /** 开始日期 */
  startDate: string;
  /** 结束日期 */
  endDate: string;
}

/**  访问统计 */
export interface VisitStatsVO {
  /** 标题 */
  title: string;
  /** 类型 */
  type: 'pv' | 'uv' | 'ip';

  /** 今日访问量 */
  todayCount: number;
  /** 总访问量 */
  totalCount: number;
  /** 同比增长率（相对于昨天同一时间段的增长率） */
  growthRate: number;

  totalCountOutput: number;
}

/**
 * 获取日志分页列表
 *
 * @param queryParams 查询参数
 */
export async function getPage(queryParams: LogPageQuery) {
  return request.get<any, ResponseBody<PageResult<LogPageVO>>>(`${Service.SYS}/audit_log/page`, {
    params: queryParams,
  });
}

/**
 * 获取访问趋势
 *
 * @param queryParams
 * @returns
 */
export async function getVisitTrend(queryParams: VisitTrendQuery) {
  return request.get<any, ResponseBody<VisitTrendVO>>(`${Service.SYS}/audit_log/visit-trend`, {
    params: queryParams,
  });
}

/**
 * 获取访问趋势
 *
 * @param queryParams
 * @returns
 */
export async function getVisitStats() {
  return request.get<any, ResponseBody<VisitStatsVO[]>>(`${Service.SYS}/audit_log/visit-stats`);
}
