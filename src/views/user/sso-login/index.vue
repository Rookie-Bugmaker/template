<template>
  <div class="main">
    <a-result
      :status="state.isLoginError ? 'error' : 'info'"
      :title="state.isLoginError ? '登录失败' : '登录中...'"
    >
      <template #icon>
        <close-circle-outlined v-if="state.isLoginError" :style="{ color: 'red' }" />
        <loading-outlined v-else />
      </template>
    </a-result>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { notification, Result as AResult } from 'ant-design-vue';
import parseURL from '@/utils/parseUrl';
import { useUserStore } from '@/store/user';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import type { LoginResult } from '@/api/login/index';
import type { ResponseBody } from '@/api/typing';
import type { RequestError } from '@/utils/request';
import { useSsoLogin } from '../hooks/useSsoLogin';
import { buildSsoAuthPath } from '../utils';

export default defineComponent({
  name: 'SSOLogin',
  setup() {
    const { t } = useI18n();
    const userStore = useUserStore();
    const router = useRouter();
    const route = useRoute();

    const state = reactive({
      isLoginError: false,
    });

    const code = parseURL(window.location.href)?.query?.code;

    const stateParams = parseURL(window.location.href)?.query?.state;
    const stateParamsStr = stateParams ? decodeURIComponent(stateParams as string) : '';
    const stateParamsArr = stateParamsStr.split('&')?.map(m => {
      const paramArr = m.split('=');
      return {
        key: paramArr?.[0],
        value: paramArr?.[1],
      };
    });
    //单点登录配置编码
    const configCode = stateParamsArr.find(f => f.key == 'configCode')?.value;
    //子系统编码
    const subCode = stateParamsArr.find(f => f.key == 'subCode')?.value;

    const ssoLogin = useSsoLogin();

    //如果code为空，则将跳回请求登陆认证地址
    if (!code) {
      ssoLogin.getConfigList().then(res => {
        const targetConfig = res?.find(f => f.configCode == configCode);
        if (targetConfig) {
          window.location.href = buildSsoAuthPath(targetConfig);
        }
      });
    }

    const loginSuccess = () => {
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        notification.success({
          message: t('pages.login.welcome'),
          description: t('pages.login.welcomeBack'),
        });
      }, 1000);
      //跳转根目录
      router.replace({
        path: decodeURIComponent((route.query?.redirect as string) || '') || '/',
        query: subCode
          ? {
              subCode,
            }
          : {},
      });
    };

    const loginFailed = (res: ResponseBody) => {
      state.isLoginError = true;
      notification.error({
        message: t('pages.login.fail'),
        description: res.message,
        duration: 4,
      });
    };

    const requestFailed = (err: RequestError) => {
      state.isLoginError = true;
      notification.error({
        message: t('global.error'),
        description:
          ((err.response || {}).data || {}).errorMessage || t('global.request.failed.retry'),
        duration: 4,
      });
    };

    if (code && configCode) {
      userStore
        .SSO_LOGIN(code as string, configCode as string)
        .then((res: ResponseBody<LoginResult>) => {
          if (res.success) {
            loginSuccess();
          } else {
            loginFailed(res);
          }
        })
        .catch(err => {
          requestFailed(err);
        });
    } else {
      state.isLoginError = true;
    }

    return { state };
  },
  components: {
    AResult,
  },
});
</script>

<style lang="less" scoped></style>
