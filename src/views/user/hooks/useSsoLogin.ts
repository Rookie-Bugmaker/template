import { reactive, toRefs } from 'vue';
import { getPage, type ConfigPageVO } from '@/api/system/single-sign-on-config';

export function useSsoLogin() {
  const state = reactive({
    configList: [] as ConfigPageVO[],
  });

  const getConfigList = async (projectCode?: string) => {
    const res = await getPage({ page: 1, pageSize: -1, projectCode });
    if (res.success && res.result) {
      state.configList = res.result.rows || [];
    }
    return state.configList;
  };

  //获取请求登陆认证地址
  const getAuthorizeRequestUrlByCode = async (configCode: string) => {
    await getConfigList();
    return state.configList?.find(f => (f.configCode = configCode))?.authorizeRequestUrl;
  };

  return {
    ...toRefs(state),
    getConfigList,
    getAuthorizeRequestUrlByCode,
  };
}
