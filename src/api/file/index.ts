import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { BaseItem, ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';

/**文件信息 */
export interface FileItem extends BaseItem {
  /**文件字节 */
  fileBytes: string;
  /**文件组ID */
  fileHeaderId: string;
  /**文件ID */
  fileId: string;
  /**文件路径 */
  filePath: string;
  /**分组名称 */
  groupName: string;
  /**文件原名称 */
  oldFileName: string;
  /**文件url */
  url: string;
}
export async function upload(params: FormData) {
  return request.post<FormData, ResponseBody<FileItem[]>>(`${Service.FILE}/upload`, params, {
    headers: {
      'Content-Type': 'application/form-data',
    },
  });
}

// 根据文件id删除文件
export async function deleteByFileId(fileId: string) {
  return request.post<string, ResponseBody>(`${Service.FILE}/deleteByFileId`, { fileId });
}

// 根据文件头id查询文件
export async function findByFileHeaderId(fileHeaderId: string) {
  return request.post<string, ResponseBody<FileItem[]>>(`${Service.FILE}/findByFileHeaderId`, {
    fileHeaderId,
  });
}

// 根据文件头id批量查询文件
export async function findByFileHeaderIds(fileHeaderIds: number[]) {
  return request.post<number[], ResponseBody<FileItem[]>>(
    `${Service.FILE}/findByFileHeaderIds`,
    fileHeaderIds,
    {
      headers: {
        ...CONTENT_TYPE_APPLICATION_JSON,
      },
    },
  );
}

// 文件预览(图片/pdf)
export async function previewPictureOrPdf(fileId: string) {
  return request.get<string, Blob>(`${Service.FILE}/preview`, {
    headers: {
      'Content-Type': 'image/x-icon',
    },
    responseType: 'blob',
    params: {
      fileId,
    },
  });
}

/**下载所有文件 */
export const downloadAllFile = (headerId: string) => {
  return request.get<string, Blob>(`${Service.FILE}/downloadByHeaderId`, {
    params: { headerId },
    responseType: 'blob',
  });
};

/**下载文件 */
export const downloadFile4Bolb = (fileId: string) => {
  return request.get<string, Blob>(`${Service.FILE}/download`, {
    params: { fileId },
    responseType: 'blob',
  });
};

/**根据文件id查询文件 */
export async function findByFileId(fileId: string) {
  return request.post<string, ResponseBody<FileItem>>(`${Service.FILE}/findByFileId`, {
    fileId,
  });
}

/**根据文件头id复制文件 */
export async function copyByFileHeaderId(fileHeaderId: string) {
  return request.post<string, ResponseBody>(`${Service.FILE}/copyByFileHeaderId`, {
    fileHeaderId,
  });
}

/* 文件分页查询 */
export interface FindByPageParams {
  page: number;
  pageSize: number;
  fileId?: string;
  fileHeaderId?: string;
  oldFileName?: string;
}
export async function findFileByPage(params: FindByPageParams) {
  return request.post<FindByPageParams, ResponseBody>(`${Service.FILE}/findByPage`, params);
}
