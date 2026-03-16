import type { App, Plugin } from 'vue';
import { defineAsyncComponent } from 'vue';

//全部图标导入
import * as Icons from '@ant-design/icons-vue';
//去除非大写开头的方法，只保留图标组件
const iconArr: string[] = Object.keys(Icons).filter(key => /[A-Z]/.test(key[0]));

import Icon from './index.vue';

Icon.install = function (app: App) {
  //全局引入所有ant-design/icons
  for (const i of iconArr) {
    const ac = defineAsyncComponent(() => {
      return new Promise(resolve => {
        resolve(Icons[i]);
      });
    });
    app.component(i, ac);
  }
  //全局引入Icon组件
  app.component(Icon.name, Icon);
};

export default Icon as typeof Icon & Plugin;
