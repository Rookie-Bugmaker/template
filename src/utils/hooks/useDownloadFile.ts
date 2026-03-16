import { reactive } from 'vue';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { requestHandler, errorHandler } from '@/utils/request';
import { downloadFile } from '@/utils/downloadFile';
import { message } from 'ant-design-vue';
import axios from 'axios';

export interface DownloadFileOptions extends AxiosRequestConfig {
  method?: 'get' | 'GET' | 'post' | 'POST';
  isQueryParams?: boolean;
}

export function useDownloadFile<T = Blob, R = any>(
  defaultOptions?: DownloadFileOptions,
): {
  fetchData: (params: any) => Promise<AxiosResponse<T, R>>;
  download: (params?: any, fileName?: string) => Promise<void>;
  print: (params: any) => Promise<void>;
} {
  const initOptions = (): DownloadFileOptions => ({
    method: 'get',
    isQueryParams: false,
    responseType: 'blob',
  });

  /* 配置项 */
  const options: DownloadFileOptions = reactive(Object.assign(initOptions(), defaultOptions));

  const request = axios.create({
    // API 请求的默认前缀
    baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 30000, // 请求超时时间
  });

  request.interceptors.request.use(requestHandler, errorHandler);

  const fetchData = async (params: any): Promise<AxiosResponse<T, R>> => {
    const config = {
      baseURL: process.env.VUE_APP_API_BASE_URL,
      timeout: 30000,
      ...options,
      ...(options.method?.toLowerCase() === 'post' && !options.isQueryParams
        ? { data: params }
        : { params }),
    };
    return request(config);
  };

  const parseStr = str => {
    if (typeof str !== 'string') {
      return '数据类型错误';
    }
    try {
      const obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return obj?.message;
      } else {
        return str;
      }
    } catch (e) {
      return str;
    }
  };

  const download = async (params?: any, fileName?: string): Promise<void> => {
    const { data, headers } = await fetchData(params);
    const contentType = ['application/json', '*/*;charset=UTF-8'];
    if (contentType.includes(headers['content-type'])) {
      if (data instanceof Blob) {
        data.arrayBuffer().then(buffer => {
          const decodedString = new TextDecoder().decode(buffer);
          message.error(parseStr(decodedString));
        });
      } else {
        message.error('类型错误');
      }
    } else {
      if (!fileName) {
        const disposition = headers['content-disposition'];
        const filenameRegex = /filename(?:name)?[^;=\n]*=((['"]).*?\2|[^;\n]*)/i;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          fileName = matches[1].replace(/['"]/g, '');
        }
        fileName = decodeURI(fileName);
      }
      downloadFile(data, fileName);
    }
  };

  const print = async (params?: any): Promise<void> => {
    const { data, headers } = await fetchData(params);
    const contentType = ['application/json', '*/*;charset=UTF-8'];
    if (contentType.includes(headers['content-type'])) {
      if (data instanceof Blob) {
        data.arrayBuffer().then(buffer => {
          const decodedString = new TextDecoder().decode(buffer);
          message.error(parseStr(decodedString));
        });
      } else {
        message.error('类型错误');
      }
    } else {
      // downloadFile(data, fileName);
      const url = window.URL.createObjectURL(data as Blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    }
  };

  return {
    fetchData,
    download,
    print,
  };
}
