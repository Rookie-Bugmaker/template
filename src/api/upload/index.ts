import request from '@/utils/request';
import type { ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';
import type { SizeType } from 'ant-design-vue/lib/config-provider';

export interface FileRule {
  multiple: boolean;
  disabled: boolean;
  value: string;
  type: string;
  maxFileSize: number;
  maxCount: number;
  accept: string;
  size: SizeType;
}
export interface ListByIdParams {
  fileHeaderId: string;
}
export interface DeleteByIdParams {
  fileId: string;
}

// 上传文件
export async function upload(params: FormData) {
  return request.post<FormData, ResponseBody>(`${Service.FILE}/upload`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
// 根据头ID查询文件列表文件
export async function getFile(fileHeaderId: string) {
  return request.post<ListByIdParams, ResponseBody>(`${Service.FILE}/findByFileHeaderId`, {
    fileHeaderId,
  });
}
// 根据文件ID删除文件
export async function delFile(fileId: string) {
  return request.post<DeleteByIdParams, ResponseBody>(`${Service.FILE}/deleteByFileId`, { fileId });
}
// 根据文件ID下载文件
export async function downFile(params) {
  return request.get<DeleteByIdParams, ResponseBody>(`${Service.FILE}/download`, { params });
}
