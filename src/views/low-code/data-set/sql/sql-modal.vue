<template>
  <yl-modal
    :open="open"
    :width="'80%'"
    :title="`${formState.viewId ? '编辑' : '新增'}SQL`"
    :bodyStyle="{ height: '500px', paddingTop: '10px' }"
    :destroy-on-close="true"
    centered
    @cancel="
      () => {
        activeKey = 'basic';
        resetFields();
        $emit('cancel');
      }
    "
  >
    <a-tabs v-model:activeKey="activeKey" @change="tabChange">
      <a-tab-pane key="basic" tab="基础信息">
        <a-form :model="formState" :label-col="labelCol" labelAlign="right" layout="inline">
          <a-row :gutter="[0, 32]">
            <a-col :xs="24" :sm="24" :md="8">
              <a-form-item label="视图名称" v-bind="validateInfos.viewName">
                <a-input
                  v-model:value.trim="formState.viewName"
                  allow-clear
                  @change="handleMenuCodeChange"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="8">
              <a-form-item label="名称" v-bind="validateInfos.name">
                <a-input v-model:value.trim="formState.name" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="8">
              <a-form-item label="所属分组" v-bind="validateInfos.groupBy">
                <a-input v-model:value="formState.groupName" disabled />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24">
              <a-form-item label="说明">
                <a-textarea v-model:value.trim="formState.viewDesc" show-count :maxlength="100" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="4">
              <a-form-item label="状态">
                <a-switch
                  v-model:checked="formState.status"
                  checkedValue="Y"
                  unCheckedValue="N"
                  checked-children="有效"
                  un-checked-children="无效"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="4">
              <a-form-item label="发布状态">
                <a-switch
                  v-model:checked="formState.releaseStatus"
                  disabled
                  checkedValue="Y"
                  unCheckedValue="N"
                  checked-children="已发布"
                  un-checked-children="待发布"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="sql" tab="SQL定义" force-render>
        <a-space style="margin-bottom: 8px">
          <a-button
            type="primary"
            @click="
              () => {
                formState.viewSql.customSql = '';
              }
            "
          >
            重置
          </a-button>
          <a-button @click="formatterSql">格式化</a-button>
          <a-tooltip placement="right">
            <template #title>
              <div>动态参数：</div>
              <div>${user.orgId} //当前用户的当前部门ID</div>
              <div>${user.userId} //当前用户的用户ID</div>
              <div>${user.roleId} //当前用户的角色ID</div>
              <div>自定义参数：</div>
              <div>${params.?} //可自定义参数</div>
            </template>
            <info-circle-outlined />
          </a-tooltip>
        </a-space>
        <codemirror
          v-model="formState.viewSql.customSql"
          placeholder="请输入SQL代码"
          :style="{ height: '370px' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="extensions"
        />
      </a-tab-pane>
      <a-tab-pane key="filed" tab="字段定义">
        <a-table
          bordered
          row-key="id"
          size="small"
          :pagination="false"
          :columns="dynamicColumns"
          :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
          :data-source="formState.fieldList"
        >
          <template #bodyCell="{ record, column }">
            <template v-if="['fieldCode'].includes(column.dataIndex)">
              <a-input disabled v-model:value="record.fieldCode" />
            </template>
            <template v-if="['fieldDesc'].includes(column.dataIndex)">
              <a-input v-model:value="record.fieldDesc" :disabled="!editableData[record.key]" />
            </template>
            <template v-if="['fieldType'].includes(column.dataIndex)">
              <a-select
                ref="select"
                disabled
                v-model:value="record.fieldType"
                :options="fieldTypeOptions"
                :field-names="{ label: 'fieldTypeDesc', value: 'fieldType' }"
                style="width: 100%"
              />
            </template>
            <template v-if="column.dataIndex === 'action'">
              <div class="editable-row-operations">
                <span v-if="editableData[record.key]">
                  <a-space>
                    <a @click="save(record.key)">保存</a>
                  </a-space>
                </span>
                <span v-else>
                  <a @click="edit(record.key)">编辑</a>
                </span>
              </div>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
    <template #footer>
      <a-button
        style="margin-left: 10px"
        @click="
          () => {
            activeKey = 'basic';
            loading = false;
            releaseLoading = false;
            resetFields();
            $emit('cancel');
          }
        "
      >
        取消
      </a-button>
      <a-button type="primary" @click="handleSubmit" :loading="loading">保存</a-button>
      <a-button @click="handleRelease" :loading="releaseLoading">发布</a-button>
    </template>
  </yl-modal>
</template>

<script lang="ts">
import { Form, message, Modal } from 'ant-design-vue';
import { defineComponent, ref, reactive, watch, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import type { UnwrapRef } from 'vue';
import type { SQLData, SQLFiledListItem } from '@/api/low-code/data-set/sql';
import { getFieldType } from '@/api/low-code/data-set/table';
import {
  addView,
  updateView,
  getViewById,
  getFieldListByCustomSql,
  releaseView,
} from '@/api/low-code/data-set/sql';
import type { TableColumn } from '@/typing';
import { cloneDeep } from 'lodash-es';
import { findByGroupId } from '@/api/low-code/group/index';
import { useTableDynamicColumns } from '@/utils/hooks/useTableColumn';
import { groupIdInjectKey, appIdInjectKey } from '@/layouts/low-code/keys';
import { format } from 'sql-formatter';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { Codemirror } from 'vue-codemirror';

export default defineComponent({
  name: 'EditModal',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    viewId: {
      type: String,
      default: '',
    },
  },
  emits: ['ok', 'cancel'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const groupId = inject(groupIdInjectKey);
    const applicationId = inject(appIdInjectKey);
    const loading = ref(false);
    const releaseLoading = ref(false);
    const activeKey = ref<string>('basic');

    const getGroupName = () => {
      formState.groupId = groupId.value;
      findByGroupId(groupId.value).then(res => {
        formState.groupName = res?.result?.groupName;
      });
    };
    const rulesRef = reactive({
      name: [{ required: true, message: '请输入名称' }],
      viewName: [{ required: true, message: '请输入视图名称' }],
      groupBy: [{ required: true, message: '请输入分组' }],
    });
    watch(groupId, () => {
      formState.groupId = groupId.value;
    });
    const formState = reactive<SQLData>({
      name: '',
      groupName: '',
      applicationId: applicationId, //应用ID
      groupId: '', //分组ID
      viewDesc: '', //描述
      viewId: '', //视图ID
      viewName: '', //视图名称
      releaseStatus: 'N', //发布状态
      status: 'Y', //状态
      viewSql: {
        customSql: '',
      }, //SQL定义对象

      sqlParamList: [], //SQL参数列表
      fieldList: [], //字段列表
    });
    const fieldTypeOptions = ref([]);
    const getType = () => {
      getFieldType(applicationId).then(res => {
        if (res) {
          fieldTypeOptions.value = [...res.result];
        }
      });
    };
    watch([() => props.viewId, () => props.open], () => {
      if (props.open) {
        getType();
        getGroupName();
      }

      if (props.viewId && props.open) {
        getViewById(props.viewId).then(res => {
          res.result?.fieldList?.forEach(i => {
            i.key = i.fieldSerialNo;
          });
          Object.assign(formState, res.result);
        });
      }
    });
    // 基础信息
    const { resetFields, validate, validateInfos } = Form.useForm(formState, rulesRef);

    // 代码编辑器逻辑
    const extensions = [sql(), oneDark];
    // 格式化SQL
    const formatterSql = () => {
      try {
        formState.viewSql.customSql = format(formState.viewSql.customSql);
      } catch (error) {
        message.error('语法错误！请检查...');
      }
    };

    // SQL定义
    const editableData: UnwrapRef<Record<string, SQLFiledListItem>> = reactive({});
    const baseColumns: TableColumn[] = [
      {
        title: '字段',
        align: 'center',
        dataIndex: 'fieldCode',
        width: 400,
      },
      {
        title: '说明',
        align: 'center',
        dataIndex: 'fieldDesc',
        width: 300,
      },
      {
        title: '类型',
        align: 'center',
        dataIndex: 'fieldType',
        width: 250,
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'action',
        width: 100,
      },
    ];
    const { state: columnState, dynamicColumns } = useTableDynamicColumns(baseColumns, {
      needRowIndex: true,
    });
    const edit = (key: string) => {
      editableData[key] = cloneDeep(formState.fieldList.filter(item => key === item.key)[0]);
    };
    const save = (key: string) => {
      Object.assign(editableData[key], formState.fieldList.filter(item => key === item.key)[0]);

      delete editableData[key];
    };

    const filedDelete = (key: string) => {
      formState.fieldList = formState.fieldList.filter(item => item.key !== key);
    };

    const tabChange = (activeKey: string) => {
      if (activeKey === 'filed' && formState.viewSql.customSql !== '') {
        getField();
      }
    };
    const getField = () => {
      getFieldListByCustomSql(formState.viewSql.customSql, applicationId).then(res => {
        if (res.success) {
          const newArr = [...res.result];
          const obj = {};
          const arr = newArr.reduce(function (item, next) {
            obj[next.fieldCode] ? '' : (obj[next.fieldCode] = true && item.push(next));
            return item;
          }, []);

          for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            item.fieldSerialNo = `${i + 1}`;
            item.key = `${i + 1}`;
          }
          formState.fieldList = arr;
        } else {
          Modal.error({
            title: '提取字段失败',
            content: res.message,
          });
        }
      });
    };
    // 保存
    const handleSubmit = (e: Event) => {
      e.preventDefault();
      loading.value = true;
      validate()
        .then(() => {
          getFieldListByCustomSql(formState.viewSql.customSql, applicationId).then(res => {
            if (res.success) {
              const newArr = [...res.result];
              const obj = {};
              const arr = newArr.reduce(function (item, next) {
                obj[next.fieldCode] ? '' : (obj[next.fieldCode] = true && item.push(next));
                return item;
              }, []);

              for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                item.fieldSerialNo = `${i + 1}`;
                item.key = `${i + 1}`;
              }
              formState.fieldList = arr;
              const newData = cloneDeep(formState);
              newData.fieldList = newData.fieldList.filter(i => i.fieldCode !== '');
              newData.fieldList.forEach(i => {
                i.fieldSerialNo = i.key;
              });
              const data = JSON.stringify(newData);
              if (!newData.viewId) {
                addView(data)
                  .then(res => {
                    if (res.success) {
                      message.success('新增视图成功');
                      activeKey.value = 'basic';
                      formState.viewId = res.result;
                    } else {
                      message.warning(res.message);
                    }
                  })
                  .catch(err => {
                    message.error(err.response.data.message);
                  })
                  .finally(() => {
                    loading.value = false;
                  });
              } else {
                updateView(data)
                  .then(res => {
                    if (res.success) {
                      message.success('修改视图成功');
                      activeKey.value = 'basic';
                    } else {
                      message.warning(res.message);
                    }
                  })
                  .catch(err => {
                    message.error(err.response.data.message);
                  })
                  .finally(() => {
                    loading.value = false;
                  });
              }
            } else {
              Modal.error({
                title: '提取字段失败',
                content: res.message,
                // maxHeight: '300px',
              });
            }
            loading.value = false;
          });
        })
        .catch(() => {
          message.warning('校验失败');
          loading.value = false;
        });
    };
    // 发布
    const handleRelease = () => {
      releaseLoading.value = true;
      releaseView(formState.viewId)
        .then(res => {
          if (res.success) {
            activeKey.value = 'basic';
            resetFields();
            emit('ok', res);
            message.success(res.message);
            releaseLoading.value = false;
          } else if (res.code == 777) {
            Modal.confirm({
              title: res.message,
              centered: true,
              onOk() {
                handleRelease();
              },
              onCancel() {
                releaseLoading.value = false;
              },
            });
          }
        })
        .catch(err => {
          releaseLoading.value = false;
          message.error(err);
        })
        .finally(() => {
          releaseLoading.value = false;
        });
    };

    const handleMenuCodeChange = () => {
      if (formState.viewName) {
        formState.viewName = formState.viewName?.toUpperCase() || '';
      }
    };
    return {
      t,
      editableData,
      edit,
      save,
      filedDelete,
      columnState,
      dynamicColumns,
      labelCol: { style: { width: '80px' } },
      formState,
      activeKey,
      loading,
      releaseLoading,
      handleSubmit,
      resetFields,
      formatterSql,
      validateInfos,
      fieldTypeOptions,
      tabChange,
      handleRelease,
      extensions,
      handleMenuCodeChange,
    };
  },
  components: {
    Codemirror,
  },
});
</script>

<style scoped>
:deep(.ant-tabs-tabpane) {
  height: 428px;
  overflow: auto;
}
</style>
