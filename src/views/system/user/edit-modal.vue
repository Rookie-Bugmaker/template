<template>
  <yl-modal
    :title="
      $t('view.system.user.modal.user.title') +
      $t(`global.operation.${modelRef.userId ? 'edit' : 'add'}`)
    "
    :open="open"
    :width="1060"
    :confirmLoading="loading"
    :maskClosable="false"
    centered
    destroyOnClose
    @ok="handleSubmit"
    @cancel="
      () => {
        resetFields();
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-row style="height: 560px" :gutter="12">
        <a-col :span="12">
          <a-card size="small" :title="$t('view.system.user.modal.card.basicInformation.title')">
            <a-form :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
              <a-form-item
                :label="$t('view.system.user.modal.form.userName.label')"
                v-bind="validateInfos.userName"
              >
                <a-input
                  v-model:value.trim="modelRef.userName"
                  :placeholder="$t('view.system.user.modal.form.userName.placeholder')"
                />
              </a-form-item>
              <a-form-item
                :label="$t('view.system.user.modal.form.userPassword.label')"
                v-bind="validateInfos.password"
              >
                <!-- <a-input
                  v-model:value="modelRef.password"
                  placeholder="请输入密码（修改时，不输入则不修改）"
                /> -->
                <password-strong-check-input
                  v-model:value.trim="modelRef.password"
                  v-model:passwordLevel="passwordLevel"
                  :placeholder="$t('view.system.user.modal.form.userPassword.placeholder')"
                />
              </a-form-item>

              <a-form-item
                :label="$t('view.system.user.modal.form.passwordExpireDate.label')"
                v-bind="validateInfos.passwordExpireDate"
              >
                <a-date-picker
                  v-model:value="modelRef.passwordExpireDate"
                  style="width: 100%"
                  show-time
                  value-format="YYYY-MM-DD HH:mm:ss"
                ></a-date-picker>
              </a-form-item>
              <a-form-item :label="$t('view.system.user.modal.form.nextLoginUpdatePassword.label')">
                <a-switch
                  v-model:checked="modelRef.nextLoginUpdatePassword"
                  checkedValue="Y"
                  unCheckedValue="N"
                >
                  <template #checkedChildren><check-outlined /></template>
                  <template #unCheckedChildren><close-outlined /></template>
                </a-switch>
              </a-form-item>

              <a-form-item :label="$t('view.system.user.modal.form.userType.label')">
                <user-type-select
                  v-model:value="modelRef.userType"
                  style="width: 100%"
                  @change="() => (modelRef.userRelationId = null)"
                ></user-type-select>
              </a-form-item>
              <a-form-item
                :label="$t('view.system.user.modal.form.userRelationId.label')"
                v-if="
                  modelRef.userType === UserType.EMPLOYEE || modelRef.userType === UserType.SUPPLIER
                "
                v-bind="validateInfos.userRelationId"
              >
                <!-- <select-person v-model:value="modelRef.userRelationId" :mini-select-btn="true" /> -->
                <select-person
                  v-model:value="modelRef.userRelationId"
                  :mini-select-btn="true"
                  :user-type="modelRef.userType"
                />
              </a-form-item>
              <a-form-item :label="$t('view.system.user.modal.form.userStatus.label')">
                <a-radio-group v-model:value="modelRef.disableState" button-style="solid">
                  <a-radio-button value="N">{{ $t('global.status.enable') }}</a-radio-button>
                  <a-radio-button value="Y">{{ $t('global.status.disable') }}</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <!-- <a-form-item
                :label="$t('view.system.user.modal.form.orgIdList.label')"
                v-bind="validateInfos.orgIdList"
              >
                <a-select
                  v-model:value="modelRef.orgIdList"
                  mode="multiple"
                  style="width: 100%"
                  option-label-prop="label"
                  :virtual="false"
                  max-tag-count="responsive"
                >
                  <a-select-option
                    v-for="item in orgList"
                    :key="item.orgId"
                    :value="item.orgId"
                    :label="item.orgName"
                    :style="{ display: item.orgStatus == 'N' ? 'none' : '' }"
                  >
                    <span>{{ item.orgName }}</span>
                    <span style="float: right; color: rgb(180 180 180)">{{ item.orgCode }}</span>
                  </a-select-option>
                </a-select>
              </a-form-item> -->
              <a-form-item
                :label="$t('view.system.user.modal.form.userDesc.label')"
                v-bind="validateInfos.userDescription"
              >
                <a-textarea
                  v-model:value="modelRef.userDescription"
                  :placeholder="$t('view.system.user.modal.form.userDesc.placeholder')"
                  :auto-size="{ minRows: 3, maxRows: 3 }"
                />
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-flex vertical>
            <a-card
              size="small"
              :title="$t('view.system.user.modal.card.rolelist.title')"
              style="margin-bottom: 10px"
            >
              <template #extra>
                <!-- <a href="#">角色授权</a> -->
                <a-button
                  type="primary"
                  size="small"
                  @click="
                    () => {
                      roleState.open = true;
                    }
                  "
                >
                  {{ $t('view.system.user.modal.button.roleAuthorization') }}
                </a-button>
              </template>
              <role-table
                :table-data="roleState.tableData"
                @delete-role="handleDeleteRole"
                :scroll="{ y: 175 }"
              />
              <role-selector
                :open="roleState.open"
                :selected-ids="roleState.selectedIds"
                :selected-rows="roleState.tableData"
                @ok="handleSelectRole"
                @cancel="
                  () => {
                    roleState.open = false;
                  }
                "
              />
            </a-card>
            <a-card size="small" :title="$t('view.system.user.modal.card.dataAuthList.title')">
              <template #extra>
                <a-button
                  type="primary"
                  size="small"
                  @click="
                    () => {
                      dataAuthTableRef?.addRow();
                    }
                  "
                >
                  {{ $t('view.system.user.modal.button.addDataAuth') }}
                </a-button>
              </template>
              <data-auth-table
                ref="dataAuthTableRef"
                :data-auth-list="modelRef.dataAuthList"
                :hide-add="true"
                :scroll="{ y: 175 }"
              />
            </a-card>
          </a-flex>
        </a-col>
      </a-row>
    </a-spin>
  </yl-modal>
</template>

<script lang="ts">
import { Form, message } from 'ant-design-vue';
import { defineComponent, ref, reactive, toRaw, watchEffect } from 'vue';
import { cloneDeep } from 'lodash';
import type { PropType } from 'vue';
import { addUser, updateUser, findUserById, UserType } from '@/api/system/user/index';
import type { UserOperationParams, UserItem } from '@/api/system/user/index';
import type { RoleItem } from '@/api/system/role/index';
import PasswordStrongCheckInput from './components/password-strong-check-input.vue';
import RoleTable from './components/role-table.vue';
import RoleSelector from './components/role-selector.vue';
import UserTypeSelect from './components/user-type-select.vue';
import type { Rule } from 'ant-design-vue/lib/form';
import { useI18nFormLayout } from '@/utils/hooks/useI18nFormLayout';

import DataAuthTable from '@/components/system/data-auth-table/index.vue';
import SelectPerson from '@/components/select-person/system-user.vue';

import { getFixedValue } from '@/api/system/profile/index';
import dayjs from 'dayjs';
// import { findOrgByPage } from '@/api/system/org';

export default defineComponent({
  name: 'UserEditModal',
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false,
    },
    model: {
      type: Object as PropType<UserItem | null>,
      default: () => null,
    },
  },
  emits: ['ok', 'cancel'],
  setup(props, { emit }) {
    const loading = ref(false);
    const [formLayout] = useI18nFormLayout(['view.system.user.modal.form.formLayout']);
    const initRoleState = () => ({
      open: false,
      selectedIds: [] as string[],
      tableData: [] as RoleItem[],
    });
    const roleState = reactive(initRoleState());
    const passwordLevel = ref(0);
    const passwordLifespanDay = ref(null);

    const getPasswordLifespanDay = async () => {
      const res = await getFixedValue('PASSWORD_LIFESPAN_DAY');
      passwordLifespanDay.value = res.success ? parseInt(res.result) : 100;
    };

    const initValues = (): UserOperationParams => ({
      userId: null,
      userName: '',
      password: null,
      userType: UserType.EMPLOYEE,
      userDescription: '',
      userRelationId: null,
      disableState: 'N',
      roleIds: [],
      terminals: [],
      dataAuthList: [],
      orgIdList: [],
      passwordExpireDate: null,
      nextLoginUpdatePassword: 'N',
    });

    const modelRef = reactive<UserOperationParams>(initValues());

    const validatePassword = async (_rule: Rule, value: string) => {
      if (!modelRef.userId) {
        if (value === null || value === '' || value === undefined) {
          return Promise.reject('请输入密码');
        }
      } else {
        return Promise.resolve();
      }
    };
    // const validateUserRelationId = async (_rule: Rule, value: string) => {
    //   if (modelRef.userType === UserType.EMPLOYEE) {
    //     if (value === null || value === '' || value === undefined) {
    //       return Promise.reject('请选择人员');
    //     }
    //   } else {
    //     return Promise.resolve();
    //   }
    // };
    const validateUserRelationId = async (_rule: Rule, value: string) => {
      if (modelRef.userType === UserType.EMPLOYEE || modelRef.userType === UserType.SUPPLIER) {
        if (value === null || value === '' || value === undefined) {
          return Promise.reject('请选择人员');
        }
      } else {
        return Promise.resolve();
      }
    };
    const rulesRef = reactive({
      // 注意如果数据类型不相同，一定要指定数据类型 `type` 否则会校验失败
      userName: [{ required: true, message: '用户名必须填写' }],
      password: [
        {
          min: 8,
          trigger: 'change',
          message: '密码长度至少为8位',
        },
        { required: true, validator: validatePassword, trigger: 'change' },
      ],
      userRelationId: [{ validator: validateUserRelationId, trigger: 'change' }],
    });
    const { resetFields, validate, validateInfos } = Form.useForm(modelRef, rulesRef);

    const reset = async () => {
      Object.assign(roleState, initRoleState());
      Object.assign(modelRef, initValues());

      if (!passwordLifespanDay.value) {
        await getPasswordLifespanDay();
      }

      const ped = dayjs().add(passwordLifespanDay.value, 'day').format('YYYY-MM-DD HH:mm:ss');
      modelRef.passwordExpireDate = ped;
    };

    watchEffect(() => {
      if (props.model) {
        const raw = toRaw(props.model);
        loading.value = true;
        findUserById(raw.userId)
          .then(({ success, result }) => {
            if (success && result) {
              Object.assign(modelRef, result);
              roleState.selectedIds = result.roleList.map(i => i.roleId);
              roleState.tableData = result.roleList;
              modelRef.roleIds = result.roleList.map(i => i.roleId);
              modelRef.dataAuthList = result.dataAuthList || [];
              modelRef.orgIdList = result.orgIdList || [];
            } else {
              message.error('获取用户信息失败');
              emit('cancel');
            }
          })
          .finally(() => {
            loading.value = false;
          });
      } else if (props.model === null) {
        reset();
      }
    });

    const orgList = ref([]);
    // watch(
    //   () => props.open,
    //   (n, o) => {
    //     if (n === true && n != o) {
    //       findOrgByPage({ page: 1, pageSize: 0 }).then(({ success, result }) => {
    //         if (success && result) {
    //           orgList.value = result.rows;
    //         }
    //       });
    //     }
    //   },
    //   { immediate: true },
    // );

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      if (modelRef.password != null && modelRef.password.length > 0 && passwordLevel.value < 3) {
        message.warning('密码强度太低!');
        return;
      }
      if (roleState.selectedIds.length == 0) {
        message.warning('请至少选择一个角色!');
        return;
      }
      loading.value = true;
      validate()
        .then(() => {
          const data = cloneDeep(toRaw(modelRef)) as any;
          Object.assign(data, {
            roleIds: roleState.selectedIds,
          });
          delete data['roleList'];
          delete data['terminalList'];
          if (!data.userId) {
            addUser(data)
              .then(res => {
                if (res.success) {
                  message.success('新增用户成功');
                  reset();
                  emit('ok', res);
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
            updateUser(data)
              .then(res => {
                if (res.success) {
                  message.success('修改用户成功');
                  reset();
                  emit('ok', res);
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
        })
        .catch(() => {
          message.warning('校验失败！');
          loading.value = false;
        });
    };

    const handleSelectRole = (ids: string[], rows: RoleItem[]) => {
      roleState.open = false;
      roleState.selectedIds = ids;
      roleState.tableData = rows;
    };

    const handleDeleteRole = (id: string) => {
      const index = roleState.selectedIds.findIndex(i => i == id);
      if (index != -1) {
        roleState.selectedIds.splice(index, 1);
        roleState.tableData.splice(index, 1);
      }
    };

    const dataAuthTableRef = ref(null);

    return {
      UserType,
      formLayout,
      initValues,
      modelRef,
      loading,
      roleState,
      passwordLevel,
      handleSubmit,
      resetFields,
      validateInfos,
      handleSelectRole,
      handleDeleteRole,
      dataAuthTableRef,
      orgList,
    };
  },
  components: {
    PasswordStrongCheckInput,
    RoleTable,
    RoleSelector,
    DataAuthTable,
    SelectPerson,
    UserTypeSelect,
  },
});
</script>
