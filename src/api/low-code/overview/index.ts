import request from '@/utils/request';
import type { ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';

export interface TreeItem {
  id: string;
  code: string;
  name: string;
  desc: string;
  icon: string;
  type: string;
  children?: TreeItem[];
}

// 根据分组id查询分组信息
export const findTree = (applicationName?: string) =>
  request.post<string, ResponseBody<TreeItem[]>>(`${Service.LOWCODE}/application/findAll`, {
    applicationName,
  });
