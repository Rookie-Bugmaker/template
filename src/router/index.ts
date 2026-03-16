// import type { Component } from 'vue';
import { defineAsyncComponent, h } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import type { MenuDataItem } from './typing';
//不能使用异步方式（defineAsyncComponent）加载RouteView，会导致子页面keepAlive失效
import RouteView from '@/layouts/route-view.vue';

const Layout = defineAsyncComponent(
  () => import(/* webpackChunkName: "layout" */ '../layouts/index.vue'),
);
const LowCodeLayout = defineAsyncComponent(
  () => import(/* webpackChunkName: "low-code-layout" */ '../layouts/low-code/low-code-layout.vue'),
);
const AsyncDashboard = defineAsyncComponent(
  () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
);

const SubAppView = defineAsyncComponent(
  () => import(/* webpackChunkName: "sub-app" */ '../layouts/sub-app-view.vue'),
);

export const routes: MenuDataItem[] = [
  {
    path: '/',
    name: 'index',
    redirect: '/dashboard',
    component: Layout,
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: 'pages.dashboard.title',
          icon: 'home-outlined',
          hideChildrenInMenu: true,
          lock: true,
          keepAlive: true,
        },
        component: h(RouteView, null, () => h(AsyncDashboard)),
      },

      // exception
      {
        name: 'exception',
        path: '/exception',
        meta: { hideInMenu: true, title: 'pages.exception.title', icon: 'WarningOutlined' },
        component: RouteView,
        redirect: '/exception/403',
        children: [
          {
            name: 'exception403',
            path: '/exception/403',
            meta: { title: 'pages.exception.403.title' },
            component: () =>
              import(/* webpackChunkName: "exception" */ '@/views/exception/403.vue'),
          },
          {
            name: 'exception404',
            path: '/exception/404',
            meta: { title: 'pages.exception.404.title' },
            component: () =>
              import(/* webpackChunkName: "exception" */ '@/views/exception/404.vue'),
          },
          {
            name: 'exception500',
            path: '/exception/500',
            meta: { title: 'pages.exception.500.title' },
            component: () =>
              import(/* webpackChunkName: "exception" */ '@/views/exception/500.vue'),
          },
        ],
      },
    ],
  },
];

export const staticRoutes: MenuDataItem[] = [
  {
    path: '/sub-app',
    name: 'sub-app',
    component: SubAppView,
    children: [],
  },
  {
    path: '/low-code-application/:applicationId',
    name: 'lowCodeApplication',
    meta: { title: '低代码' },
    component: LowCodeLayout,
    children: [],
  },
  {
    path: '/user',
    name: 'user',
    meta: { hideInMenu: true, title: 'pages.layouts.userLayout.title' },
    redirect: '/user/login',
    component: () => import(/* webpackChunkName: "user-layout" */ '../layouts/user-layout-new.vue'),
    children: [
      {
        path: '/user/login',
        name: 'login',
        meta: { title: 'pages.login.accountLogin.tab' },
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/login/index.vue'),
      },
      {
        path: '/user/esc-sso',
        name: 'esc-sso',
        meta: { title: 'pages.login.accountLogin.tab' },
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/sso-login/index.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)',
    meta: { key: 'PathMismatch' }, //用于匹配找不到路径的情况，用name会导致报错
    component: () => import(/* webpackChunkName: "exception" */ '@/views/exception/404.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
  routes: staticRoutes as RouteRecordRaw[],
  scrollBehavior: (to, from) => {
    if (to.path !== from.path) {
      setTimeout(() => {
        document.getElementById('app').scrollTop = 0;
      });
    }
    return { top: 0 };
  },
});

export default router;
