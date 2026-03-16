/** 统一返回结构体 */

//返回普通结构
export interface ResponseBody<T = any> {
  code: number;
  message: string;
  success: boolean; //请求状态true/false
  result: T;
}

//分页信息结构
export interface PageResult<T = any> {
  page: number; //分页页码
  pageSize: number; //偏移量
  offset?: number;
  endset?: number;
  total: number;
  rows: T[];
  [key: string]: any;
}
type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type FakePageResult<T = any> = MakeOptional<PageResult<T>, 'page' | 'pageSize' | 'total'>;

export interface RequestResult<T = any> {
  data: T;
  success: boolean;
  errorMessage: string;
}
/**Response 转 PageResult*/
export function convertResponse2PageResult<T>(
  responseBody: ResponseBody<T>,
): ResponseBody<PageResult<T>> {
  const result: ResponseBody<PageResult<T>> = {
    code: responseBody.code,
    message: responseBody.message,
    success: responseBody.success,
    result: {
      page: 0,
      pageSize: 0,
      offset: 0,
      endset: 0,
      total: 0,
      rows: responseBody.result as T[],
    },
  };
  return result;
}

//返回数据公共字段
export interface BaseItem {
  createBy: string; //创建人ID
  createDate: string; //创建时间
  lastUpdateBy: string; //最后修改人ID
  lastUpdateDate: string; //最后修改时间
  lastUpdateLogin: string; //最后登录信息

  createByName?: string; //创建人名称
  lastUpdateByName?: string; //最后修改人名称
}

//返回数据公共字段(新中车规范)
export interface IBaseItem {
  createBy: string; //创建人ID
  createTime: string; //创建时间
  updateBy: string; //最后修改人ID
  updateTime: string; //最后修改时间
  deleted: number; //逻辑删除标识
}

/**状态 */
export type BaseStatus = 'Y' | 'N';
/**统一分页参数 */
export interface PageParams {
  /**页码 */
  page?: number;
  /**偏移量 */
  pageSize?: number;
}

//后台微服务服务名
export enum Service {
  AUTH = 'auth',
  SYS = 'sys',
  MSG = 'austin',
  WORKFLOW = 'workflow',
  FILE = 'file',
  LOWCODE = 'lowcode',
}
