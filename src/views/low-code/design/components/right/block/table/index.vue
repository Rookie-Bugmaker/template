<template>
  <base-config-form>
    <template v-slot="{ size }">
      <a-collapse-panel key="2" header="数据列">
        <d-columns :config="tableConfig" />
      </a-collapse-panel>
      <a-collapse-panel key="3" header="操作列">
        <a-form-item label="显示">
          <a-switch
            v-model:checked="tableConfig.action.column.show"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="标题">
          <a-input v-model:value="tableConfig.action.column.title" :size="size" />
        </a-form-item>
        <a-form-item label="宽度">
          <a-input-number v-model:value="tableConfig.action.column.width" :min="1" :size="size" />
        </a-form-item>
        <a-form-item label="位置">
          <a-radio-group
            v-model:value="tableConfig.action.column.fixed"
            button-style="solid"
            :size="size"
          >
            <a-radio-button value="left">固定左</a-radio-button>
            <a-radio-button value="">不固定</a-radio-button>
            <a-radio-button value="right">固定右</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <d-column-actions :config="tableConfig" />
      </a-collapse-panel>
      <a-collapse-panel key="4" header="顶部操作">
        <a-form-item label="位置">
          <a-radio-group
            v-model:value="tableConfig.action.top.position"
            button-style="solid"
            :size="size"
          >
            <a-radio-button value="left">靠左</a-radio-button>
            <a-radio-button value="right">靠右</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <d-top-actions :config="tableConfig" />
      </a-collapse-panel>
      <a-collapse-panel key="5" header="基础设置">
        <a-form-item label="行序号">
          <a-switch
            v-model:checked="tableConfig.options.needRowIndex"
            checked-children="显示"
            un-checked-children="隐藏"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="边框">
          <a-switch
            v-model:checked="tableConfig.options.bordered"
            checked-children="开"
            un-checked-children="关"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="斑马纹">
          <a-switch
            v-model:checked="tableConfig.options.stripe"
            checked-children="开"
            un-checked-children="关"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="表格大小">
          <a-radio-group v-model:value="tableConfig.options.size" button-style="solid" :size="size">
            <a-radio-button value="default">默认</a-radio-button>
            <a-radio-button value="middle">中等</a-radio-button>
            <a-radio-button value="small">紧凑</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="初始化后自动查询">
          <a-switch
            v-model:checked="tableConfig.options.autoFetch"
            checked-children="开"
            un-checked-children="关"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="纵向滚动条设置">
          <a-input v-model:value="tableConfig.options.scrollY" :size="size" style="width: 100%" />
        </a-form-item>
        <a-form-item label="自定义rowKey">
          <a-textarea
            v-model:value="tableConfig.options.customRowKey"
            :size="size"
            style="width: 100%"
            :rows="6"
            placeholder="自定义rowKey，函数调用,可获取record作为参数，请填写return key值[(record)=>record.key]；默认为空，使用数据源主键作为rowKey"
          />
        </a-form-item>
      </a-collapse-panel>
      <a-collapse-panel key="6" header="分页设置">
        <a-form-item label="分页">
          <a-switch
            v-model:checked="tableConfig.options.pagination.enabled"
            checked-children="开"
            un-checked-children="关"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="每页条数" v-show="tableConfig.options.pagination.enabled">
          <a-input-number
            v-model:value="tableConfig.options.pagination.pageSize"
            :min="0"
            :max="100"
            :size="size"
            style="width: 100%"
            placeholder="不设置则按系统默认分页大小"
          />
        </a-form-item>
      </a-collapse-panel>
      <a-collapse-panel key="7" header="选择控制" v-if="tableConfig.options.rowSelection">
        <a-form-item label="启用选择">
          <a-switch
            v-model:checked="tableConfig.options.rowSelection.enabled"
            checked-children="开"
            un-checked-children="关"
            :size="size"
          />
        </a-form-item>
        <template v-if="tableConfig.options.rowSelection.enabled">
          <a-form-item label="选择类型">
            <a-radio-group
              v-model:value="tableConfig.options.rowSelection.type"
              button-style="solid"
              :size="size"
            >
              <a-radio-button value="checkbox">多选</a-radio-button>
              <a-radio-button value="radio">单选</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <template v-if="tableConfig.options.rowSelection.type === 'checkbox'">
            <a-form-item label="隐藏全选">
              <a-switch
                v-model:checked="tableConfig.options.rowSelection.hideSelectAll"
                checked-children="是"
                un-checked-children="否"
                :size="size"
              />
            </a-form-item>
            <a-form-item
              label="选择项下拉列表"
              v-if="!tableConfig.options.rowSelection.hideSelectAll"
            >
              <a-switch
                v-model:checked="tableConfig.options.rowSelection.selections"
                checked-children="是"
                un-checked-children="否"
                :size="size"
              />
            </a-form-item>
          </template>
        </template>
      </a-collapse-panel>
      <a-collapse-panel key="8" header="编辑控制">
        <edit-control :config="config" :size="size" />
      </a-collapse-panel>
      <a-collapse-panel key="9" header="导入/导出">
        <import-and-export :config="config" :size="size" />
      </a-collapse-panel>
      <a-collapse-panel key="10" header="工作流">
        <workflow :config="config" :size="size" />
      </a-collapse-panel>
      <a-collapse-panel key="11" header="数据源">
        <a-button type="primary" block @click="state.dataSourceSettingVisible = true">
          数据源设置
        </a-button>
        <data-source-setting v-model:open="state.dataSourceSettingVisible" :config="config" />
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import DColumns from './columns.vue';
import DColumnActions from './column-actions.vue';
import DTopActions from './top-actions.vue';
import BaseConfigForm from '../../common/base-config-form.vue';
import EditControl from './edit-control.vue';
import DataSourceSetting from './data-source-setting/index.vue';
import ImportAndExport from './import-and-export/index.vue';
import Workflow from './workflow.vue';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const tableConfig = computed(() => props.config);
    const state = reactive({ dataSourceSettingVisible: false });
    return { tableConfig, state };
  },
  components: {
    DColumns,
    DColumnActions,
    DTopActions,
    BaseConfigForm,
    EditControl,
    DataSourceSetting,
    ImportAndExport,
    Workflow,
  },
});
</script>

<style lang="less" scoped></style>
