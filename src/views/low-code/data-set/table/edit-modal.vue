<template>
  <yl-modal
    v-if="open"
    :open="open"
    :width="1350"
    :title="`${formState.tableId ? '编辑' : '新增'}表结构`"
    :bodyStyle="{ height: '500px', paddingTop: '10px' }"
    :destroy-on-close="true"
    centered
    @cancel="
      () => {
        activeKey = 'basic';
        loading = false;
        releaseLoading = false;
        resetFields();
        $emit('cancel');
      }
    "
  >
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="basic" tab="基础信息">
        <a-form
          :model="formState"
          :label-col="{ style: { width: '80px' } }"
          labelAlign="right"
          layout="inline"
        >
          <a-row :gutter="[0, 32]">
            <a-col :xs="24" :sm="24" :md="12">
              <a-form-item label="表名" v-bind="validateInfos.tableName">
                <a-input
                  v-model:value.trim="formState.tableName"
                  @change="valueToUpperCase"
                  @blur="getTableInfoByTableName"
                />
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
              <a-form-item label="启用组织" v-bind="validateInfos.enableOrg">
                <!-- :disabled="formState.releaseStatus == 'Y'" -->
                <a-switch
                  v-model:checked="formState.enableOrg"
                  checkedValue="Y"
                  unCheckedValue="N"
                  checked-children="是"
                  un-checked-children="否"
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
            <a-col :xs="24" :sm="24" :md="12">
              <a-form-item label="名称" v-bind="validateInfos.tableFullName">
                <a-input v-model:value="formState.tableFullName" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12">
              <a-form-item label="所属分组" v-bind="validateInfos.groupBy">
                <a-input v-model:value="formState.groupName" disabled />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24">
              <a-form-item label="说明">
                <a-textarea v-model:value="formState.tableDesc" show-count :maxlength="100" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="field" tab="表字段" force-render>
        <a-button
          type="primary"
          class="editable-add-btn"
          style="margin-bottom: 8px"
          @click="handleAdd"
        >
          新增行
        </a-button>
        <a-table
          bordered
          row-key="fieldSerialNo"
          size="small"
          :pagination="false"
          :columns="fieldDynamicColumns"
          :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
          :data-source="formState.fieldList"
          :scroll="{ x: 'max-content', y: 348 }"
        >
          <template #headerCell="{ column }">
            <template v-if="column.dataIndex === 'fieldCode'">
              <span class="header-cell-required">编码</span>
            </template>
            <template v-if="column.dataIndex === 'fieldType'">
              <span class="header-cell-required">类型</span>
              <a-tooltip placement="right">
                <template #title>
                  <div>当前数据源支持的数据类型：</div>
                  <div v-for="item in fieldTypeOptions" :key="item.fieldType">
                    {{ `${item.fieldTypeDesc}（${item.fieldType}）` }}
                  </div>
                </template>
                <info-circle-outlined style="margin-left: 6px" />
              </a-tooltip>
            </template>
          </template>
          <template #bodyCell="{ record, column }">
            <template v-if="column.dataIndex === 'fieldCode'">
              <a-input
                v-model:value.trim="record.fieldCode"
                :disabled="isDisabled(record.fieldCode)"
                @change="fieldCodeToUpperCase(record)"
              />
            </template>
            <template v-if="column.dataIndex === 'fieldDesc'">
              <a-input
                style="width: 200px"
                v-model:value="record.fieldDesc"
                :disabled="isDisabled(record.fieldCode)"
              />
            </template>
            <template v-if="column.dataIndex === 'fieldPrompt'">
              <a-input
                style="width: 150px"
                v-model:value="record.fieldPrompt"
                :disabled="isDisabled(record.fieldCode)"
              />
            </template>
            <template v-if="column.dataIndex === 'fieldType'">
              <a-select
                ref="select"
                v-model:value="record.fieldType"
                :options="fieldTypeOptions"
                :field-names="{ label: 'fieldTypeDesc', value: 'fieldType' }"
                style="width: 100px"
                :disabled="isDisabled(record.fieldCode)"
                @change="
                  () => {
                    if (fieldEditAttrs['fieldLengthDisabled'].some(s => s === record.fieldType)) {
                      record.fieldLength = null;
                    }
                    if (fieldEditAttrs['fieldAccuracyDisabled'].some(s => s === record.fieldType)) {
                      record.fieldAccuracy = null;
                    }
                    if (dbType == DBEnum.MYSQL && record.fieldType == 'bigint') {
                      record.fieldLength = 20;
                    }
                  }
                "
              />
            </template>
            <template v-if="column.dataIndex === 'fieldLength'">
              <a-input-number
                style="width: 70px"
                id="inputNumber"
                v-model:value="record.fieldLength"
                :min="1"
                :disabled="
                  isDisabled(record.fieldCode) ||
                  fieldEditAttrs['fieldLengthDisabled'].some(s => s === record.fieldType)
                "
              />
            </template>
            <template v-if="column.dataIndex === 'fieldAccuracy'">
              <a-input-number
                style="width: 70px"
                id="inputNumber"
                v-model:value="record.fieldAccuracy"
                :min="0"
                :disabled="
                  isDisabled(record.fieldCode) ||
                  fieldEditAttrs['fieldAccuracyDisabled'].some(s => s === record.fieldType)
                "
              />
            </template>
            <template v-if="column.dataIndex === 'allowNull'">
              <a-checkbox
                v-model:checked="record.allowNull"
                :disabled="isDisabled(record.fieldCode) || record.primaryKey === true"
              />
            </template>
            <template v-if="column.dataIndex === 'status'">
              <a-switch
                v-model:checked="record.status"
                checkedValue="Y"
                unCheckedValue="N"
                checked-children="有效"
                un-checked-children="无效"
                :disabled="isDisabled(record.fieldCode)"
              />
            </template>
            <template v-if="column.dataIndex === 'primaryKey'">
              <a-checkbox
                v-model:checked="record.primaryKey"
                :disabled="isDisabled(record.fieldCode)"
                @change="
                  v => {
                    if (v.target.checked === true) {
                      record.dataAuth = null;
                      record.allowNull = false;
                    }
                  }
                "
              />
            </template>
            <template v-if="column.dataIndex === 'dataAuth'">
              <select-profile
                v-model:value="record[column.dataIndex]"
                :disabled="isDisabled(record.fieldCode) || record.primaryKey"
              />
            </template>
            <template v-if="column.dataIndex === 'action'">
              <div class="editable-row-operations">
                <span>
                  <a-space>
                    <a-popconfirm
                      title="是否删除该表字段？"
                      placement="left"
                      @confirm="filedDelete(record.fieldSerialNo)"
                      :disabled="isDisabled(record.fieldCode)"
                    >
                      <a-button type="link" :disabled="isDisabled(record.fieldCode)">删除</a-button>
                    </a-popconfirm>
                  </a-space>
                </span>
              </div>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="index" tab="索引" class="index">
        <a-button
          type="primary"
          class="editable-add-btn"
          style="margin-bottom: 8px"
          @click="indexAdd"
        >
          新增行
        </a-button>
        <a-table
          bordered
          row-key="indexSerialNo"
          size="small"
          :pagination="false"
          :columns="indexDynamicColumns"
          :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
          :data-source="formState.indexList"
          :scroll="{ y: 348 }"
        >
          <template #bodyCell="{ record, column }">
            <template v-if="['indexType'].includes(column.dataIndex)">
              <a-select
                ref="select"
                v-model:value="record.indexType"
                :options="[
                  { label: '普通索引', value: 'Normal' },
                  { label: '唯一性索引', value: 'Unique' },
                ]"
                style="width: 100%"
              />
            </template>
            <template v-if="['indexCode'].includes(column.dataIndex)">
              <a-input v-model:value="record.indexCode" />
            </template>
            <template v-if="['indexFieldList'].includes(column.dataIndex)">
              <a-select
                v-model:value="record.indexFieldList"
                mode="multiple"
                style="width: 100%"
                :options="indexFieldOption"
                :max-tag-count="4"
              >
                <template #maxTagPlaceholder="omittedValues">
                  <span style="color: red">+ {{ omittedValues.length }} ...</span>
                </template>
              </a-select>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <div class="editable-row-operations">
                <span>
                  <a-space>
                    <a-popconfirm title="是否删除？" @confirm="indexDelete(record.indexSerialNo)">
                      <a>删除</a>
                    </a-popconfirm>
                  </a-space>
                </span>
              </div>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
    <template #footer>
      <!-- <a-form-item label="已存在表结构" style="float: left; margin: 0 15px 0 5px">
        <a-switch
          v-model:checked="formState.associatedTableFlag"
          checkedValue="Y"
          unCheckedValue="N"
          checked-children="是"
          un-checked-children="否"
        />
      </a-form-item>
      <a-popconfirm
        title="此功能为测试功能，请勿在实际生产中使用"
        ok-text="继续"
        cancel-text="取消"
        @confirm="handleReleaseNew"
      >
        <a-button type="primary" style="float: left" :loading="releaseLoading">发布(新)</a-button>
      </a-popconfirm> -->
      <a-button
        style="margin-left: 10px"
        @click="
          () => {
            activeKey = 'basic';
            resetFields();
            $emit('cancel');
          }
        "
      >
        取消
      </a-button>
      <a-button type="primary" @click="handleSubmit" :loading="loading">保存</a-button>
      <a-button @click="handleReleaseNew" :loading="releaseLoading">发布</a-button>
    </template>
  </yl-modal>
</template>

<script lang="ts" setup>
import { Form, message, Modal } from 'ant-design-vue';
import { ref, reactive, watch, computed, inject } from 'vue';
import type { UnwrapRef } from 'vue';
import type { FormState } from '@/api/low-code/data-set/table';
import {
  addTable,
  updateTable,
  getFieldType,
  getTableById,
  // releaseTable,
  releaseTableNew,
  getApplicationDbType,
  checkTableDiff,
  getDatabaseTableInfo,
} from '@/api/low-code/data-set/table';
import type { TableColumn } from '@/typing';
import { groupIdInjectKey, appIdInjectKey } from '@/layouts/low-code/keys';
import { cloneDeep } from 'lodash-es';
import { findByGroupId } from '@/api/low-code/group/index';
import { useTableDynamicColumns } from '@/utils/hooks/useTableColumn';
import SelectProfile from '@/components/system/data-auth-table/select-profile.vue';
import {
  disabledKeys,
  defaultFieldData,
  defaultOrgFieldData,
  DBEnum,
  dbFieldEditAttrsMap,
} from './constant';

const props = defineProps<{
  open: boolean;
  tableId: string;
}>();
const emit = defineEmits(['ok', 'cancel']);

const groupId = inject(groupIdInjectKey);
const applicationId = inject(appIdInjectKey);
const loading = ref(false);
const releaseLoading = ref(false);
const activeKey = ref<string>('basic');
const dbType = ref<DBEnum>(DBEnum.ORACLE);

const fieldEditAttrs = computed(() => dbFieldEditAttrsMap[dbType.value]);

const getGroupName = () => {
  findByGroupId(groupId.value).then(res => {
    formState.groupId = groupId.value;
    formState.groupName = res?.result?.groupName;
  });
};
const rulesRef = reactive({
  tableName: [{ required: true, message: '请输入表名' }],
  tableFullName: [{ required: true, message: '请输入表名称' }],
  enableOrg: [{ required: true, message: '请选择是否启用组织' }],
  groupBy: [{ required: true, message: '请输入分组' }],
});
watch(groupId, () => {
  formState.groupId = groupId.value;
});

const formState: UnwrapRef<Partial<FormState>> = reactive({});

const initFormState = (dBType: DBEnum) => {
  return {
    applicationId: applicationId,
    groupId: groupId.value,
    tableId: '',
    tableName: '',
    tableFullName: '',
    tableDesc: '',
    groupName: '',
    status: 'Y',
    enableOrg: 'N',
    releaseStatus: 'N',
    indexList: [],
    fieldList: defaultFieldData(dBType),
    associatedTableFlag: 'N',
  };
};

const getDbType = async () => {
  const res = await getApplicationDbType(applicationId);
  if (res.success) {
    dbType.value = res.result;
    Object.assign(formState, initFormState(dbType.value));
  }
};

const fieldTypeOptions = ref([]);
const getType = () => {
  getFieldType(applicationId).then(res => {
    if (res) {
      fieldTypeOptions.value = [...res.result];
    }
  });
};

const buildFormStateByConfig = config => {
  if (config) {
    config?.fieldList.sort((a, b) => {
      if (a.primaryKey == 'Y') {
        return -1;
      }
      if (b.primaryKey == 'Y') {
        return 1;
      }
      if (disabledKeys.includes(a.fieldCode)) {
        return 1;
      }
      if (disabledKeys.includes(b.fieldCode)) {
        return -1;
      }
      return a.fieldCode.localeCompare(b.fieldCode);
    });
    config?.fieldList?.forEach((item, index) => {
      item.allowNull = item.allowNull === 'Y';
      item.primaryKey = item.primaryKey === 'Y';
      item.fieldSerialNo = index + 1;
    });

    config?.indexList?.forEach(item => {
      item.indexFieldList = item.indexFieldList.map(i => i.fieldCode);
    });
    Object.assign(formState, config);
  }
};

const getTableDiff = () => {
  if (props.tableId) {
    checkTableDiff(props.tableId).then(res => {
      if (res.success && res.result) {
        Modal.confirm({
          title: '注意',
          content: '当前配置信息与数据库中的表结构不一致，是否使用数据库表结构信息替换配置信息？',
          onOk: () => {
            buildFormStateByConfig(res.result);
          },
        });
      }
    });
  }
};

watch([() => props.tableId, () => props.open], async () => {
  if (props.open) {
    getType();
    getGroupName();
    getTableDiff();
  }
  await getDbType();
  getTable();
});
const getTable = () => {
  if (props.tableId && props.open) {
    getTableById(props.tableId).then(res => {
      buildFormStateByConfig(res.result);
    });
  } else {
    formState.indexList = [];
    formState.fieldList = [...defaultFieldData(dbType.value)];
  }
};
const indexCount = computed(() =>
  formState.indexList?.length ? formState.indexList?.length + 1 : 1,
);
// 基础信息
const { resetFields, validate, validateInfos } = Form.useForm(formState, rulesRef);
watch(
  () => formState.enableOrg,
  () => {
    if (formState.enableOrg === 'Y') {
      formState.fieldList == null ? (formState.fieldList = []) : '';
      const data = [...formState.fieldList].filter(
        x =>
          ![...defaultFieldData(dbType.value), ...defaultOrgFieldData(dbType.value)].some(
            y => y.fieldCode === x.fieldCode,
          ),
      );
      data.push(...defaultOrgFieldData(dbType.value), ...defaultFieldData(dbType.value));
      data.forEach(e => {
        const target = formState.fieldList.find(f => f.fieldCode === e.fieldCode);
        if (target) {
          e.fieldId = target.fieldId;
        }
      });
      fieldResort(data);
      formState.fieldList = data;
    } else if (formState.enableOrg === 'N') {
      //未发布的可以去掉字段
      if (formState.releaseStatus == 'N') {
        formState.fieldList == null ? (formState.fieldList = []) : '';
        formState.fieldList = formState.fieldList.filter(i => i.fieldCode !== 'ORG_ID');
        fieldResort(formState.fieldList);
      } else {
        //已发布只能禁用
        const orgField = formState.fieldList.find(i => i.fieldCode === 'ORG_ID');
        if (orgField) {
          orgField.status = 'N';
          orgField.allowNull = 'true';
        }
      }
    }
  },
);
// 表名转大写
const valueToUpperCase = () => {
  formState.tableName = formState.tableName.toLocaleUpperCase();
};
// 表字段转大写
const fieldCodeToUpperCase = record => {
  formState.fieldList[+record.fieldSerialNo - 1].fieldCode =
    formState.fieldList[+record.fieldSerialNo - 1].fieldCode.toLocaleUpperCase();
};
// 表字段
const filedBaseColumns: TableColumn[] = [
  {
    title: '序号',
    align: 'center',
    dataIndex: 'fieldSerialNo',
    fixed: 'left',
    width: 50,
  },
  {
    title: '编码',
    align: 'center',
    dataIndex: 'fieldCode',
  },
  {
    title: '说明',
    align: 'center',
    dataIndex: 'fieldDesc',
    width: 130,
  },
  {
    title: '提示',
    align: 'center',
    dataIndex: 'fieldPrompt',
    width: 130,
  },
  {
    title: '类型',
    align: 'center',
    dataIndex: 'fieldType',
    width: 100,
  },
  {
    title: '长度',
    align: 'center',
    dataIndex: 'fieldLength',
    width: 90,
  },
  {
    title: '精度',
    align: 'center',
    dataIndex: 'fieldAccuracy',
    width: 90,
  },
  {
    title: '可为空',
    align: 'center',
    dataIndex: 'allowNull',
    width: 65,
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    width: 80,
  },
  {
    title: '主键',
    align: 'center',
    dataIndex: 'primaryKey',
    width: 60,
  },
  /*{
        title: '数据权限',
        align: 'center',
        dataIndex: 'dataAuth',
        width: 130,
      }, */
  {
    title: '操作',
    align: 'center',
    dataIndex: 'action',
    fixed: 'right',
    width: 60,
  },
];
const { /*state: fieldColumnState,*/ dynamicColumns: fieldDynamicColumns } = useTableDynamicColumns(
  filedBaseColumns,
  {
    needRowIndex: false,
  },
);

const filedDelete = (key: string) => {
  formState.fieldList = formState.fieldList.filter(item => item.fieldSerialNo !== key);
  fieldResort(formState.fieldList);
};
//编码字读宽度自适应
// const inputWid = computed(() => {
//   return function (value) {
//     if (!value || value.length <= 15) {
//       return '160px';
//     } else {
//       return String(value).length * 10 + 3 + 'px';
//     }
//   };
// });
// 表字段新增行
const handleAdd = () => {
  formState.fieldList == null ? (formState.fieldList = []) : '';
  const data = [...formState.fieldList].filter(
    x =>
      ![...defaultFieldData(dbType.value), ...defaultOrgFieldData(dbType.value)].some(
        y => y.fieldCode === x.fieldCode,
      ),
  );

  const defaultFieldType = fieldTypeOptions.value?.[0]?.fieldType;

  const newData = {
    fieldSerialNo: `${data.length + 1}`,
    fieldCode: '', //字段编码
    fieldDesc: '', //字段描述
    fieldPrompt: '',
    allowNull: true, //可为空
    fieldType: defaultFieldType, //字段类型
    fieldAccuracy: null, //精度
    fieldLength: null, //长度
    primaryKey: false, //是否为主键
    status: 'Y',
    dataAuth: null,
  };
  if (dbType.value == DBEnum.MYSQL && defaultFieldType == 'bigint') {
    newData.fieldLength = 20;
  }
  data.push(newData);
  if (formState.enableOrg === 'Y') {
    data.push(...defaultOrgFieldData(dbType.value));
  }
  data.push(...defaultFieldData(dbType.value));
  data.forEach(e => {
    const target = formState.fieldList.find(f => f.fieldCode === e.fieldCode);
    if (target) {
      e.fieldId = target.fieldId;
    }
  });
  fieldResort(data);
  formState.fieldList = data;
};
//表字段顺序排列
const fieldResort = data => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    item.fieldSerialNo = `${i + 1}`;
  }
};

const isDisabled = (key: string) => {
  const keyIndex = disabledKeys.indexOf(key);
  if (keyIndex == -1) {
    return false;
  } else {
    return true;
  }
};

// 索引
const indexFieldOption = computed(() =>
  formState.fieldList
    .filter(item => item.fieldCode !== '')
    .map(i => ({
      label: `${i.fieldCode} ${i.fieldDesc ? i.fieldDesc : ''}`,
      value: i.fieldCode,
    })),
);

const indexBaseColumns: TableColumn[] = [
  {
    title: '序号',
    align: 'center',
    dataIndex: 'indexSerialNo',
    width: 50,
  },
  {
    title: '类型',
    align: 'center',
    dataIndex: 'indexType',
    minWidth: 150,
  },
  {
    title: '索引名称',
    align: 'center',
    dataIndex: 'indexCode',
    width: 350,
  },
  {
    title: '索引字段',
    align: 'center',
    dataIndex: 'indexFieldList',
    width: 300,
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'action',
    width: 100,
  },
];
const { /*state: indexColumnState,*/ dynamicColumns: indexDynamicColumns } = useTableDynamicColumns(
  indexBaseColumns,
  {
    needRowIndex: false,
  },
);
const indexDelete = (key: string) => {
  formState.indexList = formState.indexList.filter(item => item.indexSerialNo !== key);
  formState.indexList.forEach((i, index) => {
    i.indexSerialNo = index + 1 + '';
  });
};
// 索引新增行
const indexAdd = () => {
  const newData = {
    indexSerialNo: `${indexCount.value}`,
    indexType: 'Normal',
    indexCode: '',
    indexFieldList: [],
  };
  formState.indexList == null ? (formState.indexList = []) : '';
  formState.indexList?.push(newData);
};

// 保存
const handleSubmit = (e: Event) => {
  e.preventDefault();

  validate()
    .then(() => {
      const res = cloneDeep(formState);
      const isNull = res.fieldList?.filter(item => {
        return item.fieldCode == '';
      });

      if (isNull.length > 0) {
        message.error('字段编码不能为空');
        return;
      }

      for (let index = 0; index < res.fieldList.length; index++) {
        const item = res.fieldList[index];
        if (
          fieldEditAttrs.value['fieldLengthRequired'].some(s => s === item.fieldType) &&
          !item.fieldLength
        ) {
          message.warning(`序号${item.fieldSerialNo}行-长度不能为空`);
          return;
        }
        if (
          fieldEditAttrs.value['fieldAccuracyRequired'].some(s => s === item.fieldType) &&
          !item.fieldAccuracy
        ) {
          message.warning(`序号${item.fieldSerialNo}行-精度不能为空`);
          return;
        }
      }

      res.indexList = res?.indexList?.filter(i => i.indexCode !== '');
      res?.fieldList?.forEach(i => {
        i.allowNull = i.allowNull ? 'Y' : 'N';
        i.primaryKey = i.primaryKey ? 'Y' : 'N';
      });
      res?.indexList?.forEach(i => {
        i.indexFieldList = i.indexFieldList.map(item => ({ fieldCode: item }));
      });
      const data = JSON.stringify(res);
      loading.value = true;
      if (!formState.tableId) {
        addTable(data)
          .then(res => {
            if (res.success) {
              message.success('新增表结构成功');
              activeKey.value = 'basic';
              formState.tableId = res.result;
              loading.value = false;
            } else {
              loading.value = false;
              message.warning(res.message);
            }
          })
          .catch(err => {
            loading.value = false;
            message.error(err.response.data.message);
          });
      } else {
        updateTable(data)
          .then(res => {
            if (res.success) {
              message.success('修改表结构成功');
              activeKey.value = 'basic';
              loading.value = false;
            } else {
              loading.value = false;
              message.warning(res.message);
            }
          })
          .catch(err => {
            loading.value = false;
            message.error(err.response.data.message);
          });
      }
    })
    .catch(err => {
      console.log(err);

      message.warning('校验失败');
      loading.value = false;
    });
};
// 发布
// const handleRelease = () => {
//   releaseLoading.value = true;
//   releaseTable(formState.tableId)
//     .then(res => {
//       if (res.success) {
//         activeKey.value = 'basic';
//         resetFields();
//         emit('ok', res);
//         message.success(res.message);
//         releaseLoading.value = false;
//       } else if (res.code == 777) {
//         Modal.confirm({
//           title: res.message,
//           centered: true,
//           onOk() {
//             handleRelease();
//           },
//           onCancel() {
//             releaseLoading.value = false;
//           },
//         });
//       }
//     })
//     .catch(err => {
//       releaseLoading.value = false;
//       message.error(err);
//     })
//     .finally(() => {
//       releaseLoading.value = false;
//     });
// };

// 发布(新)
const handleReleaseNew = () => {
  releaseLoading.value = true;
  releaseTableNew(formState.tableId, formState.associatedTableFlag)
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
            releaseTableNew(formState.tableId, formState.associatedTableFlag).then(r => {
              if (r.success) {
                message.success(r.message);
              } else {
                message.error(r.message);
              }
            });
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

//新增时根据表面直接获取数据库中的表结构信息，转为配置
const getTableInfoByTableName = () => {
  if (!formState.tableId && formState.tableName) {
    getDatabaseTableInfo(applicationId, formState.tableName).then(res => {
      if (res.success) {
        if (res.result) {
          //填充默认值
          Object.assign(res.result, {
            applicationId: applicationId,
            groupId: groupId.value,
            status: 'Y',
            enableOrg: res.result.fieldList.some(s => s.fieldCode == 'ORG_ID') ? 'Y' : 'N',
          });
          res.result.fieldList.forEach(e => {
            e.status = 'Y';
          });
          buildFormStateByConfig(res.result);
        } else {
          message.warning('数据库中没有找到对于表结构');
        }
      } else {
        message.warning(res.message);
      }
    });
  }
};
</script>
<style lang="less" scoped>
:deep(.index .ant-table-body) {
  height: 348px;
}
</style>
