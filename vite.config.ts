import type { ConfigEnv, UserConfig } from 'vite';
import { loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path, { resolve } from 'path';
import legacy from '@vitejs/plugin-legacy';
import UnoCss from 'unocss/vite';
const mock = require('./build/mock/createMockServer');

export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const port = Number(env.VITE_APP_PORT);
  return {
    base: env.VITE_APP_PUBLIC_PATH,
    // 兼容 Cli
    define: {
      'process.env.VUE_APP_API_BASE_URL': JSON.stringify(env.VITE_APP_API_BASE_URL),
      'process.env.VUE_APP_API_URL': JSON.stringify(env.VITE_APP_API_URL),
      'process.env.VUE_APP_PUBLIC_PATH': JSON.stringify(env.VITE_APP_PUBLIC_PATH),
      'process.env.VUE_APP_WS_BASE_URL': JSON.stringify(env.VITE_APP_WS_BASE_URL),
      'process.env.VUE_APP_PORT': JSON.stringify(env.VITE_APP_PORT),
      'process.env.VUE_APP_FILE_VIEW_URL': JSON.stringify(env.VITE_APP_FILE_VIEW_URL),
      'process.env.VUE_APP_PROJECT_CODE': JSON.stringify(env.VITE_APP_PROJECT_CODE),
      'process.env.VUE_APP_PLSM_SERVICE_PREFIX': JSON.stringify(env.VITE_APP_PLSM_SERVICE_PREFIX),
    },
    plugins: [
      legacy({
        targets: ['defaults', 'not IE 11', 'Chrome 63', 'Firefox > 20'],
        modernPolyfills: true,
      }),
      vue(),
      vueJsx(),
      UnoCss(),
      mock({
        watch: true,
        mockUrlList: [/api/],
        cwd: process.cwd(),
        enable:
          env.VITE_HTTP_MOCK === 'true' &&
          process.env.NODE_ENV !== 'production' &&
          process.env.NODE_ENV !== 'test',
      }),
    ],
    build: {
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2048,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          subpage: resolve(__dirname, 'pages/index.html'),
        },
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
          // manualChunks: {
          //   vue: ['vue', 'pinia', 'vue-router'],
          //   antdv: ['ant-design-vue', '@ant-design/icons-vue'],
          // },
        },
      },
    },
    resolve: {
      alias: {
        '~@': path.join(__dirname, './src'),
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
        vue: 'vue/dist/vue.esm-bundler.js',
        dayjs: resolve(__dirname, 'node_modules', 'dayjs'),
        'ant-design-vue': resolve(__dirname, 'node_modules', 'ant-design-vue'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    },
    optimizeDeps: {
      include: [
        'ant-design-vue/es/locale/en_US',
        'ant-design-vue/es/locale/zh_CN',
        'store/plugins/expire',
        'ant-design-vue/es/form',
        'dayjs',
        'dayjs/locale/en',
        'dayjs/locale/zh-cn',
        '@ant-design/icons-vue',
        'lodash-es',
        'pinia',
        'vue-router',
        'vue',
        'vue-i18n',
        '@vueuse/core',
      ],
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: 'true; @import "~/styles/variables.less";',
          },
          // DO NOT REMOVE THIS LINE
          javascriptEnabled: true,
        },
      },
    },
    server: {
      host: true,
      port: port,
      headers: {
        // 允许跨域
        'Access-Control-Allow-Origin': '*',
      },
      proxy:
        env.VITE_HTTP_MOCK === 'true'
          ? undefined
          : {
              // '/api/wms': {
              //   // backend url
              //   target: 'http://10.141.29.13:11522',
              //   ws: false,
              //   changeOrigin: true,
              //   rewrite: path => path.replace(/^\/api\/wms/, ''),
              // },
              '/api': {
                // backend url
                target: env.VITE_APP_API_URL,
                ws: false,
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
              },
              '/srm': {
                target: 'http://localhost:3001/srm/',
                ws: false,
                changeOrigin: true,
                rewrite: path => path.replace(/^\/srm/, ''),
              },
              '/wmrz': {
                target: 'http://localhost:3001/wmrz',
                ws: false,
                changeOrigin: true,
                rewrite: path => path.replace(/^\/wmrz/, ''),
              },
            },
    },
  };
};
