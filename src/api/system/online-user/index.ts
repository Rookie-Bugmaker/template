import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import { Service } from '@/api/typing';

/**
 * 在线用户分页查询对象
 */
export interface OnlineUserQuery extends PageParams {
  /** 搜索关键字 */
  clientType?: string; //客户端类型(Browser:浏览器)
  userName?: string; //用户名(模糊查询)
  fullName?: string; //员工姓名(模糊查询)
}

/**
 * 在线用户分页VO
 */
export interface OnlineUserPageVO {
  /** 用户ID */
  userId: string;
  /** 客户端类型(Browser:浏览器) */
  clientType: string;
  /** 用户名 */
  userName: string;
  /** 员工姓名 */
  fullName: number;
  /** 在线状态(Y:在线、N:离线) */
  onlineStatus: string;
}

/**
 * 获取在线用户分页列表
 *
 * @param queryParams 查询参数
 */
export async function getPage(queryParams: OnlineUserQuery) {
  return request.post<any, ResponseBody<PageResult<OnlineUserPageVO>>>(
    `${Service.SYS}/user/online/page`,
    queryParams,
    {
      headers: { ...CONTENT_TYPE_APPLICATION_JSON },
    },
  );
}

/**
 * 用户强制下线
 *
 * @param userName 用户名
 * @returns 请求结果
 */
export async function offline(userName: string) {
  return request.post<any, ResponseBody>(`${Service.SYS}/user/online/offline`, {
    userName,
  });
}
