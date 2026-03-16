/* eslint-disable @typescript-eslint/consistent-type-imports */
// GlobalComponents for Volar
declare module 'vue' {
  export interface GlobalComponents {
    YlButton: typeof import('src/components/yl/button/index.ts')['default'];
    YlModal: typeof import('src/components/yl/modal/index.ts')['default'];
    //YlModal: typeof import('ant-design-vue')['Modal']; //借用antdv的组件类型，因为YlModal本身就是AModal的简单封装
    YlTable: typeof import('src/components/yl/table/index.ts')['default'];
  }
}
export {};
