import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

export type ReadStatus = 'Y' | 'N' | '';

/**
 * 消息类型
 * 1:工作流,
 * 2:PDA工单消息
 * 3:业务消息
 * 4:普通消息
 */
export type MessageType = 1 | 2 | 3 | 4;

export interface QueryMessageParams {
  readStatus: ReadStatus;
  page: number;
  pageSize: number;
  content?: string;
  typeList: MessageType[];
}

export interface MessageItem {
  logId: string;
  type: MessageType;
  returnCode: number;
  message: string;
  userId: string;
  createDate: string;
  readStatus: ReadStatus;
  processInstanceId?: string;
}

export interface UpdateMessageStatusParams {
  logId: string;
  readStatus: 'Y' | 'N';
}

//根据主页组件id查询已分配用户
export async function getMessage(params: QueryMessageParams) {
  return request.post<QueryMessageParams, ResponseBody<PageResult<MessageItem>>>(
    `${Service.MSG}/sendLog/innerMessage`,
    params,
    {
      headers: {
        ...CONTENT_TYPE_APPLICATION_JSON,
      },
    },
  );
}

//修改消息状态
export async function updateMessageStatus(params: UpdateMessageStatusParams) {
  return request.post<UpdateMessageStatusParams, ResponseBody<any>>(
    `${Service.MSG}/sendLog/updateReadStatus`,
    params,
  );
}

//根据消息id查询消息详情
export async function getMessageById(logId: string) {
  return request.get<UpdateMessageStatusParams, ResponseBody<MessageItem>>(
    `${Service.MSG}/sendLog/findById`,
    { params: { logId } },
  );
}
