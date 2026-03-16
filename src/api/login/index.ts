import request from '@/utils/request';
import type { ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';

export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  captchaFlag: boolean;
  uuid?: string;
  loginUuid?: string;
}

//用户信息
export interface UserInfo {
  userId: string; //用户ID
  userName: string; //用户名称
  password: null; //密码
  startDate: string; //账户生效时间
  endDate: string; //账户失效时间
  loginErrorCount: number; //登录错误次数，<3次无需验证码登录，4-5次需要验证码登录，>5次直接锁定
  enabled: boolean; //账户未禁用
  accountNonExpired: boolean; //账户未失效
  accountNonLocked: boolean; //账户未锁定
  credentialsNonExpired: boolean; //凭证未过期
  authorities: []; //角色列表
  currentRoleId: string; //当前角色ID
  currentOrgId: string; // 当前组织ID(跟角色ID有关)
  userDescription: string;
  userType: string;
  nextLoginUpdatePassword: string; //下次登录是否强制修改密码
  passwordExpireDate: string; //密码过期时间
  nowDate: string; //服务器当前时间

  currentCompanyId: number;
  currentDeptId: number;
}

//认证令牌
export interface Token {
  access_token: string; //访问令牌，请求API时使用
  token_type: string; //Token前缀，在发送token时，必须使用{token_type}+空格+{access_token}
  refresh_token: string; //刷新令牌，当访问令牌过期后，可以通过refresh_token进行令牌的刷新
  expires_in: number; //访问令牌的过期时间(s)
  scope: string; //令牌权限
  jti: string;
}

export interface LoginResult {
  userInfo: UserInfo;
  token: Token;
  loginUuid?: string;
}

export interface GetPublicKeyResult {
  captchaEnable: boolean;
  docHost: string;
  docPort: string;
  publicKey: string;
}

export interface ImageCaptchaRequest {
  uuid: string;
}

export async function login(params: LoginParams) {
  return request.post<LoginParams, ResponseBody<LoginResult>>(`${Service.AUTH}/login`, params);
}

export async function ldapLogin(params: LoginParams) {
  return request.post<LoginParams, ResponseBody<LoginResult>>(`${Service.AUTH}/login/ldap`, params);
}

export async function getCurrentUser() {
  return request.post<any, ResponseBody<UserInfo>>(`${Service.AUTH}/currentUser`);
}

export async function refreshToken(params: any) {
  return request.post<any, ResponseBody<Token>>(`${Service.AUTH}/oauth/token`, params);
}

export async function logout() {
  return request.post<any, any>(`${Service.AUTH}/logout`);
}

export async function getImageCaptcha(uuid: string) {
  return request.get<ImageCaptchaRequest, Blob>(`${Service.AUTH}/code/image`, {
    responseType: 'blob',
    params: {
      uuid,
    },
  });
}

//单点登录接口
export async function ssoLogin(code: string, configCode: string) {
  return request.post<string, ResponseBody<LoginResult>>(`${Service.AUTH}/login/esc-sso`, {
    code,
    configCode,
  });
}

//获取公钥
export async function getPublicKey() {
  return request.get<LoginParams, ResponseBody<GetPublicKeyResult>>(`${Service.SYS}/config/get`);
}
