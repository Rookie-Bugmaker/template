import type { AxiosRequestConfig, AxiosError } from 'axios';
import axios, { AxiosResponse } from 'axios';
import type { ResponseBody } from '@/api/typing';
import { refreshToken } from '@/api/login/index';
import { localStorage } from '@/utils/local-storage';
import {
  STORAGE_TOKEN_KEY,
  STORAGE_REFRESH_TOKEN_KEY,
  STORAGE_TOKEN_TYPE_KEY,
  STORAGE_CURRENT_LOG_MENU_ID,
} from '@/store/user';
import { STORAGE_LANG_KEY } from '@/store/app';
import { notification } from 'ant-design-vue';
import { loginRoutePath } from '@/router/define-meta';
import qs from 'qs';
import { throttle } from 'lodash-es';

// 这里是用于设定请求后端时，所用的 Token KEY
// 可以根据自己的需要修改，常见的如 Access-Token，Authorization
// 需要注意的是，请尽量保证使用中横线`-` 来作为分隔符，
// 避免被 nginx 等负载均衡器丢弃了自定义的请求头
export const REQUEST_TOKEN_KEY = 'Authorization';
export const CONTENT_TYPE_KEY = 'Content-Type';
//Content-Type 类型
export const APPLICATION_X_WWW_FORM_URLENCODED = 'application/x-www-form-urlencoded';
export const APPLICATION_JSON = 'application/json';
//定义header的Content-Type
export const CONTENT_TYPE_APPLICATION_X_WWW_FORM_URLENCODED = {};
CONTENT_TYPE_APPLICATION_X_WWW_FORM_URLENCODED[CONTENT_TYPE_KEY] =
  APPLICATION_X_WWW_FORM_URLENCODED;

export const CONTENT_TYPE_APPLICATION_JSON = {};
CONTENT_TYPE_APPLICATION_JSON[CONTENT_TYPE_KEY] = APPLICATION_JSON;

export const REQUEST_HEADER_PROJECT_CODE = 'X-Project-Code';

const generateAxios = () =>
  axios.create({
    // API 请求的默认前缀
    baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 300000, // 请求超时时间
  });
// 创建 axios 实例
const request = generateAxios();
// 一个可以返回原始响应的axios实例
const requestNative = generateAxios();

export type RequestError = AxiosError<{
  message?: string;
  result?: any;
  errorMessage?: string;
}>;

const toLoginPage = () => {
  localStorage.remove(STORAGE_TOKEN_KEY);
  localStorage.remove(STORAGE_REFRESH_TOKEN_KEY);
  localStorage.remove(STORAGE_TOKEN_TYPE_KEY);
  location.replace(`${process.env.VUE_APP_PUBLIC_PATH}${loginRoutePath}`.replaceAll('//', '/'));
};

// 异常拦截处理器
export const errorHandler = (error: RequestError): Promise<any> => {
  if (error.response) {
    const { data = {}, status, statusText } = error.response;
    // 403 无权限
    if (status === 403) {
      notification.error({
        message: 'Forbidden',
        description: (data && data.message) || statusText,
      });
    }
    // 401 未登录/未授权
    if (status === 401 && data.result) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed',
      });
      // 如果你需要直接跳转登录页面
      // location.replace(
      //   `${process.env.VUE_APP_PUBLIC_PATH} + ${loginRoutePath}`.replaceAll('//', '/'),
      // );
      toLoginPage();
    }
  }
  return Promise.reject(error);
};

// 请求拦截器
export const requestHandler = (
  config: AxiosRequestConfig<any>,
): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
  //固定项目code
  config.headers[REQUEST_HEADER_PROJECT_CODE] = process.env.VUE_APP_PROJECT_CODE;

  const savedTokenType = localStorage.get(STORAGE_TOKEN_TYPE_KEY);
  const savedToken = localStorage.get(STORAGE_TOKEN_KEY);
  // 如果 token 存在
  // 让每个请求携带自定义 token, 请根据实际情况修改
  if ('/auth/login/esc-sso' === config.url) {
    delete config.headers[REQUEST_TOKEN_KEY];
  } else if (
    !savedToken ||
    ['/auth/login', '/auth/oauth/token'].some(url => url.includes(config.url))
  ) {
    config.headers[REQUEST_TOKEN_KEY] = 'Basic QnJvd3NlcjpCcm93c2VyU2VjcmV0';
  } else {
    config.headers[REQUEST_TOKEN_KEY] = `${savedTokenType} ${savedToken}`; //注意：中间必须有个空格
  }
  if (!config.url.includes('language=')) {
    config.url = `${config.url}${config.url.includes('?') ? '&' : '?'}language=${localStorage.get(
      STORAGE_LANG_KEY,
    )}`;
  }
  if (!config.url.includes('logMenuId=')) {
    const logMenuId = localStorage.get(STORAGE_CURRENT_LOG_MENU_ID);
    if (logMenuId) {
      config.url = `${config.url}${config.url.includes('?') ? '&' : '?'}logMenuId=${logMenuId}`;
    }
  }

  //设置了header Content-Type则按设置来
  if (config.headers[CONTENT_TYPE_KEY]) {
    //如果设置了 Content-Type：application/x-www-form-urlencoded，且data不是string，需qs.stringify
    if (
      config.headers[CONTENT_TYPE_KEY] == APPLICATION_X_WWW_FORM_URLENCODED &&
      typeof config.data !== 'string'
    ) {
      config.data = qs.stringify(config.data);
    }
  } else if (['POST', 'PUT'].includes(config.method.toUpperCase())) {
    //不设置且为post类型的话，默认使用 Content-Type：application/x-www-form-urlencoded
    config.headers = {
      ...config.headers,
      ...CONTENT_TYPE_APPLICATION_X_WWW_FORM_URLENCODED,
    };
    if (typeof config.data !== 'string') {
      config.data = qs.stringify(config.data);
    }
  }
  return config;
};

// Add a request interceptor
request.interceptors.request.use(requestHandler, errorHandler);
requestNative.interceptors.request.use(requestHandler, errorHandler);

// 登录冲突（顶号）处理
const loginConflict = throttle(data => {
  notification.error({
    message: '登录失效',
    description: data.message,
  });
  setTimeout(() => toLoginPage(), 2000);
}, 2000);

// 是否正在刷新token的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
const retryRequestQueue = [];
// 响应拦截器
const responseHandler =
  (isNative = false) =>
  (response: AxiosResponse): ResponseBody<any> | AxiosResponse<any> | Promise<any> | any => {
    const curRequest = isNative ? requestNative : request;
    const { data } = response;
    if (data.code === 2002) {
      loginConflict(data);
      return;
    }
    if (data.code === 401) {
      const config = response.config;
      if (!isRefreshing) {
        isRefreshing = true;
        const savedRefreshToken = localStorage.get(STORAGE_REFRESH_TOKEN_KEY);
        refreshToken({
          grant_type: 'refresh_token',
          refresh_token: savedRefreshToken,
        })
          .catch(res => {
            console.error('刷新token失败 =>', res);
            notification.error({
              message: '登录失效/已过期',
              description: '登录失效/已过期，请重新登录',
            });
            // 刷新token失败，神仙也救不了了，跳转到首页重新登录吧
            // store.dispatch(`user/${LOGOUT}`).then(() => {});
            toLoginPage();
          })
          .finally(() => {
            isRefreshing = false;
          })
          .then(res => {
            if (res) {
              const {
                result: { access_token, refresh_token, token_type },
              } = res;
              localStorage.set(STORAGE_TOKEN_KEY, access_token);
              localStorage.set(STORAGE_REFRESH_TOKEN_KEY, refresh_token);
              localStorage.set(STORAGE_TOKEN_TYPE_KEY, token_type);
              // 已经刷新了token，将所有队列中的请求进行重试
              retryRequestQueue.forEach(cb => cb());
              // 重试完了别忘了清空这个队列
              retryRequestQueue.splice(0);
            }
            //返回当前请求，用于保留请求(这种方案可能导致请求阻塞，返回响应401出现时间差，出现token刷新多次的情况)
            // return curRequest(config);
          });
        //新方案
        return new Promise(resolve => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          retryRequestQueue.push(() => {
            resolve(curRequest(config));
          });
        });
      } else {
        // 正在刷新token，将返回一个未执行resolve的promise
        return new Promise(resolve => {
          //防止刷新token的请求也被缓存
          if (!config.url.includes('/auth/oauth/token')) {
            // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
            retryRequestQueue.push(() => {
              resolve(curRequest(config));
            });
          }
        });
      }
    } else if (data.code === 403 && process.env.NODE_ENV == 'development') {
      notification.error({
        message: '缺少权限',
        description: data.result,
        duration: null,
        placement: 'bottomRight',
      });
    } else if (data.code >= 500 && data.code < 600) {
      // Modal.error({
      //   title: '接口故障',
      //   content: data.message,
      // });
    }
    return isNative ? response : response.data;
  };

// Add a response interceptor
request.interceptors.response.use(responseHandler(), errorHandler);
requestNative.interceptors.response.use(responseHandler(true), errorHandler);

export { AxiosResponse, requestNative };

export default request;
