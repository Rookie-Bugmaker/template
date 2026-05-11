import { acceptHMRUpdate, defineStore } from 'pinia';
import ls from '@/utils/local-storage';
import type { LoginParams, UserInfo, Token } from '@/api/login/index';
import type { ResponseBody } from '@/api/typing';
import { login, getCurrentUser, logout, ssoLogin, ldapLogin } from '@/api/login/index';
import type { RouteRecordRaw } from 'vue-router';
import { filterChildRoute, hasAuthority } from '@/utils/authority';
import { filterMenu } from '@/utils/menu-util';
import { default as router, routes, routes as devRoutes } from '@/router';
import type { MenuDataItem } from '@/router/typing';
import { generatorDynamicRouter, generatorSubAppRouter } from '@/router/generator-routers';

import { findRoleListByCurrentUser, findCurrentUserOrgInfo } from '@/api/system/role';
import { findOrgByCurrentRole } from '@/api/system/org';
import type { RoleItem, CompanyDeptInfo, DeptInfo } from '@/api/system/role/index';
import type { OrgItem } from '@/api/system/org/index';
import { findPersonByCurrentUser } from '@/api/organization/person/index';
import type { PersonItem } from '@/api/organization/person/index';

import { find } from 'lodash';
import dayjs from 'dayjs';

export const STORAGE_TOKEN_KEY = 'access_token';
export const STORAGE_REFRESH_TOKEN_KEY = 'refresh_token';
export const STORAGE_TOKEN_TYPE_KEY = 'token_type';
export const STORAGE_LOGIN_ERROR_COUNT_KEY = 'login_error_count';
export const STORAGE_CURRENT_LOG_MENU_ID = 'current_log_menu_id';

export interface UserState {
  token?: string;
  refreshToken?: string;
  tokeType?: string;
  loginErrorCount?: number;
  userId: string;
  userName: string;
  nickname: string;
  userDescription: string;
  userType: string;
  avatar: string;
  // role?: Role;
  currentRoleId: string;
  roleList?: RoleItem[];
  currentOrgId: string;
  currentOrgCode: string;
  currentOrgName: string;
  orgList?: OrgItem[];
  allowRouters: RouteRecordRaw[];
  extra: {
    [key: string]: any;
  };
  [key: string]: any;
  passwordExpireDate: string; //密码过期时间
  nextLoginUpdatePassword: string; //下次登录是否强制修改密码
  personInfo?: PersonItem;

  loadingDynamicRouters: boolean;

  /** 当前部门 */
  currentCompanyId: number | null;
  /** 权限 */
  currentDeptId: number | null;
  /**公司部门列表 */
  companyDeptList: CompanyDeptInfo[];
}

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LDAP_LOGIN = 'LDAP_LOGIN';
export const SSO_LOGIN = 'SSO_LOGIN';
export const SET_TOKEN_INFO = 'SET_TOKEN_INFO';
export const GET_INFO = 'GET_INFO';
export const GET_ROLE_LIST = 'GET_ROLE_LIST';
export const GET_ORG_LIST = 'GET_ORG_LIST';
export const GENERATE_ROUTES = 'GENERATE_ROUTES';
export const GENERATE_ROUTES_DYNAMIC = 'GENERATE_ROUTES_DYNAMIC';
export const GENERATE_ROUTES_STATIC = 'GENERATE_ROUTES_STATIC';
export const GET_PERSON_INFO = 'GET_PERSON_INFO';
export const GET_USER_COMPANY_DEPT_INFO = 'GET_USER_COMPANY_DEPT_INFO';
export const GENERATE_SUB_APP_ROUTES = 'GENERATE_SUB_APP_ROUTES';

export const SET_TOKEN = 'SET_TOKEN';
export const SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN';
export const SET_TOKEN_TYPE = 'SET_TOKEN_TYPE';
export const SET_LOGIN_ERROR_COUNT = 'SET_LOGIN_ERROR_COUNT';
export const SET_AVATAR = 'SET_AVATAR';
export const SET_ROLE = 'SET_ROLE';
export const SET_ROLE_LIST = 'SET_ROLE_LIST';
export const SET_ORG_LIST = 'SET_ORG_LIST';
export const SET_INFO = 'SET_INFO';
export const SET_ROUTERS = 'SET_ROUTERS';
export const RESET_CURRENT_USER = 'RESET_CURRENT_USER';
export const SET_PASSWORD_EXPIRE_DATE = 'SET_PASSWORD_EXPIRE_DATE';
export const SET_NEXT_LOGIN_UPDATE_PASSWORD = 'SET_NEXT_LOGIN_UPDATE_PASSWORD';
export const SET_PERSON_INFO = 'SET_PERSON_INFO';
export const SET_LOADING_DYNAMIC_ROUTES = 'SET_LOADING_DYNAMIC_ROUTES';
export const SET_USER_COMPANY_DEPT_INFO = 'SET_USER_COMPANY_DEPT_INFO';
export const SET_SUB_APP_USER_STATE = 'SET_SUB_APP_USER_STATE';

export const initState = (): UserState => ({
  token: '',
  refreshToken: '',
  tokeType: '',
  loginErrorCount: 0,
  userId: '',
  userName: '',
  nickname: '',
  userDescription: '',
  userType: '',
  avatar: '',
  extra: {},
  role: undefined,
  currentRoleId: '',
  roleList: [],
  currentOrgId: '',
  currentOrgCode: '',
  currentOrgName: '',
  orgList: [],
  allowRouters: [],
  passwordExpireDate: '',
  nextLoginUpdatePassword: 'N',
  personInfo: null,

  loadingDynamicRouters: false,

  currentCompanyId: null,
  currentDeptId: null,
  companyDeptList: [],
});

export const useUserStore = defineStore('user', {
  state: initState,
  getters: {
    info: state => state.extra,
    /*  role: state => state.role,
    userName: state => state.userName,
    nickname: state => state.nickname,
    avatar: state => state.avatar,
    allowRouters: state => state.allowRouters,
    loginErrorCount: state => state.loginErrorCount, */
    currentUser: state => state,
  },
  actions: {
    [SET_TOKEN](token: string) {
      this.token = token;
      ls.set(STORAGE_TOKEN_KEY, token);
    },
    [SET_REFRESH_TOKEN](refreshToken: string) {
      this.refreshToken = refreshToken;
      ls.set(STORAGE_REFRESH_TOKEN_KEY, refreshToken);
    },
    [SET_TOKEN_TYPE](tokenType: string) {
      this.tokenType = tokenType;
      ls.set(STORAGE_TOKEN_TYPE_KEY, tokenType);
    },
    [SET_LOGIN_ERROR_COUNT](loginErrorCount: number) {
      this.loginErrorCount = loginErrorCount;
      ls.set(STORAGE_LOGIN_ERROR_COUNT_KEY, loginErrorCount);
    },
    [SET_INFO](info: Partial<UserInfo> & { userid?: string }) {
      /* if (info.role) {
        this.role = info.role;
      } */
      if (info.currentRoleId) {
        this.currentRoleId = info.currentRoleId;
      }
      if (info.currentOrgId) {
        this.currentOrgId = info.currentOrgId;
      }
      if (info.userId) {
        this.userId = info.userId;
        this.userName = info.userName;
        this.nickname = info.userName;
      }
      if (info.userName) {
        this.nickname = info.userName;
      }
      if (info.userDescription) {
        this.userDescription = info.userDescription;
      }
      if (info.userType) {
        this.userType = info.userType;
      }
      this.nextLoginUpdatePassword = info?.nextLoginUpdatePassword;
      /* if (info.avatar) {
        this.avatar = info.avatar;
      } */
      if (info.currentCompanyId) {
        this.currentCompanyId = info.currentCompanyId;
      }
      if (info.currentDeptId) {
        this.currentDeptId = info.currentDeptId;
      }
      this.extra = { ...info };
      this.SET_PASSWORD_EXPIRE_DATE(info.passwordExpireDate, info.nowDate);
    },
    [SET_PERSON_INFO](info: PersonItem) {
      this.personInfo = info;
    },
    [SET_PASSWORD_EXPIRE_DATE](passwordExpireDate: string, serverCurrentTime: string) {
      if (
        passwordExpireDate &&
        serverCurrentTime &&
        dayjs(serverCurrentTime).isAfter(dayjs(passwordExpireDate).subtract(15, 'day'))
      ) {
        this.passwordExpireDate = passwordExpireDate;
      } else {
        this.passwordExpireDate = '';
      }
    },
    [SET_NEXT_LOGIN_UPDATE_PASSWORD](nextLoginUpdatePassword: string) {
      this.nextLoginUpdatePassword = nextLoginUpdatePassword;
    },
    /* [SET_ROLE](role: UserState['role']) {
      this.role = role;
    }, */
    [SET_ROLE_LIST](roleList: RoleItem[]) {
      this.roleList = roleList;
    },
    [SET_ORG_LIST](orgList: OrgItem[]) {
      this.orgList = orgList;
      const currentOrg = find(orgList, ({ orgId }) => orgId == this.currentOrgId);

      this.currentOrgCode = currentOrg?.orgCode ?? '';
      this.currentOrgName = currentOrg?.orgName ?? '';
    },
    [SET_AVATAR](avatar: UserState['avatar']) {
      this.avatar = avatar;
    },
    [SET_ROUTERS](allowRoutes: UserState['allowRouters']) {
      this.allowRouters = allowRoutes;
    },
    [SET_LOADING_DYNAMIC_ROUTES](loadingDynamicRouters: boolean) {
      this.loadingDynamicRouters = loadingDynamicRouters;
    },
    [RESET_CURRENT_USER]() {
      this.$reset();
    },
    [SET_USER_COMPANY_DEPT_INFO](companyDeptList: CompanyDeptInfo[]) {
      const buildDeptTree = (deptList: DeptInfo[]) => {
        return deptList.filter(f => {
          const children = deptList.filter(x => f.orgCode === x.parentOrgCode);
          f.children = children?.length ? children : null;
          return f.parentOrgCode === '' || f.parentOrgCode === null;
        });
      };
      this.companyDeptList = companyDeptList.map(m => {
        m.deptList = m.deptList || [];
        m.deptTree = buildDeptTree(m.deptList || []);
        return m;
      });
    },

    [SET_SUB_APP_USER_STATE]() {
      const baseData = window.microApp.getData();
      const info = baseData?.currentUser as Partial<UserState>;
      this.avatar = info.avatar;
      this.currentOrgId = info.currentOrgId;
      this.currentRoleId = info.currentRoleId;
      this.extra = info.extra;
      this.nickname = info.nickname;
      this.orgList = info.orgList;
      this.roleList = info.roleList;
      this.userId = info.userId;
      this.userName = info.userName;
      this.token = info.token;
      this.tokeType = info.tokeType;
      this.refreshToken = info.refreshToken;

      this.personInfo = info.personInfo;
      this.currentCompanyId = info.currentCompanyId;
      this.currentDeptId = info.currentDeptId;
      this.companyDeptList = info.companyDeptList;
    },
    [GENERATE_SUB_APP_ROUTES]() {
      const allowRoutes = generatorSubAppRouter();
      allowRoutes.forEach(r => {
        router.addRoute(r);
      });
      //确保至少有一个allowRoutes，否则会死循环
      allowRoutes.push(...(devRoutes as any));
      this.SET_ROUTERS(allowRoutes);
      return allowRoutes;
    },

    async [LOGIN](info: LoginParams) {
      return new Promise((resolve, reject) => {
        // call ajax
        login(info)
          .then(res => {
            if (res.success) {
              this.SET_ROUTERS([]); // 清空路由,防止重新登录时，路由没有刷新
              this.SET_TOKEN(res.result.token.access_token);
              this.SET_REFRESH_TOKEN(res.result.token.refresh_token);
              this.SET_TOKEN_TYPE(res.result.token.token_type);
              this.SET_INFO(res.result.userInfo);
            }
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async [LDAP_LOGIN](info: LoginParams) {
      return new Promise((resolve, reject) => {
        // call ajax
        ldapLogin(info)
          .then(res => {
            if (res.success) {
              this.SET_ROUTERS([]); // 清空路由,防止重新登录时，路由没有刷新
              this.SET_TOKEN(res.result.token.access_token);
              this.SET_REFRESH_TOKEN(res.result.token.refresh_token);
              this.SET_TOKEN_TYPE(res.result.token.token_type);
              this.SET_INFO(res.result.userInfo);
            }
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async [SSO_LOGIN](code: string, configCode: string) {
      return new Promise((resolve, reject) => {
        // call ajax
        ssoLogin(code, configCode)
          .then(res => {
            if (res.success) {
              this.SET_ROUTERS([]); // 清空路由,防止重新登录时，路由没有刷新
              this.SET_TOKEN(res.result.token.access_token);
              this.SET_REFRESH_TOKEN(res.result.token.refresh_token);
              this.SET_TOKEN_TYPE(res.result.token.token_type);
              this.SET_INFO(res.result.userInfo);
            }
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async [SET_TOKEN_INFO](info: Token) {
      return new Promise<void>(resolve => {
        this.SET_TOKEN(info.access_token);
        this.SET_REFRESH_TOKEN(info.refresh_token);
        this.SET_TOKEN_TYPE(info.token_type);
        resolve();
      });
    },
    async [GET_INFO](): Promise<UserInfo> {
      return new Promise((resolve, reject) => {
        getCurrentUser()
          .then((res: ResponseBody<UserInfo>) => {
            if (res.result) {
              this.SET_INFO(res.result);
            }
            resolve(res.result);
          })
          .catch(err => {
            // 获取登录用户信息异常，直接清理掉当前 token 并强制让流程走到登录页
            this.SET_TOKEN(null);
            reject(err);
          });
      });
    },
    async [GET_PERSON_INFO](): Promise<PersonItem> {
      return new Promise((resolve, reject) => {
        findPersonByCurrentUser()
          .then((res: ResponseBody<PersonItem>) => {
            if (res.result) {
              this.SET_PERSON_INFO(res.result);
            }
            resolve(res.result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    async [GET_ROLE_LIST]() {
      return new Promise((resolve, reject) => {
        findRoleListByCurrentUser()
          .then(res => {
            if (res.success && res.result) {
              this.SET_ROLE_LIST(res.result);
            }
            resolve(res.result);
          })
          .catch(err => {
            this.SET_ROLE_LIST(null);
            reject(err);
          });
      });
    },
    async [GET_USER_COMPANY_DEPT_INFO]() {
      return new Promise((resolve, reject) => {
        findCurrentUserOrgInfo()
          .then(res => {
            if (res.success && res.result) {
              this.SET_USER_COMPANY_DEPT_INFO(res.result);
            }
            resolve(res.result);
          })
          .catch(err => {
            this.SET_USER_COMPANY_DEPT_INFO([]);
            reject(err);
          });
      });
    },
    async [GET_ORG_LIST]() {
      return new Promise((resolve, reject) => {
        findOrgByCurrentRole()
          .then(res => {
            if (res.success && res.result) {
              this.SET_ORG_LIST(res.result);
            }
            resolve(res.result);
          })
          .catch(err => {
            this.SET_ORG_LIST(null);
            reject(err);
          });
      });
    },
    // 从路由表构建路由（前端对比后端权限字段过滤静态路由表）
    async [GENERATE_ROUTES](/* info: UserInfo */) {
      return new Promise<RouteRecordRaw[]>(resolve => {
        // 修改这里可以进行接口返回的对象结构进行改变
        // 亦或是去掉 info.role 使用别的属性替代
        // 任何方案都可以，只需要将最后拼接构建好的路由数组使用
        // router.addRoute() 添加到当前运行时的路由中即可
        // const { permissions } = (info.role || {}) as Role;
        const permissions = [];
        const allRoutes = filterMenu(routes);
        const permissionsKey = permissions?.map(permission => permission.name);
        const allowRoutes = !permissionsKey
          ? allRoutes
          : allRoutes.filter(route => {
              // parnent route filter
              const hasAllow = hasAuthority(route as MenuDataItem, permissionsKey!);
              if (hasAllow && route.children && route.children.length > 0) {
                // current route children filter
                route.children = filterChildRoute(route as MenuDataItem, permissionsKey!);
              }
              return hasAllow;
            });
        console.log('allowRoutes', allowRoutes);
        // 添加到路由表
        const {
          // eslint-disable-next-line
          children: _,
          ...mainRoute
        } = routes[0];
        const route = {
          ...mainRoute,
          children: allowRoutes,
        };
        router.addRoute(route as RouteRecordRaw);
        this.SET_ROUTERS(allowRoutes as RouteRecordRaw[]);
        resolve(allowRoutes as RouteRecordRaw[]);
      });
    },
    // 构建静态路由
    [GENERATE_ROUTES_STATIC]() {
      const allowRoutes = {
        name: 'index',
        path: '/',
        redirect: '/dashboard',
        meta: {
          title: 'CCCAR',
        },
        component: () => import('@/layouts/index.vue'),
        children: [] as MenuDataItem[],
      };
      allowRoutes.children.push(...devRoutes[0].children);
      router.addRoute(allowRoutes as any);
      this.SET_ROUTERS(allowRoutes.children as any);
    },
    // 从后端获取路由表结构体，并构建前端路由
    async [GENERATE_ROUTES_DYNAMIC]() {
      return new Promise<RouteRecordRaw>(resolve => {
        this.SET_LOADING_DYNAMIC_ROUTES(true);
        generatorDynamicRouter()
          .then((routes: RouteRecordRaw) => {
            const allowRoutes = routes.children || [];

            // 添加到路由表（原逻辑）
            // router.addRoute(routes);
            // this.SET_ROUTERS(allowRoutes);

            // 开发阶段，把固定路由先加进去（现逻辑）
            //开发菜单在前
            //devRoutes[0].children.push(...allowRoutes);
            //router.addRoute(devRoutes[0]);
            //this.SET_ROUTERS(devRoutes[0].children);
            //开发菜单在后
            //allowRoutes.push(...devRoutes[0].children);

            //先加首页再加其他
            allowRoutes.unshift(devRoutes[0].children[0] as any);
            allowRoutes.push(...(devRoutes[0].children.slice(1) as any));
            router.addRoute(routes);
            this.SET_ROUTERS(allowRoutes);

            resolve(routes);
          })
          .catch(err => {
            console.error('generatorDynamicRouter', err);
          })
          .finally(() => {
            this.SET_LOADING_DYNAMIC_ROUTES(false);
          });
      });
    },
    async [LOGOUT]() {
      return new Promise<void>(resolve => {
        logout().finally(() => {
          this.SET_TOKEN(null);
          this.SET_REFRESH_TOKEN(null);
          this.SET_TOKEN_TYPE(null);
          this.RESET_CURRENT_USER();
          resolve();
        });
      });
    },
  },
});

const hot = import.meta.webpackHot || (import.meta as any).hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
