import { reactive, onMounted, onUnmounted, toRefs } from 'vue';
import type { ResponseBody } from '@/api/typing';
import { localStorage } from '@/utils/local-storage';
import { STORAGE_TOKEN_KEY, STORAGE_TOKEN_TYPE_KEY } from '@/store/user';

export interface WebSocketConfig {
  path: string; //请求地址
  autoConnect?: boolean; //是否创建时自动链接
  onOpen?: (e: Event) => void;
  onClose?: (e: CloseEvent) => void;
  onError?: (err: ErrorEvent) => void;
  onMessage?: (data: ResponseBody, e?: MessageEvent) => void;
}

export interface UseWebSocketAction {
  instance: any;
  closeConnect: () => void;
  sendMessage: (data: any) => void;
}

const defaultWebSocketConfig = (): WebSocketConfig => {
  return {
    path: '',
    autoConnect: true,
    onOpen: () => {},
    onClose: () => {},
    onError: () => {},
    onMessage: () => {},
  };
};

const connectUrl = process.env.VUE_APP_WS_BASE_URL;

export const useWebSocket = (config: WebSocketConfig): UseWebSocketAction => {
  //设置默认配置
  config = Object.assign(defaultWebSocketConfig(), config);

  //ws实例
  let instance = null;
  //正在链接ws服务
  const state = reactive({
    isCreating: false,
  });
  //等待队列，多次发送时，链接还未建立成功，将多余的消息放入等待队列中
  const waitingQueue: any[] = [];

  const initConnect = () => {
    state.isCreating = true;

    const savedTokenType = localStorage.get(STORAGE_TOKEN_TYPE_KEY);
    const savedToken = localStorage.get(STORAGE_TOKEN_KEY);

    //console.log('建立连接!');
    try {
      instance = new WebSocket(
        `${connectUrl}${config.path}?Authorization=${savedTokenType} ${savedToken}`,
      );
    } catch (e: any) {
      config?.onError?.(e);
    }

    // 建立连接的事件
    instance.onopen = (e: Event) => {
      // console.log('连接成功', e);
      state.isCreating = false;
      waitingQueue.forEach(item => {
        sendMessage(item);
      });
      //清空队列
      waitingQueue.splice(0);
      config?.onOpen?.(e);
    };
    // 连接失败
    instance.onerror = (err: ErrorEvent) => {
      // console.log('连接失败', err);
      config?.onError?.(err);
    };
    // 关闭连接的事件
    instance.onclose = (e: CloseEvent) => {
      console.log('断开连接', e);
      config?.onClose?.(e);
    };
    // 接收到消息的事件
    instance.onmessage = (e: MessageEvent) => {
      // console.log('接收到数据', res.data);
      const data: ResponseBody = JSON.parse(e.data);
      config?.onMessage?.(data, e);
    };
  };

  // 发送数据
  const sendMessage = (data: any) => {
    if (state.isCreating) {
      waitingQueue.push(data);
    } else {
      // 如果未建立连接，则建立连接
      if (instance) {
        instance.send(typeof data === 'string' ? data : JSON.stringify(data));
      } else {
        waitingQueue.push(data);
        initConnect();
      }
    }
  };

  // 关闭连接
  const closeConnect = () => {
    instance?.close();
  };

  onMounted(() => {
    if (config?.autoConnect) {
      initConnect();
    }
  });

  onUnmounted(() => {
    instance?.close();
  });

  return {
    instance,
    ...toRefs(state),
    sendMessage,
    closeConnect,
  };
};
