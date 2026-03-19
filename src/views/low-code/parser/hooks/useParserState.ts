import { reactive, provide, onMounted, inject } from 'vue';
import { Modal } from 'ant-design-vue';
import { parserStateInjectKey } from '../keys';
import { getConfig } from '@/api/low-code/design/index';

export function injectParserState() {
  return inject(parserStateInjectKey);
}

export function useParserState(pageId?: string) {
  const initState = () => {
    return {
      loading: false,
      pageId: pageId ? pageId : getPageId(),
      locales: [],
      conditions: [],
      mainConfigTreeId: '',
      configTrees: [],
      relations: [],
      data: {},
      block: {},
      blockConfig: {},
      pageLoading: null, //页面加载
    };
  };

  const state = reactive(initState());

  provide(parserStateInjectKey, state);

  const getConfigJson = () => {
    state.loading = true;
    getConfig(state.pageId)
      .then(({ success, result }) => {
        if (success && result) {
          Object.assign(state, JSON.parse(result.configJson));
        } else {
          openErrorModal();
        }
      })
      .catch(err => {
        console.log(err);
        openErrorModal();
      })
      .finally(() => {
        state.loading = false;
      });
  };

  const openErrorModal = () => {
    Modal.error({
      title: '获取配置信息失败',
      content: '查询页面信息失败！请刷新页面重试。',
      okText: '刷新页面',
      closable: true,
      onOk: () => {
        window.location.reload();
      },
    });
  };

  onMounted(() => {
    getConfigJson();
  });

  return {
    state,
  };
}

function getPageId() {
  //如果是配置页面功能重复挂载到不同菜单上的话，会在路径后面加上唯一key(/_puk_xxxxxx),取参时需要特殊处理
  if (window.location.pathname?.includes('_puk_')) {
    const path = window.location.pathname;
    return path?.split('/')?.[2];
  } else {
    //其他情况则正常处理
    const path = window.location.href;
    return path.substring(path.lastIndexOf('/') + 1);
  }
}
