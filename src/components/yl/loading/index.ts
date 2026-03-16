import { createApp, h, unref } from 'vue';

import Loading from './index.vue';

export type ParamsType = {
  label?: string;
  showPercentage?: boolean;
};

/**命令式全局loading */
export default {
  show: (
    props: ParamsType = {},
    teleport?: any,
    callback?: { onShow?: () => void; onDestroy?: () => void },
    /**兼容模式 样式无法居中开启 */
    compatMode: boolean = false,
  ) => {
    const container = document.createElement('div');
    const rootContainer = unref(teleport) || document.body;

    const lodaingApp = createApp(() =>
      h(
        'div',
        {
          class:
            'pos-absolute inset-0 flex items-center justify-center' +
            (compatMode ? '' : ' backdrop-blur-sm'),
          style: 'z-index:9999',
        },
        h(Loading, {
          ...props,
          ...(compatMode
            ? {
                style: {
                  transform: 'unset',
                  width: '100%',
                  height: '100%',
                  backdropFilter: 'blur(10px)',
                },
              }
            : {}),
        }),
      ),
    );

    const initial = async () => {
      lodaingApp.mount(container);
      rootContainer.appendChild(container);
      typeof callback?.onShow === 'function' && callback.onShow();
    };
    initial();

    function close() {
      lodaingApp.unmount();
      rootContainer.removeChild(container);
      typeof callback?.onDestroy === 'function' && callback.onDestroy();
    }

    return close;
  },
};
