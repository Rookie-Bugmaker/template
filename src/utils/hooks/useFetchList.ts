import type { ResponseBody } from '@/api/typing';
import { Modal } from 'ant-design-vue';
import { reactive, toRefs, watch } from 'vue';

/**列表状态 */
export interface State<T extends ResponseBody<any>> {
  /**列表数据 */
  list: T['result'];
  /**列表加载状态 */
  loading: boolean;
}

/**配置项 */
export interface Options<T> {
  /**参数 */
  params?: any;
  /**是否监听参数变化自动刷新加载数据 */
  watchParams?: boolean;
  /**是否立即调用 */
  autoFetch?: boolean;
  /**调用成功回调 */
  onSuccess?: (result: T) => void;
  /**校验接口参数 */
  onValidateParams?: (params: any, next: () => void) => Promise<any> | void;
  /**转换数据 */
  convertData?: (result: T) => Promise<any[]> | any[];
}

export const useFetchList = <T extends ResponseBody<any>>(
  /**列表查询 */
  queryList: (params?: any) => Promise<T>,
  options?: Options<T['result']>,
) => {
  /**列表状态 */
  const state: State<T> = reactive({
    list: [],
    loading: false,
  });
  /**默认配置 */
  const _options: Options<T['result']> = reactive({
    params: undefined,
    autoFetch: true,
    watchParams: true,
  });
  Object.assign(_options, options || {});

  const fetchData = async (params = _options.params) => {
    try {
      state.loading = true;
      const { success, message: content, result = [] } = await queryList(params);
      if (success) {
        if (options?.convertData) {
          state.list = await options.convertData(result);
        } else {
          state.list = result;
        }
        _options.onSuccess?.(result);
      } else {
        Modal.error({ title: '获取列表数据失败', content });
      }
    } catch (err: any) {
      Modal.error({
        title: '获取列表数据失败',
        content: err,
      });
    } finally {
      state.loading = false;
    }
  };

  /**获取列表 */
  const getList = async () => {
    if (_options.onValidateParams) {
      return await _options.onValidateParams?.(_options.params, fetchData);
    } else {
      return await fetchData();
    }
  };
  /**清空列表 */
  const clear = () => {
    state.list = [] as any;
  };
  /**监听参数 */
  watch(
    () => options?.params,
    params => {
      _options.params = params;
      if (_options.watchParams) {
        getList();
      }
    },
    { deep: true, immediate: _options.autoFetch },
  );
  return {
    clear,
    reload: getList,
    ...toRefs(state),
  };
};
