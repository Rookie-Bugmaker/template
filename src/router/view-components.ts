/**
 * PLSM页面使用明确的异步导入，使Vue CLI/Vite均能在构建阶段校验并打包页面。
 * 此处仅解析平台已授权菜单的组件，不创建菜单，也不绕过角色与功能权限。
 */
const plsmComponents = {
  'plsm/serial-part/index': () =>
    import(/* webpackChunkName: "plsm-serial-part" */ '@/views/plsm/serial-part/index.vue'),
  'plsm/vehicle/index': () =>
    import(/* webpackChunkName: "plsm-vehicle" */ '@/views/plsm/vehicle/index.vue'),
};

/**
 * 平台组件规范为相对src/views、不带.vue；兼容首尾空格、./前缀和已带.vue的存量配置。
 * 未注册的PLSM组件明确报配置错误；其他模板页面保留原动态加载方式。
 */
export const resolveViewComponent = (component?: string) => {
  const path = (component || '')
    .trim()
    .replace(/^\.\//, '')
    .replace(/\.vue$/, '');
  if (Object.prototype.hasOwnProperty.call(plsmComponents, path)) {
    return plsmComponents[path as keyof typeof plsmComponents];
  }
  if (path.startsWith('plsm/')) {
    return () => Promise.reject(new Error(`PLSM菜单组件未注册：${path}，请核对平台功能组件配置`));
  }
  return () => import(/* @vite-ignore */ `../views/${path}.vue`);
};
