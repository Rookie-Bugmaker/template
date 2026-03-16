import { message, Modal } from 'ant-design-vue';
import request from '@/utils/request';
import type { ResponseBody } from '@/api/typing';
import { reactive } from 'vue';

type Status = 'process' | 'error' | 'finish';
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  preview?: string;
  originFileObj?: any;
  file: string | Blob;
}
interface stateItem {
  popoverVisible: boolean;
  open: boolean;
  loading: boolean;
  currentStatus: number;
  stepStatus: Status;
  statusValue: string;
  redisKey: string;
  currenFile: FileItem;
}
export const useUpload = props => {
  // const basePath = process.env.VUE_APP_API_BASE_URL;
  const state = reactive<stateItem>({
    popoverVisible: false,
    open: false,
    loading: false,
    currentStatus: 0,
    stepStatus: 'process',
    statusValue: '',
    redisKey: '',
    currenFile: null,
  });

  const getStatus = (file: FileItem, key: string, step, msg: string) => {
    state.currenFile = file;
    state.currentStatus = step.num;
    state.stepStatus = step.status;
    state.statusValue = msg;
    state.redisKey = key;
  };
  const visibleChange = () => {
    if (props.disabled || state.popoverVisible) {
      state.popoverVisible = false;
    } else {
      state.popoverVisible = true;
    }
  };
  // 下载结果文件
  const downloadResult = async () => {
    state.loading = true;
    const res = await request.get(`/${props.downloadResUrl}`, {
      params: { redisKey: state.redisKey },
      responseType: 'blob',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res) {
      downloadExcel(res, props.downloadResName || '附件');
    } else {
      message.warning('空文件');
    }
    state.loading = false;
  };
  // 校验成功之后导入文件
  const handleUpload = async () => {
    state.loading = true;
    let res;
    if (props.importMethod == 'get') {
      res = await request.get<string, ResponseBody>(`/${props.importUrl}`, {
        params: { redisKey: state.redisKey },
      });
    } else {
      res = await request.post<string, ResponseBody>(`/${props.importUrl}`, {
        redisKey: state.redisKey,
      });
    }
    state.currentStatus = 2;
    if (res.success) {
      state.stepStatus = 'finish';
      state.statusValue = `${state.currenFile.name} 文件导入成功!`;
      message.success(`${state.currenFile.name} 文件导入成功!`);
    } else {
      state.stepStatus = 'error';
      state.statusValue = `${state.currenFile.name} 文件导入失败: ${res.message}`;
      Modal.error({
        title: `${state.currenFile.name} 文件导入失败!`,
        content: res.message,
      });
    }
    state.loading = false;
  };
  // 导出文件
  const exportFile = async () => {
    state.popoverVisible = false;
    state.loading = true;
    let res;

    if (!props.isLowCode) {
      if (props.validate) {
        try {
          await props.validate();
        } catch (e) {
          message.warning('校验失败');
          return;
        }
      }
      if (props.exportRequestMethod === 'post') {
        res = await request.post(`/${props.exportUrl}`, props.exportParams, {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        res = await request.get(`/${props.exportUrl}`, {
          params: props.exportParams,
          responseType: 'blob',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
    } else {
      res = await request.post(`/${props.exportUrl}`, props.exportParams, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    if (res) {
      if (res.type === 'application/json') {
        const textDecoder = new TextDecoder();
        res.arrayBuffer().then(buffer => {
          const decodedString = textDecoder.decode(buffer);
          message.warning(JSON.parse(decodedString).message);
        });
      } else {
        downloadExcel(res, props.exportFileName || '附件');
      }
    } else {
      message.warning('空文件');
    }
    state.loading = false;
  };
  // 模版下载
  const downloadTemplete = async () => {
    state.popoverVisible = false;
    state.loading = true;
    const res = await request.get(`/${props.downloadTempleteUrl}`, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res) {
      downloadExcel(res, props.downloadTempleteName || '附件');
    } else {
      message.warning('空文件');
    }
    state.loading = false;
  };
  // 下载excel
  const downloadExcel = (res, name) => {
    const blob = new Blob([res as any], {
      type: 'multipart/form-data',
    });
    const downloadElement = document.createElement('a');
    const href = window.URL.createObjectURL(blob);
    downloadElement.href = href;
    downloadElement.download = `${name}.xlsx`;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    // 释放URL 对象
    window.URL.revokeObjectURL(href);
  };
  const complete = () => {
    state.open = false;
    state.currenFile = null;
    state.statusValue = '';
    state.currentStatus = 0;
    state.stepStatus = 'process';
    state.redisKey = '';
  };
  const cancel = () => {
    state.open = false;
    state.currenFile = null;
    state.statusValue = '';
    state.currentStatus = 0;
    state.stepStatus = 'process';
    state.redisKey = '';
  };
  return {
    state,
    downloadTemplete,
    exportFile,
    cancel,
    getStatus,
    downloadResult,
    handleUpload,
    complete,
    visibleChange,
  };
};
