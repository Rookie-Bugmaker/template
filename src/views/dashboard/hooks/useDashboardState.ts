import { reactive, inject, provide, nextTick, type InjectionKey } from 'vue';
import { message, Modal } from 'ant-design-vue';
import {
  getCurrentUserComponents,
  getUserConfig,
  saveUserConfig,
  type PageComponentItem,
} from '@/api/system/home/index';
import { to } from 'await-to-js';
import { intersectionWith, differenceWith } from 'lodash-es';

export interface LayoutItem {
  x: number; //x坐标
  y: number; //y坐标
  w: number; //宽度
  h: number; //高度
  i: string; //ID
}

export interface DashboardState {
  loading: boolean;
  isSetup: boolean; //是否设置中的标识
  modalVisible: boolean;
  pageComponents: PageComponentItem[];
  layout: LayoutItem[];
}
export interface UseDashboardStateAction {
  state: DashboardState;
  saveConfig: () => void;
}

export const dashboardStateInjectKey: InjectionKey<DashboardState> = Symbol();

export const injectDashboardState = (): DashboardState => {
  return inject(dashboardStateInjectKey);
};

export default function useDashboardState() {
  const state: DashboardState = reactive({
    loading: false,
    isSetup: false,
    modalVisible: false,
    pageComponents: [],
    layout: [
      /* { x: 0, y: 0, w: 2, h: 3, i: '108000567370772480' },
      { x: 2, y: 0, w: 2, h: 4, i: '1' },
      { x: 4, y: 0, w: 2, h: 5, i: '2' },
      { x: 6, y: 0, w: 2, h: 3, i: '3' },
      { x: 8, y: 0, w: 2, h: 3, i: '4' },
      { x: 10, y: 0, w: 2, h: 3, i: '5' },
      { x: 0, y: 5, w: 2, h: 5, i: '6' },
      { x: 2, y: 5, w: 2, h: 5, i: '7' },
      { x: 4, y: 5, w: 2, h: 5, i: '8' },
      { x: 6, y: 3, w: 2, h: 4, i: '9' },
      { x: 8, y: 4, w: 2, h: 4, i: '10' },
      { x: 10, y: 4, w: 2, h: 4, i: '11' },
      { x: 0, y: 10, w: 2, h: 5, i: '12' },
      { x: 2, y: 10, w: 2, h: 5, i: '13' },
      { x: 4, y: 8, w: 2, h: 4, i: '14' },
      { x: 6, y: 8, w: 2, h: 4, i: '15' },
      { x: 8, y: 10, w: 2, h: 5, i: '16' },
      { x: 10, y: 4, w: 2, h: 2, i: '17' },
      { x: 0, y: 9, w: 2, h: 3, i: '18' },
      { x: 2, y: 6, w: 2, h: 2, i: '19' }, */
    ],
  });

  provide(dashboardStateInjectKey, state);

  const getData = async () => {
    state.loading = true;
    //按权限获取当前用户拥有的页面组件
    const [error, resp] = await to(getCurrentUserComponents());
    if (error) {
      Modal.error({
        title: '获取当前用户主页信息失败',
        content: error.message,
      });
      state.loading = false;
      return;
    } else {
      if (resp.success) {
        state.pageComponents = resp.result?.filter(f => f.status == 'Y');
      } else {
        Modal.error({
          title: '获取当前用户主页信息失败',
          content: resp.message,
        });
      }
    }

    //获取当前用户的主页配置
    const [err, res] = await to(getUserConfig());
    if (err) {
      Modal.error({
        title: '获取当前用户主页配置失败',
        content: err.message,
      });
    } else {
      if (res.success) {
        let isUnsetUser = false;
        let userLayoutConfig: LayoutItem[] = [];
        //用户配置
        if (res.result && res.result.userConfig) {
          userLayoutConfig = JSON.parse(res.result.userConfig);
        } else {
          userLayoutConfig = [];
          isUnsetUser = true;
        }

        //以用户设置为主和当前用户有权限的主页组件列表,求交集，仅留下有权限的组件
        const filteredUserLayoutConfig = intersectionWith(
          userLayoutConfig,
          state.pageComponents,
          (a, b: PageComponentItem) => {
            return a.i === b.componentId;
          },
        );

        //用户有设置则以用户设置的为主，改变主页组件设置仅能去掉用户配置中没有的权限或已删除/已禁用组件，新增的组件不会自动加入
        //如果用户没有设置过自定义配置，则显示的组件按主页组件设置的来
        if (!isUnsetUser) {
          state.layout = filteredUserLayoutConfig;
        } else {
          //以权限为主与当前用户有权限的自定义配置列表，求差集，仅留下有权限且未加入到layout中的组件,且组件显示状态为默认显示
          const newComponents = differenceWith(
            state.pageComponents,
            filteredUserLayoutConfig,
            (a, b) => {
              return a.componentId === b.i;
            },
          ).filter(f => f.showStatus === 'Y');

          //获取过滤后的配置的基准值，作为后续新加入组件的x坐标基准
          const baseLocation = filteredUserLayoutConfig.length;

          //将页面组件转换成主页布局配置
          const newLayoutConfig = newComponents.map((m, index) => {
            return {
              x: (baseLocation + index * 4) % 12,
              y: 0,
              w: 4,
              h: 8,
              i: m.componentId,
            };
          });

          //设置主页布局配置
          state.layout = filteredUserLayoutConfig.concat(newLayoutConfig);
        }
      } else {
        Modal.error({
          title: '获取当前用户主页配置失败',
          content: res.message,
        });
      }
    }
    state.loading = false;
  };

  getData();

  //根据用户勾选改变配置
  const changeConfig = (componentIds: string[]) => {
    //去掉已去除的
    state.layout = state.layout.filter(f => componentIds.includes(f.i));
    //添加新增的
    const newComponentIds = componentIds.filter(f => !state.layout.find(x => x.i === f));

    const baseLocation = state.layout.length;
    const newLayout = newComponentIds.map((m, index) => {
      return {
        x: (baseLocation + index * 4) % 12,
        y: 0,
        w: 4,
        h: 5,
        i: m,
      };
    });

    //组件问题，必须要清空之后才能更新
    const result = state.layout.concat(newLayout);
    state.layout = [];
    nextTick(() => {
      state.layout = result;
    });
  };

  const saveConfig = () => {
    state.loading = true;
    saveUserConfig(JSON.stringify(state.layout))
      .then(res => {
        if (res.success) {
          message.success('保存主页配置成功');
        } else {
          Modal.error({
            title: '保存主页配置失败',
            content: res.message,
          });
        }
      })
      .finally(() => {
        state.loading = false;
      });
  };

  return {
    state,
    saveConfig,
    changeConfig,
  };
}
