import type { MessageItem, MessageType } from '@/api/dashboard/items/system/notice';

export interface MessageTypeAttrs {
  typeDesc: string;
  typeColor: string;
}

export interface MessageItemExpansion extends MessageItem, MessageTypeAttrs {
  extraParams?: Record<string, any>;
}

export enum MessageTypeDesc {
  '工作流' = 1,
  'PDA工单消息' = 2,
  '业务消息' = 3,
  '消息' = 4,
}

export enum MessageTypeColor {
  '#f9c00c' = 1,
  '#00b9f1' = 2,
  '#7200da' = 3,
  '#87d068' = 4,
  //预留
  /* '#f9320c' = 5, */
}

export const getMessageTypeAttrs = (type: MessageType): MessageTypeAttrs => {
  const typeDesc = MessageTypeDesc[type] || '未知消息';
  const typeColor = MessageTypeColor[type] || '#9d9fa9';
  return {
    typeDesc,
    typeColor,
  };
};

export type MessageHandlerFunction = (messageItem: MessageItem) => MessageItemExpansion;

// 消息处理策略
export const messageHandler: Record<MessageType, MessageHandlerFunction> = {
  1: (messageItem: MessageItem): MessageItemExpansion => {
    let msgObj = { detailMessage: '' };
    try {
      msgObj = messageItem.message ? JSON.parse(messageItem.message) : {};
    } catch {
      console.log('解析工作流消息数据异常');
    }
    return Object.assign(
      {},
      messageItem,
      {
        message: msgObj?.detailMessage,
        extraParams: msgObj || {},
      },
      getMessageTypeAttrs(messageItem.type),
    );
  },
  2: (messageItem: MessageItem): MessageItemExpansion => {
    const { type } = messageItem;
    return Object.assign({}, messageItem, getMessageTypeAttrs(type));
  },
  3: (messageItem: MessageItem): MessageItemExpansion => {
    let msgObj: any = { detailMessage: '', functionName: '', routeName: '', bizId: '' };
    try {
      msgObj = messageItem.message ? JSON.parse(messageItem.message) : {};
    } catch {
      console.log('解析业务消息数据异常');
    }
    return Object.assign(
      {},
      messageItem,
      {
        message: `[${msgObj?.functionName}] ${msgObj?.detailMessage}`,
        extraParams: {
          to: {
            name: msgObj?.routeName,
            params: { bizId: msgObj?.bizId, ...msgObj?.params },
          },
        },
      },
      getMessageTypeAttrs(messageItem.type),
    );
  },
  4: (messageItem: MessageItem): MessageItemExpansion => {
    const { type } = messageItem;
    return Object.assign({}, messageItem, getMessageTypeAttrs(type));
  },
};

export default function convertMessage(messageItem: MessageItem): MessageItemExpansion {
  return messageHandler[messageItem.type](messageItem);
}
