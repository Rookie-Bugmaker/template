<template>
  <yl-modal
    :title="`API ${t(`global.operation.${modelRef.apiId ? 'edit' : 'add'}`)}`"
    :open="props.open"
    :width="1200"
    :confirmLoading="loading"
    centered
    @ok="handleSubmit"
    @cancel="
      () => {
        resetFields();
        emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              :label="t('view.system.low-code-api.modal.form.code.label')"
              v-bind="validateInfos.lowCodeApiCode"
            >
              <a-input
                v-model:value="modelRef.lowCodeApiCode"
                allow-clear
                placeholder="接口标识"
                :disabled="!!modelRef.apiId"
              ></a-input>
            </a-form-item>
            <a-form-item :label="'接口类型'" v-bind="validateInfos.type">
              <a-select
                v-model:value="modelRef.type"
                allow-clear
                :dropdown-match-select-width="false"
                style="width: 100%"
                placeholder="接口类型"
                @change="handleTypeChange"
              >
                <a-select-option value="query">列表查询</a-select-option>
                <a-select-option value="queryByPagination">分页查询</a-select-option>
                <a-select-option value="insert">新增</a-select-option>
                <a-select-option value="update">修改</a-select-option>
                <a-select-option value="delete">删除</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="'接口地址'">{{ apiUri }}</a-form-item>
            <params-list-config
              v-model:config="modelRef"
              :isSelect="!isQueryType"
              :field-list="state.fieldList"
            />
            <!-- 响应展示 -->
            <response-display v-model="modelRef" :isReset="props.open"></response-display>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="t('view.system.low-code-api.modal.form.type.label')">
              <a-radio-group
                v-model:value="modelRef.config.type"
                button-style="solid"
                @change="handleDataSourceChange"
              >
                <a-radio-button value="table">表结构</a-radio-button>
                <a-radio-button :disabled="!isQueryType" value="view">自定义SQL</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="数据源" v-bind="validateInfos.objectId">
              <data-source-popup-edit
                v-model:value="modelRef.config.objectId"
                :data-source-type="modelRef.config.type"
              ></data-source-popup-edit>
            </a-form-item>
            <a-form-item label="页面ID" v-bind="validateInfos.pageId">
              <a-input v-model:value="modelRef.config.pageId"></a-input>
            </a-form-item>
            <a-form-item
              v-if="modelRef.type === 'queryByPagination'"
              label="页码"
              v-bind="validateInfos.page"
            >
              <a-input v-model:value="modelRef.config.page"></a-input>
            </a-form-item>
            <a-form-item
              v-if="modelRef.type === 'queryByPagination'"
              label="分页大小"
              v-bind="validateInfos.pageSize"
            >
              <a-input v-model:value="modelRef.config.pageSize"></a-input>
            </a-form-item>
            <a-collapse v-model:activeKey="activeKey">
              <a-collapse-panel v-if="isQueryType" key="1" header="参数绑定配置">
                <params-config v-model:config="modelRef" :field-list="state.fieldList" />
              </a-collapse-panel>
              <a-collapse-panel v-if="isQueryType" key="2" header="过滤配置">
                <filter-config v-model:config="modelRef" :field-list="state.fieldList" />
              </a-collapse-panel>
              <a-collapse-panel v-if="isQueryType" key="3" header="排序配置">
                <sort-config v-model:config="modelRef" :field-list="state.fieldList" />
              </a-collapse-panel>
              <a-collapse-panel key="4" header="字段列表">
                <!-- 字段列表 -->
                <field-list v-model="modelRef"></field-list>
              </a-collapse-panel>
            </a-collapse>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </yl-modal>
</template>

<script lang="ts" setup name="edit-modal">
import { Form, message, Modal } from 'ant-design-vue';
import { ref, reactive, toRaw, computed, watch, watchEffect } from 'vue';
import { addApi, updateApi } from '@/api/low-code/low-code-api/index';
import { getTableById } from '@/api/low-code/data-set/table';
import { getViewById } from '@/api/low-code/data-set/sql';
import type { ApiOperationParams } from '@/api/low-code/low-code-api/index';
import { useI18n } from 'vue-i18n';
import ParamsListConfig from './config/params-list-config.vue';
import ParamsConfig from './config/params-config.vue';
import FilterConfig from './config/filter-config/index.vue';
import SortConfig from './config/sort-config.vue';
import DataSourcePopupEdit from '../components/data-source-popup-edit.vue';
import { LogicType } from '@/api/workflow/template/typing';
import ResponseDisplay from './response-display/index.vue';
import FieldList from './field-list/index.vue';

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
  },
};

type Props = {
  open: boolean;
  model: any;
};

const props = withDefaults(defineProps<Props>(), {
  model: null,
});
// emits
const emit = defineEmits(['ok', 'cancel']);

const { t } = useI18n();
const loading = ref(false);

const activeKey = ref(['1', '2', '3']);

const apiUri = ref(null);

const initValues = (): ApiOperationParams => ({
  apiId: null,
  lowCodeApiCode: '',
  type: 'query',
  parameterList: [],
  apiType: 0,
  config: {
    objectId: '',
    type: 'table',
    params: [],
    filter: {
      logic: LogicType.AND,
      filters: [],
    },
    sort: [],
  },
  fieldUri: '',
  fieldList: [],
  responseMap: null,
});
const modelRef = reactive<ApiOperationParams>(initValues());

watch([() => props.model, () => props.open], ([model, open]) => {
  if (model) {
    const raw = toRaw(model);
    Object.assign(modelRef, raw);
  } else {
    Object.assign(modelRef, initValues());
  }
  if (!open) {
    resetFields();
  }
});

const rulesRef = reactive({
  lowCodeApiCode: [
    {
      required: true,
      message: () => t('view.system.low-code-api.modal.form.rule.lowCodeApiCode.message'),
    },
  ],
});

const state = reactive({
  fieldList: [],
});

/* 是否查询类接口 */
const isQueryType = computed(() => {
  return !['insert', 'update', 'delete'].includes(modelRef.type);
});

/* 接口类型改变 */
const apiTypeUriMap = {
  queryByPagination: '/lowcode/facade/listByPage',
  query: '/lowcode/facade/list',
  insert: '/lowcode/facade/insert',
  update: '/lowcode/facade/update',
  delete: '/lowcode/facade/delete',
};

watchEffect(() => {
  apiUri.value = apiTypeUriMap?.[modelRef?.type] || null;
});

const handleTypeChange = () => {
  if (modelRef.type === 'queryByPagination') {
    modelRef.config.page = 1;
    modelRef.config.pageSize = 10;
    addPage();
  } else if (modelRef.type === 'query') {
    modelRef.config.page = null;
    modelRef.config.pageSize = null;
  } else if (['insert', 'update', 'delete'].includes(modelRef.type)) {
    modelRef.config.page = null;
    modelRef.config.pageSize = null;
    modelRef.config.type = 'table';
  }
};

/* 数据源类型改变 */
const handleDataSourceChange = () => {
  // 清空数据源ID
  modelRef.config.objectId = null;
};

const addPage = () => {
  const page = modelRef.parameterList.find(item => item.parameter === 'page');
  const pageSize = modelRef.parameterList.find(item => item.parameter === 'pageSize');
  !page &&
    modelRef.parameterList.unshift({
      parameter: 'page',
      required: true,
      description: '页码',
    });
  !pageSize &&
    modelRef.parameterList.unshift({
      parameter: 'pageSize',
      required: true,
      description: '分页大小',
    });
};

/* 获取字段列表 */
const getFieldList = async (type: string, objectId: string) => {
  if (type === 'table') {
    const { success, result } = await getTableById(objectId);
    if (success && result) {
      return result.fieldList;
    }
  }
  if (type === 'view') {
    const { success, result } = await getViewById(objectId);
    if (success && result) {
      return result.fieldList;
    }
  }
  return [];
};

watch(
  () => modelRef.config?.objectId,
  async (n, o) => {
    if (n && n !== o) {
      const fieldList = await getFieldList(modelRef.config.type, n);
      state.fieldList = fieldList;
    }
  },
  { immediate: true },
);

const { resetFields, validate, validateInfos } = Form.useForm(modelRef, rulesRef);

const handleSubmit = (e: Event) => {
  e.preventDefault();
  if (hasDuplicates(modelRef.parameterList, 'parameter')) {
    return Modal.error({
      title: '错误',
      content: '参数列表字段重复',
    });
  }
  validate()
    .then(() => {
      const data = toRaw(modelRef);
      delete data['language'];
      loading.value = true;
      if (!data.apiId) {
        addApi(data)
          .then(res => {
            if (res.success) {
              message.success(t('view.system.low-code-api.modal.success.addAPI.message'));
              resetFields();
              emit('ok', res);
            } else {
              Modal.error({
                title: '错误',
                content: res.message,
              });
            }
          })
          .catch(err => {
            Modal.error({
              title: '错误',
              content: err.response.data.message,
            });
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        updateApi(data)
          .then(res => {
            if (res.success) {
              message.success(t('view.system.low-code-api.modal.success.editAPI.message'));
              // resetFields();
              // emit('ok', res);
            } else {
              Modal.error({
                title: '错误',
                content: res.message,
              });
            }
          })
          .catch(err => {
            Modal.error({
              title: '错误',
              content: err.response.data.message,
            });
          })
          .finally(() => {
            loading.value = false;
          });
      }
    })
    .catch(() => {
      message.warning(t('view.system.low-code-api.modal.warning.fail.editAPI.message'));
      loading.value = false;
    });
};

const hasDuplicates = (list, prop) => {
  const values = list.map(item => item[prop]);
  return new Set(values).size !== values.length;
};
</script>
