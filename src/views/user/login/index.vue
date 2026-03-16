<template>
  <div class="main">
    <div class="language">
      <img src="~@/assets/image/login/language.svg" class="lanuage-icon" alt="lanuage-icon" />
      <a-dropdown>
        <a class="link" @click.prevent>
          {{ languageLabels[currentLang] }}
          <img
            src="~@/assets/image/login/dropdown.svg"
            style="height: 12px; vertical-align: unset"
          />
        </a>
        <template #overlay>
          <a-menu class="lanuage-menu" :selected-keys="[currentLang]" @click="handleMenuClick">
            <a-menu-item v-for="locale in locales" :key="locale" class="language-item">
              <template #icon>
                <span role="img" :aria-label="languageLabels[locale]">
                  {{ languageIcons[locale] }}
                </span>
              </template>
              {{ languageLabels[locale] }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <h3 :class="['login-title', currentLang]">
      <span>{{ $t('pages.login.title') }}</span>
      <span class="login-title-sub">TAICHU</span>
    </h3>

    <a-form id="formLogin" layout="vertical" class="user-layout-login">
      <a-tabs :active-key="customActiveKey" @change="handleTabClick">
        <a-tab-pane key="normal" :tab="$t('pages.login.tabs.usernameLogin')">
          <a-alert
            v-if="isLoginError"
            type="error"
            show-icon
            class="login-alert"
            :message="loginErrorMessage"
          />
          <a-form-item v-bind="validateInfos.username">
            <login-input
              v-model:value="modelRef.username"
              :placeholder="$t('pages.login.username.placeholder')"
              style="width: 100%"
            >
              <template #prefix>
                <img src="~@/assets/image/login/user-name.png" class="prefixIcon" />
              </template>
            </login-input>
          </a-form-item>

          <a-form-item v-bind="validateInfos.password">
            <login-input
              v-model:value="modelRef.password"
              :placeholder="$t('pages.login.password.placeholder')"
              style="width: 100%"
              type="password"
            >
              <template #prefix>
                <img src="~@/assets/image/login/password.png" class="prefixIcon" />
              </template>
            </login-input>
          </a-form-item>
          <a-form-item v-if="loginErrorCount >= 3" v-bind="validateInfos.captcha">
            <login-input
              v-model:value="modelRef.captcha"
              :placeholder="$t('pages.login.captcha.placeholder')"
              style="width: 100%"
            >
              <template #prefix>
                <img src="~@/assets/image/login/captcha.png" class="prefixIcon" />
              </template>
              <template #suffix>
                <img
                  :src="captchaImgSrc"
                  style="height: 0.45rem; width: 0.92rem"
                  @click="handleGetImgCaptcha"
                />
              </template>
            </login-input>
          </a-form-item>
        </a-tab-pane>

        <a-tab-pane key="ldap" tab="LDAP">
          <a-alert
            v-if="isLoginError"
            type="error"
            show-icon
            class="login-alert"
            :message="loginErrorMessage"
          />
          <a-form-item v-bind="validateInfos.username">
            <login-input
              v-model:value="modelRef.username"
              :placeholder="$t('pages.login.username.placeholder')"
              style="width: 100%"
            >
              <template #prefix>
                <img src="~@/assets/image/login/user-name.png" class="prefixIcon" />
              </template>
            </login-input>
          </a-form-item>

          <a-form-item v-bind="validateInfos.password">
            <login-input
              v-model:value="modelRef.password"
              :placeholder="$t('pages.login.password.placeholder')"
              style="width: 100%"
              type="password"
            >
              <template #prefix>
                <img src="~@/assets/image/login/password.png" class="prefixIcon" />
              </template>
            </login-input>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>

      <!-- <a-form-item>
        <a-checkbox v-model:cheched="modelRef.rememberMe">自动登录</a-checkbox>
        <router-link to="/user/recover" class="forge-password" style="float: right">
          忘记密码
        </router-link>
      </a-form-item> -->

      <a-form-item class="submit-button-item">
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="login-button"
          :loading="loginBtnLoading"
          @click="handleSubmit"
        >
          {{ (customActiveKey === 'ldap' ? 'LDAP' : '') + $t('pages.login.submit') }}
        </a-button>
      </a-form-item>
      <div class="form-bottom">
        <a-checkbox class="remember-password" v-model:checked="rememberMe">
          {{ $t('pages.login.remember') }}
        </a-checkbox>
        <sso-login-button />
      </div>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, watch, onMounted } from 'vue';
import { getImageCaptcha /* , getPublicKey */ } from '@/api/login/index';
import { notification, Form, Modal } from 'ant-design-vue';

import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import type { LoginResult } from '@/api/login/index';
import { type ResponseBody } from '@/api/typing';
import type { RequestError } from '@/utils/request';
import { uuid } from '@/utils/unique-key-util';
import { useAppStore } from '@/store/app';

import LoginInput from './components/login-input.vue';

import { useI18n } from 'vue-i18n';
import { locales } from '@/locales';
import type { Locale } from '@/locales';
import type { MenuProps } from 'ant-design-vue';

import { cloneDeep } from 'lodash';
import JSEncrypt from 'jsencrypt';

import { encode, decode } from 'js-base64';
const REMEMBER_ME_KEY = 'remember-me-key';

import SsoLoginButton from './components/sso-login-button.vue';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();
    const appStore = useAppStore();
    const { t } = useI18n();

    const state = reactive({
      customActiveKey: 'normal',
      loginBtnLoading: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      loginErrorMessage: '',
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      loginErrorCount: computed(() => userStore.loginErrorCount),
      currentImgCaptchaUuid: '',
      captchaImgSrc: '',

      rememberMe: false,

      time: 60,
      smsSendBtn: false,
    });

    const jse = new JSEncrypt();
    /* getPublicKey().then(res => {
      const pk = '-----BEGIN PUBLIC KEY-----' + res.result.publicKey + '-----END PUBLIC KEY-----';
      jse.setPublicKey(pk);
    }); */
    jse.setPublicKey(
      'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJK8wwL06DQUeQZOAHA8sXJzgDQKjllaKNJ760feZjuDJ/eI19oAlpDf4oW6qYhGwhPGHLa4Z70WT+bkGPSTxAzYbMEvGy4M7UE3uN9hKDVaYPf0cCDHUEN/XmzZsTjp78cny3DMQcRdenJKMldNtQvtB4etG2AKB3pKUaW/F4twIDAQAB',
    );

    const handleUsernameOrEmail = (_rule: any, value: any) => {
      return new Promise(resolve => {
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (regex.test(value)) {
          state.loginType = 0;
        } else {
          state.loginType = 1;
        }
        resolve(state.loginType);
      });
    };
    const modelRef = reactive({
      rememberMe: true,
      username: '',
      password: '',
      mobile: '',
      captcha: '',
      captchaFlag: false,
    });
    const rulesRef = reactive({
      rememberMe: undefined,
      username: [
        { required: true, message: () => t('pages.login.username.required'), type: 'string' },
        { validator: handleUsernameOrEmail, trigger: 'change' },
      ],
      password: [
        {
          required: true,
          message: () => t('pages.login.password.required'),
          type: 'string',
          trigger: ['blur', 'change'],
        },
      ],
      mobile: [
        {
          required: true,
          // pattern: /^1[34578]\d{9}$/,
          message: () => t('pages.login.phoneNumber.invalid'),
          trigger: ['blur', 'change'],
        },
      ],
      captcha: [{ required: true, message: () => t('pages.login.captcha.required') }],
    });
    const { validateInfos, validate, resetFields, clearValidate } = Form.useForm(
      modelRef,
      rulesRef,
    );

    const handleTabClick = (key: string) => {
      state.customActiveKey = key;
      resetFields();
    };

    const requestFailed = (err: RequestError) => {
      state.loginErrorMessage = t('pages.login.error');
      state.isLoginError = true;
      notification.error({
        message: t('global.error'),
        description:
          ((err.response || {}).data || {}).errorMessage || t('global.request.failed.retry'),
        duration: 4,
      });
    };

    const loginSuccess = () => {
      //记住登录用户信息
      if (state.rememberMe) {
        localStorage.setItem(
          REMEMBER_ME_KEY,
          JSON.stringify({
            username: encode(modelRef.username),
            password: encode(modelRef.password),
          }),
        );
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        notification.success({
          message: t('pages.login.welcome'),
          description: t('pages.login.welcomeBack'),
        });
      }, 1000);
      state.loginErrorMessage = '';
      state.isLoginError = false;
      //登录成功，登录错误计数归零
      userStore.SET_LOGIN_ERROR_COUNT(0);
      //跳转根目录
      router.replace(decodeURIComponent((route.query?.redirect as string) || '') || '/');
    };

    const loginFailed = (res: ResponseBody) => {
      state.loginErrorMessage = res.message;
      if (res.message == '验证码已过期') {
        handleGetImgCaptcha(null);
      }
      state.isLoginError = true;
      notification.error({
        message: t('pages.login.fail'),
        description: res.message,
        duration: 4,
      });
      //记录登录错误次数
      userStore.SET_LOGIN_ERROR_COUNT(res?.result?.loginErrorCount);
    };

    //错误次数达到三次后，显示验证码
    watch(
      () => state.loginErrorCount,
      n => {
        if (n >= 3) {
          handleGetImgCaptcha(null);
        }
      },
    );

    const handleGetImgCaptcha = (e: Event | null) => {
      e?.preventDefault();
      state.currentImgCaptchaUuid = uuid(32);
      getImageCaptcha(state.currentImgCaptchaUuid)
        .then(res => {
          state.captchaImgSrc = window.URL.createObjectURL(res);
        })
        .catch(() => {
          notification.error({
            message: t('global.info'),
            description: t('pages.login.captcha.failedToGet'),
            duration: 4,
          });
        });
    };

    const confirmLogin = (data, loginUuid: string) => {
      Modal.confirm({
        title: '登录确认',
        content: '该用户已登录，是否继续登录?',
        onOk: () => {
          state.loginBtnLoading = true;
          userStore
            .LOGIN({
              ...data,
              captchaFlag: state.loginErrorCount >= 3,
              uuid: state.currentImgCaptchaUuid,
              loginUuid: loginUuid,
            })
            .then((res: ResponseBody<LoginResult>) => {
              if (res.success) {
                loginSuccess();
              } else {
                loginFailed(res);
              }
            })
            .catch(err => {
              requestFailed(err);
            })
            .finally(() => {
              state.loginBtnLoading = false;
            });
        },
      });
    };

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      const validateNames = ['username', 'password'];
      //state.customActiveKey === 'normal' ? ['username', 'password'] : ['mobile', 'captcha'];
      if (state.loginErrorCount >= 3) {
        validateNames.push('captcha');
      }
      const loginFn = state.customActiveKey === 'ldap' ? userStore.LDAP_LOGIN : userStore.LOGIN;
      state.loginBtnLoading = true;
      validate(validateNames)
        .then(values => {
          const data = cloneDeep(values);
          data.username = jse.encrypt(values.username);
          data.password = jse.encrypt(values.password);
          loginFn({
            ...data,
            captchaFlag: state.loginErrorCount >= 3,
            uuid: state.currentImgCaptchaUuid,
          })
            .then((res: ResponseBody<LoginResult>) => {
              if (res.success) {
                loginSuccess();
              } else {
                if (res.code == 206) {
                  confirmLogin(data, res.result?.loginUuid);
                } else {
                  loginFailed(res);
                }
              }
            })
            .catch(err => {
              console.log(err);

              requestFailed(err);
            })
            .finally(() => {
              state.loginBtnLoading = false;
            });
        })
        .catch((/*err*/) => {
          // 屏蔽错误处理
          // requestFailed(err);
          state.loginBtnLoading = false;
        });
    };

    const languageLabels = {
      'zh-CN': '简体中文',
      'en-US': 'English',
    };
    const languageIcons = {
      'zh-CN': '🇨🇳',
      'en-US': '🇺🇸',
    };

    const currentLang = computed(() => appStore.lang);

    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
      clearValidate();
      appStore.SET_LANG(key as Locale);
    };

    onMounted(() => {
      const rememberStr = localStorage.getItem(REMEMBER_ME_KEY);
      const rData = rememberStr && JSON.parse(rememberStr);
      if (rData) {
        modelRef.username = decode(rData.username);
        modelRef.password = decode(rData.password);
        state.rememberMe = true;
      }
    });

    return {
      locales,
      languageLabels,
      languageIcons,
      currentLang,
      handleMenuClick,

      ...toRefs(state),
      modelRef,
      validateInfos,

      handleTabClick,
      handleSubmit,
      handleGetImgCaptcha,
    };
  },
  components: { LoginInput, SsoLoginButton },
});
</script>

<style lang="less" scoped>
.language {
  display: flex;
  align-items: center;
  margin-bottom: 0.38rem;
  color: #c7001a;
  font-weight: 400;
  font-size: 0.14rem;
  line-height: 0.2rem;

  .lanuage-icon {
    height: 0.2rem;
    margin-right: 0.1rem;
    color: #c7001a;
  }
  .link {
    color: #c7001a;
    font-size: 0.2rem;
  }
  :deep(.ant-dropdown-menu-item) {
    font-size: 0.14rem;
    line-height: 0.18rem;
    .ant-dropdown-menu-item-icon {
      margin-right: 0.1rem;
    }
    &.ant-dropdown-menu-item-selected {
      color: #c7001a;
    }
  }
}
.login-title {
  margin-bottom: 0.38rem;
  color: #222528;
  font-size: 0.46rem;
  font-family: 'Alibaba-PuHuiTi-R';
  line-height: 0.65rem;
  letter-spacing: 0.05rem;
  text-align: left;
  font-weight: bold;
  &.en-US {
    letter-spacing: 0.05rem;
  }
  // background: url(~@/assets/image/login/title.png) no-repeat 20% 100%;
  // background-size: contain;
  // height: 0.6rem;
  .login-title-sub {
    margin-left: 0.05rem;
    color: #c7001a;
    vertical-align: super;
    font-size: 0.26rem;
    letter-spacing: 0.05rem;
  }
}

.user-layout-login {
  .login-alert {
    margin-bottom: 0.27rem;
    font-size: 0.16rem;
  }

  .submit-button-item {
    margin: 0.17rem 0 0.13rem;
  }
  .form-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    :deep(.remember-password) {
      .ant-checkbox {
        .ant-checkbox-inner {
          width: 15px;
          height: 15px;
          overflow: hidden;
          border-radius: 50%;
        }
        &.ant-checkbox-checked {
          .ant-checkbox-inner {
            background: #c7001a;
            border-color: #c7001a;
          }
        }
        &::after {
          border-radius: 50%;
        }
      }

      span {
        color: #89949e;
        font-size: 0.16rem;
      }
    }
    .download {
      display: flex;
      align-items: center;
      padding: 4px 0px 2px;
      color: #c7001a;
      font-size: 0.16rem;
      text-decoration: underline;
      .prefix-img {
        width: 0.22rem;
        margin-right: 0.07rem;
      }
    }
  }
  button.login-button {
    width: 100%;
    height: 0.73rem;
    // padding: 0 15px;
    font-size: 0.26rem;
    background: #c7001a;
    border-radius: 4px;
  }

  .prefixIcon {
    height: 0.22rem;
  }
}

.user-layout-login :deep(.ant-form-item) {
  margin-bottom: 0.27rem;
}
.user-layout-login :deep(.ant-tabs) {
  .ant-tabs-nav {
    &::before {
      border-bottom: none;
    }
    .ant-tabs-tab {
      height: 0.28rem;
      margin-bottom: 0.14rem;
      font-size: 0.28rem;
      font-family: Alibaba-PuHuiTi-M_login-tab-text;
      line-height: 0.28rem;
      .ant-tabs-tab-btn {
        color: #89949e;
      }
      &.ant-tabs-tab-active {
        .ant-tabs-tab-btn {
          color: #c7001a;
        }
      }
    }
    // .ant-tabs-ink-bar {
    //   display: none;
    // }
  }
}
</style>
