<template>
  <yl-modal
    :title="`${modelRef.pageId ? '编辑' : '新增'}页面`"
    :open="open"
    :width="1200"
    :confirmLoading="loading"
    :destroy-on-close="true"
    centered
    @ok="handleSubmit"
    @cancel="
      () => {
        resetFields();
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-row>
        <a-col :span="6">
          <a-card title="基础信息" size="small">
            <a-form layout="horizontal" :label-col="{ style: { width: '80px' } }">
              <a-form-item label="页面代码" v-bind="validateInfos.pageCode">
                <a-input
                  v-model:value="modelRef.pageCode"
                  placeholder="请输入页面代码"
                  :disabled="modelRef.pageId ? true : false"
                />
              </a-form-item>
              <a-form-item label="页面名称" v-bind="validateInfos.pageName">
                <a-input v-model:value="modelRef.pageName" placeholder="请输入页面名称" />
              </a-form-item>
              <a-form-item label="页面图标" v-bind="validateInfos.pageIcon">
                <icon-select
                  v-model:value="modelRef.pageIcon"
                  placeholder="请选择页面图标"
                  :input-readonly="true"
                />
              </a-form-item>
              <a-form-item label="页面类型" v-bind="validateInfos.pageType">
                <a-radio-group v-model:value="modelRef.pageType" button-style="solid">
                  <a-radio-button :value="1">PC端</a-radio-button>
                  <a-radio-button :value="2">移动端</a-radio-button>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="页面描述" v-bind="validateInfos.pageDesc">
                <a-textarea v-model:value="modelRef.pageDesc" show-count :maxlength="100" />
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
        <a-col :span="18">
          <a-card title="表关系" size="small">
            <er-diagrammer
              ref="erDiagrammer"
              :default-graph="tableCells"
              :transform="transform"
              :table="tableData"
              :mode="deleteMode"
            ></er-diagrammer>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </yl-modal>
</template>

<script lang="ts">
import { Form, message } from 'ant-design-vue';
import { defineComponent, ref, reactive, toRaw, watch, inject, toRefs } from 'vue';
import { addPage, getPageById, updatePage } from '@/api/low-code/pages';
import type { FormStateParams } from '@/api/low-code/pages';
import { useI18n } from 'vue-i18n';
import IconSelect from '@/components/icon-select/index.vue';
import { groupIdInjectKey, appIdInjectKey } from '@/layouts/low-code/keys';
import ErDiagrammer from '@/views/low-code/pages/component/er-diagrammer.vue';
import { getTableById } from '@/api/low-code/data-set/table';

export default defineComponent({
  name: 'EditModal',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object,
      default: () => null,
    },
  },
  emits: ['ok', 'cancel'],
  setup(props, { emit }) {
    const groupId = inject(groupIdInjectKey);
    const applicationId = inject(appIdInjectKey);
    const { t } = useI18n();
    const erDiagrammer = ref();
    const loading = ref(false);
    const initValues = () => ({
      applicationId: applicationId,
      deleteMode: 1,
      groupId: groupId.value,
      pageId: '',
      pageCode: '',
      pageName: '',
      pageIcon: '',
      pageDesc: '',
      erGraph: '',
      pageType: 1,
      tableRelations: null,
    });
    const modelRef = reactive<FormStateParams>(initValues());

    const rulesRef = reactive({
      // 注意如果数据类型不相同，一定要指定数据类型 `type` 否则会校验失败
      pageCode: [{ required: true, message: '请输入页面代码' }],
      pageName: [{ required: true, message: '请选择页面名称' }],
      pageIcon: [{ required: true, message: '请选择页面图标' }],
    });
    const erGraph = reactive({
      deleteMode: null,
      tableCells: null,
      transform: null,
    });
    const tableData = ref({});
    watch([() => props.model?.pageId, () => props.open], async ([id, open]) => {
      Object.assign(modelRef, initValues());
      if (id && open) {
        loading.value = true;
        const { result } = await getPageById({ pageId: id });
        const raw = toRaw(result);
        Object.assign(modelRef, raw);
        const graphCells = JSON.parse(raw.erGraph);
        tableData.value = {};
        for (const item of graphCells.cells) {
          if (item.shape === 'er-rect') {
            const { result } = await getTableById(item.id);
            tableData.value[item.id] = result;
            item.ports.items = result.fieldList.map(field => ({
              id: field.fieldId,
              group: 'list',
              attrs: {
                portNameLabel: {
                  text: field.fieldCode,
                },
                portTypeLabel: {
                  text: field.fieldType,
                },
              },
            }));
          }
        }
        erGraph.transform = graphCells.transform;
        delete graphCells.transform;
        erGraph.deleteMode = modelRef.deleteMode;
        erGraph.tableCells = graphCells;
        loading.value = false;
      }
    });
    const { resetFields, validate, validateInfos } = Form.useForm(modelRef, rulesRef);
    const handleSubmit = (e: Event) => {
      e.preventDefault();
      loading.value = true;
      validate()
        .then(() => {
          delete modelRef.language;
          const data = toRaw(modelRef);
          const subData = erDiagrammer.value.getSubData();
          Object.assign(data, subData);
          if (!data.pageId) {
            addPage(data)
              .then(res => {
                if (res.success) {
                  message.success('页面新增成功');
                  resetFields();
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
            updatePage(data)
              .then(res => {
                if (res.success) {
                  message.success('页面修改成功');
                  resetFields();
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
          message.warning('校验失败');
          loading.value = false;
        });
    };

    return {
      t,
      initValues,
      modelRef,
      loading,
      erDiagrammer,
      ...toRefs(erGraph),
      handleSubmit,
      resetFields,
      tableData,
      validateInfos,
      groupId,
    };
  },
  components: {
    IconSelect,
    ErDiagrammer,
  },
});
</script>
