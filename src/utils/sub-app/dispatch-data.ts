export enum FnCode {
  ROUTER_PUSH = 'routerPush',
  ROUTER_REPLACE = 'routerReplace',
}

/**
 * 强制发送数据到主应用，无论数据是否变化
 * @param fnCode
 * @param args
 */
export const forceDispatchToBase = (fnCode: FnCode, ...args) => {
  window.microApp.forceDispatch({ fnCode, args }, res => {
    console.log(res);
  });
};

/**
 * 发送数据到主应用(会遍历dispatch对象中新旧值中的每个key判断值是否有变化，如果所有数据都相同则不会发送)
 * @param fnCode
 * @param args
 */
export const dispatchToBase = (fnCode: FnCode, ...args) => {
  window.microApp.dispatch({ fnCode, args }, res => {
    console.log(res);
  });
};

// 路由跳转例子：
// dispatchToBase(FnCode.ROUTER_PUSH,{
//   name: 'routeName',
//   query: {
//     id,
//   },
// })
