/* eslint-disable @typescript-eslint/consistent-type-imports */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.json';

declare module '*.svg';

declare module 'codemirror';
declare module 'vue-codemirror';

declare namespace JSX {
  interface Element extends VNode {}
  interface IntrinsicElements {
    [elem: string]: any;
  }
}
