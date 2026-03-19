import { reactive, onMounted, toRaw } from 'vue';
import { useRoute } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import { generateKey } from '@/views/low-code/design/utils/key';
import { defaultRootConfig } from '@/views/low-code/design/typing/index';
import { cloneDeep } from 'lodash';
import { getPageDetail, getConfig, saveConfig, releasePage } from '@/api/low-code/design/index';
import { updatePage } from '@/api/low-code/pages';
import { generateConfig } from '@/views/low-code/design/utils/index';

export function useDesignerState() {
  const route = useRoute();

  //获取初始化页面配置
  const initConfig = () => {
    const key = generateKey();
    const treeConfig = cloneDeep(defaultRootConfig);
    treeConfig.uid = key;
    return {
      config: {
        locales: [],
        mainConfigTreeId: key,
        configTrees: [treeConfig],
        relations: [], //数据源关系
        conditions: [], //条件列表
      },
      currentConfig: null,
      currentConfigTreeId: '',
      currentBlockMap: null,
    };
  };

  //初始化页面信息及配置
  const initState = () => {
    return {
      loading: false,
      applicationInfo: {
        applicationId: '',
        applicationName: '',
        applicationIcon: '',
      },
      groupInfo: {
        groupId: '',
        groupName: '',
      },
      pageInfo: {
        pageId: route.params.pageId as string,
        pageName: '',
        pageIcon: '',
        templateId: '',
      },
      ...initConfig(),
    };
  };

  const state = reactive(initState());

  const getPageInfoById = (pageId: string) => {
    if (pageId) {
      getPageDetail(pageId).then(({ success, result }) => {
        if (success && result) {
          Object.assign(state.pageInfo, result);
          Object.assign(state.applicationInfo, result.application);
          Object.assign(state.groupInfo, result.group);
          setDocumentTitle(result.pageName);
        }
      });
    }
  };

  const getDesignerConfig = (pageId: string) => {
    state.loading = true;
    getConfig(pageId)
      .then(({ success, result }) => {
        if (success) {
          if (result) {
            state.config = JSON.parse(result.configJson);
          }
          const configTreeItem = state.config?.configTrees?.[0];
          if (configTreeItem) {
            state.currentConfigTreeId = configTreeItem.uid;
          }
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
      onOk: () => {
        window.location.reload();
      },
    });
  };

  const setDocumentTitle = (title: string) => {
    document.title = title;
  };

  onMounted(() => {
    getPageInfoById(state.pageInfo?.pageId);
    getDesignerConfig(state.pageInfo?.pageId);
  });

  const saveDesignerConfig = async () => {
    state.loading = true;
    await generateConfig(state);
    await updatePageInfo();
    saveConfig({
      pageId: state.pageInfo.pageId,
      configJson: JSON.stringify(state.config),
      generateJson: JSON.stringify(''),
    })
      .then(({ success }) => {
        if (success) {
          message.success('保存成功');
        } else {
          message.error('保存失败');
        }
      })
      .catch(err => {
        console.log(err);
        message.error('保存失败');
      })
      .finally(() => {
        state.loading = false;
      });
  };

  const releaseDesignerConfig = () => {
    state.loading = true;
    releasePage(state.pageInfo.pageId)
      .then(({ success }) => {
        if (success) {
          message.success('发布成功');
        } else {
          message.error('发布失败');
        }
      })
      .catch(err => {
        console.log(err);
        message.error('发布失败');
      })
      .finally(() => {
        state.loading = false;
      });
  };

  const updatePageInfo = async () => {
    const data = toRaw(cloneDeep(state.pageInfo));
    delete data['language'];
    const res = await updatePage(data as any);
    if (res.success) {
      return true;
    } else {
      console.error(res.message);
      return false;
    }
  };

  //使用页面模板构建页面
  const useTemplate = (pageId: string) => {
    //记录使用的模板页面ID
    state.pageInfo.templateId = pageId;
    //初始化配置
    Object.assign(state, initConfig());
    //加载对应页面模板配置
    getDesignerConfig(pageId);
  };

  return {
    state,
    saveDesignerConfig,
    releaseDesignerConfig,
    useTemplate,
  };
}
