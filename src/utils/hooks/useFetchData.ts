import type { Ref, UnwrapRef } from 'vue';
import { isReactive, isRef, ref, watch, unref, reactive, computed } from 'vue';
import type { MaybeRef } from '@/typing';
import { isEqual } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import type { SizeType } from 'ant-design-vue/lib/config-provider';
import { Modal } from 'ant-design-vue';

/**
 * ant-design-vue中的table分页，'当前页面'属性叫current
 * 平台的统一接口,'当前页面'属性叫page
 * 现统一使用page,具体在table分页中使用时，current:state.page
 **/

export interface PageInfo {
  page: number;
  pageSize: number;
  total: number;
  [key: string]: any;
}

//自定义分页控制接口
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  [key: string]: any;
}

export interface PageResult<T = any> {
  page: number; //分页页码
  pageSize: number; //偏移量
  offset?: number;
  endset?: number;
  total: number;
  rows: T[];
  [key: string]: any;
}

export interface ReponseData<T = any> {
  code: number;
  message: string;
  success: boolean;
  result: PageResult<T>;
}

export type RequestParams =
  | {
      pageSize?: number;
      page?: number;
      [key: string]: any;
    }
  | undefined;

export interface UseFetchDataAction<T extends ReponseData<any>> {
  stripe: (record: any, index: number) => string | undefined;
  cancel: () => void;
  reload: () => Promise<void>;
  resetPageIndex: () => void;
  reset: () => void;
  context: Context<T>;
  setPageInfo: (pageInfo: Partial<PageInfo>) => void;
}

export interface Context<T extends ReponseData<any>> {
  page: number;
  pageSize: number;
  dataSource: T['result']['rows'];
  loading: boolean;
  total: number;
  requestParams?: MaybeRef<{
    [key: string]: any;
  }>;
  [key: string]: any;
  pagination: false | Pagination;
  tableSize: SizeType;
}

export const defaultContext: Context<any> = {
  stripe: false,
  loading: false,
  page: 1,
  pageSize: 50,
  total: 0,
  dataSource: [],
  pagination: false,
  tableSize: 'small', // 'default' | 'middle' | 'small'
};

// 如果请求数据中，没有分页，仅单列表数据，可以使用该方法进行包装，免去重复写请求方法
export const wrap = (req: () => Promise<any>): (() => Promise<ReponseData<PageResult<any>>>) => {
  return () =>
    req().then(res => {
      const { code, message, success, result } = res;
      return {
        code,
        message,
        success,
        result: {
          page: 1,
          pageSize: result.length,
          rows: result,
          total: result.length,
        },
      };
    });
};

const filterNoValidValue = (obj: Record<string, any> = {}) => {
  const newObj = {};
  Object.keys(obj).forEach(k => {
    if (obj[k] !== undefined && obj[k] !== '' && obj[k] !== null) {
      newObj[k] = obj[k];
    }
  });

  return newObj;
};

export const useFetchData = <T extends ReponseData<any>>(
  getData: (params?: RequestParams) => Promise<T>,
  context: MaybeRef<{
    stripe?: boolean;
    page?: number;
    pageSize?: number;
    dataSource?: T['result']['rows'];
    loading?: boolean;
    tableSize?: string;
    requestParams?: MaybeRef<{
      [key: string]: any;
    }>;
    [key: string]: any;
  }> = reactive({ ...defaultContext }),
  options?: {
    page?: number;
    pageSize?: number;
    onLoad?: (dataSource: T['result']['rows']) => void;
    onRequestError?: (e: Error) => void;
    pagination?: boolean;
    autoFetch?: boolean; //初始化时自动查询(默认开启自动查询)
    showErrorInfo?: boolean;
    onValidateParams?: (params: RequestParams, next: () => void) => void; //校验请求参数
    /**禁用翻页获取接口数据 */
    disablePageingFetch?: Ref<boolean> | boolean;
  },
): UseFetchDataAction<T> => {
  const state = reactive({ ...defaultContext } as Context<T>);
  const mergeContext = isReactive(context) || isRef(context) ? context : ref(context);

  watch(
    mergeContext,
    () => {
      Object.assign(state, unref(context));
    },
    { immediate: true },
  );

  const fetchList = async () => {
    // 请求中禁止重复请求
    if (state.loading) {
      return;
    }
    state.loading = true;
    const { pageSize = 50, page = 1 } = state;
    const showErrorInfo = options?.showErrorInfo !== false;

    try {
      const params: RequestParams =
        options?.pagination !== false
          ? {
              page,
              pageSize,
              ...filterNoValidValue(unref(mergeContext).requestParams),
            }
          : undefined;
      const { success, result, message } = await getData(params);
      if (success !== false) {
        const { rows = [], total = 0 } = result;
        state.dataSource = rows as UnwrapRef<T['result']['rows']>;
        state.total = total;
      } else {
        showErrorInfo &&
          Modal.error({
            title: '获取数据失败',
            content: message,
          });
      }
    } catch (e: any) {
      // 如果没有传递这个方法的话，需要把错误抛出去，以免吞掉错误
      if (options?.onRequestError === undefined) {
        const errMsg =
          e?.code === 'ECONNABORTED' && e?.message?.includes('timeout')
            ? '请求超时，查询数据量过多，请确认查询条件后重试！'
            : e.message;
        showErrorInfo &&
          Modal.error({
            title: '获取数据失败',
            content: errMsg,
          });
        throw new Error(e);
      } else {
        options.onRequestError(e);
      }
    } finally {
      state.loading = false;
    }
  };

  const fetchData = () => {
    if (options?.onValidateParams) {
      const params: RequestParams =
        options?.pagination !== false
          ? {
              page,
              pageSize,
              ...filterNoValidValue(unref(mergeContext).requestParams),
            }
          : undefined;
      return options.onValidateParams(params, fetchList);
    } else {
      return fetchList();
    }
  };

  const cancel = () => {};

  //保留初始参数
  const { pageSize = 50, page = 1 } = state;
  const initialParams: RequestParams = {
    ...filterNoValidValue(unref(mergeContext).requestParams),
    ...(options?.pagination !== false ? { pageSize, page } : {}),
  };
  //重置回初始参数
  const reset = () => {
    Object.assign(state.requestParams, { ...initialParams });
  };

  const reload = (redirectPageFlag = true): Promise<void> => {
    return new Promise(resolve => {
      //搜索时默认导回第一页（避免出现每页10条，搜索结果只有2条，页码却在2，导致显示不出搜索结果这种情况）
      if (redirectPageFlag) {
        state.page = 1;
        //把入参的context也修改了，不然会与内部state不同步
        if (isRef(context)) {
          context.value.page = 1;
        } else {
          context.page = 1;
        }
      }
      resolve(fetchData());
    });
  };

  const setPageInfo = (pageInfo: Partial<PageInfo>) => {
    console.warn('setPageInfo 废弃，请直接使用响应式 context');
    pageInfo.page && (state.page = pageInfo.page);
    pageInfo.pageSize && (state.pageSize = pageInfo.pageSize);
  };

  const resetPageIndex = (): void => {
    console.warn('resetPageIndex 废弃，请直接使用响应式 context');
    // state.page = 1;
  };

  //关闭参数变化，自动查询
  watch(
    [() => state.page, () => state.pageSize /* , () => ({ ...state.requestParams }) */],
    (nextValue, preValue) => {
      if (unref(options?.disablePageingFetch)) return;
      if (!isEqual(nextValue, preValue)) {
        fetchData();
      }
    },
    { immediate: options?.autoFetch !== false, deep: true },
  );

  const stripe = (_: any, index: number) =>
    index % 2 === 1 && state.stripe && 'ant-pro-table-row-striped';

  const { t } = useI18n();
  //默认分页控制
  const pagination: false | Pagination =
    options?.pagination == false
      ? false
      : reactive<any>({
          current: computed(() => state.page), //current才是控件标准的page number
          pageSize: computed(() => state.pageSize),
          total: computed(() => state.total),
          showSizeChanger: true,
          showQuickJumper: true,
          //showQuickJumper: true,
          showTotal: total => {
            return `${t('global.pagination.total.prefix')} ${total} ${t(
              'global.pagination.total.suffix',
            )}`;
          },
          size: 'small',
          pageSizeOptions: ['10', '20', '50', '100', '200', '300'],
          //position: ['bottomLeft'],
        });

  state.pagination = pagination;

  return {
    stripe,
    cancel,
    reset,
    reload,
    resetPageIndex,
    setPageInfo: info => {
      setPageInfo({
        page: state.page,
        pageSize: state.pageSize,
        ...info,
      });
    },
    context: state,
  };
};
