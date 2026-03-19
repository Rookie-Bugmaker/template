<template>
  <div style="background-color: #f0f2f5">
    <a-row style="background-color: #fff">
      <a-col :span="6" style="padding: 0 10px">
        <a-tabs size="small">
          <a-tab-pane key="11" tab="表结构定义">
            <div style="height: calc(100vh - 250px); overflow: auto">
              <a-list size="small" :data-source="tableStructure">
                <template #renderItem="{ item }">
                  <a-list-item
                    style="cursor: move; user-select: none"
                    @mousedown="draggerDom($event, item.tableId)"
                  >
                    {{ item.tableFullName }}
                  </a-list-item>
                </template>
              </a-list>
            </div>
          </a-tab-pane>
          <a-tab-pane key="22" tab="自定义SQL">
            <div style="height: calc(100vh - 250px); overflow: auto">
              <a-list size="small" :data-source="SQLList">
                <template #renderItem="{ item }">
                  <a-list-item style="cursor: default; user-select: none">
                    {{ item.viewName }}
                  </a-list-item>
                </template>
              </a-list>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :span="18">
        <a-button size="small" @click="currentStep > 0 && currentStep--">撤销</a-button>
        <a-button
          size="small"
          style="margin-left: 10px"
          @click="currentStep < 9 && operationStep.length > currentStep + 1 && currentStep++"
        >
          前进
        </a-button>
        <div style="width: 100%; height: calc(100vh - 270px); margin-top: 10px">
          <div id="container"></div>
        </div>
        <a-form-item label="删除模式" style="margin: 10px 0 0">
          <a-select
            v-model:value="deleteMode"
            size="small"
            :options="deleteModeOptions"
            placeholder="请选择删除模式"
          ></a-select>
        </a-form-item>
      </a-col>
    </a-row>
  </div>
  <a-drawer
    :width="500"
    title="表详情"
    placement="right"
    :open="drawerTable"
    @close="drawerTable = false"
  >
    <a-table
      v-if="tableData[clickTable]"
      :columns="columns"
      bordered
      :pagination="false"
      :row-key="record => record.fieldId"
      :data-source="tableData[clickTable].fieldList"
    >
      <template #title>
        <div>{{ tableData[clickTable].tableFullName }}</div>
      </template>
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'primaryKey'">
          <key-outlined v-if="text == 'Y'" />
          <div v-else></div>
        </template>
      </template>
    </a-table>
    <a-button
      danger
      type="primary"
      style="margin-top: 20px"
      @click="
        () => {
          drawerTable = false;
          graph.removeNode(clickTable);
          delete tableData[clickTable];
          operationStep[++currentStep] = {
            tableData: { ...tableData },
            graph: graph.toJSON(),
          };
        }
      "
    >
      删除表
    </a-button>
  </a-drawer>
  <a-drawer
    :width="500"
    title="连接关系"
    placement="right"
    :open="drawerVisible"
    @close="drawerVisible = false"
  >
    <a-form :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
      <a-form-item label="主表" v-bind="validateInfos.mainTableId">
        <a-select
          v-model:value="modelRef.mainTableId"
          :options="formTableData"
          :field-names="{ label: 'label', value: 'id' }"
          @change="changeTable($event as string, 'mainTableColumnList')"
          placeholder="请选择主表"
        ></a-select>
      </a-form-item>
      <a-form-item label="从表" v-bind="validateInfos.subTableId">
        <a-select
          v-model:value="modelRef.subTableId"
          :options="formTableData"
          :field-names="{ label: 'label', value: 'id' }"
          @change="changeTable($event as string, 'subTableColumnList')"
          placeholder="请选择主表"
        ></a-select>
      </a-form-item>
      <a-form-item label="主表字段" v-bind="validateInfos.mainTableColumnId">
        <a-select
          v-model:value="modelRef.mainTableColumnId"
          :options="mainTableColumnList"
          placeholder="请选择主表字段"
        ></a-select>
      </a-form-item>
      <a-form-item label="从表字段" v-bind="validateInfos.subTableColumnId">
        <a-select
          v-model:value="modelRef.subTableColumnId"
          :options="subTableColumnList"
          placeholder="请选择从表字段"
        ></a-select>
      </a-form-item>
    </a-form>
    <a-space>
      <a-button type="primary" @click="updateGraph">确定</a-button>
      <a-button
        danger
        type="primary"
        @click="
          () => {
            drawerVisible = false;
            graph.removeEdge(modelRef.cellId);
            Object.assign(modelRef, initValuesModelRef());
            addStep();
          }
        "
      >
        删除连接
      </a-button>
    </a-space>
  </a-drawer>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, reactive, toRefs, onUnmounted, inject, watch } from 'vue';
import type { PropType } from 'vue';
import { Graph, Shape } from '@antv/x6';
import { Form, message } from 'ant-design-vue';
import type { TableResult } from '@/api/low-code/data-set/table';
import type { SQLResult } from '@/api/low-code/data-set/sql';
import { findByPage, getTableById } from '@/api/low-code/data-set/table';
import { findByPage as viewFindByPage } from '@/api/low-code/data-set/sql';
import { appIdInjectKey, groupIdInjectKey } from '@/layouts/low-code/keys';
import { KeyOutlined } from '@ant-design/icons-vue';
import { Dnd } from '@antv/x6-plugin-dnd';

export default defineComponent({
  props: {
    defaultGraph: {
      type: Object as PropType<{ cells: any[] }>,
      default: () => null,
    },
    mode: {
      type: Number,
      default: () => 1,
    },
    table: {
      type: Object,
      default: () => ({}),
    },
    transform: {
      type: Object,
      default: () => null,
    },
  },
  setup(props) {
    const groupId = inject(groupIdInjectKey);
    const appId = inject(appIdInjectKey);

    // 连线弹窗表格数据
    const formTableData = ref();
    // 记录操作步骤数组
    const operationStep: { [key: string]: any }[] = [{ graph: {}, tableData: {} }];
    // 记录当前步骤
    const currentStep = ref<number>(0);
    // 添加操作-获取数据，更新画布，绑定按钮事件监听
    const changeStep = val => {
      addEventListener('keydown', keyDownStep);
      const current = operationStep[val];
      graph.value.fromJSON(current.graph);
      tableData.value = { ...current.tableData };
    };
    // 添加步骤
    const addStep = () => {
      const step = {
        tableData: { ...tableData.value },
        graph: graph.value.toJSON(),
      };
      // 最多保存10步，超过自定顶掉最前面的操作
      if (operationStep.length == 10) {
        operationStep.shift();
        operationStep[9] = step;
        changeStep(9);
      } else {
        operationStep[++currentStep.value] = step;
      }
    };
    // 监听当前步骤
    watch(currentStep, changeStep);
    // 按键回调，撤销前进回调
    const keyDownStep = e => {
      if (e.key == 'z' && e.ctrlKey) {
        currentStep.value > 0 && currentStep.value--;
      } else if (e.key == 'y' && e.ctrlKey) {
        currentStep.value < 9 &&
          operationStep.length > currentStep.value + 1 &&
          currentStep.value++;
      }
    };
    // const mousewheel = (e) => {
    //   const event = window.event || e;
    //   event.preventDefault();
    //   const down = event.wheelDelta ? event.wheelDelta < 0 : event.detail > 0;
    //   if (event.ctrlKey) {
    //     graph.value.zoom(down ? -0.1 : 0.1, {
    //       // 'center': {
    //       //   x:
    //       // }
    //     });
    //   }
    // };
    // 点击画布绑定按钮事件监听
    const clickListener = e => {
      if ((e.target as SVGAElement).classList.toString() == 'x6-graph-svg') {
        addEventListener('keydown', keyDownStep);
        // addEventListener('mousewheel', mousewheel, { passive: false });
      } else {
        removeEventListener('keydown', keyDownStep);
      }
    };
    addEventListener('click', clickListener);
    onUnmounted(() => {
      // 关闭弹窗销毁事件监听
      removeEventListener('click', clickListener);
      removeEventListener('keydown', keyDownStep);
    });
    // 数据表 列配置
    const columns = [
      {
        title: '字段',
        dataIndex: 'fieldCode',
      },
      {
        title: '类型',
        dataIndex: 'fieldType',
      },
      {
        title: '长度',
        dataIndex: 'fieldLength',
      },
      {
        title: '主键',
        dataIndex: 'primaryKey',
      },
      {
        title: '说明',
        dataIndex: 'fieldDesc',
      },
    ];
    // 删除模式选项
    const deleteModeOptions = [
      {
        label: '无关联',
        value: 1,
      },
      {
        label: '删除头直接删除行',
        value: 2,
      },
      {
        label: '删除头时提示有行数据，要先删除行',
        value: 3,
      },
    ];
    const formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    // 初始连线数据
    const initValuesModelRef = () => ({
      cellId: null,
      mainTableId: null,
      mainTableColumnId: null,
      subTableId: null,
      subTableColumnId: null,
    });
    // 删除模式
    const deleteMode = ref(1);
    // 当前连线数据
    const modelRef = reactive<{
      cellId: string;
      mainTableId: string;
      mainTableColumnId: string;
      subTableId: string;
      subTableColumnId: string;
    }>(initValuesModelRef());
    // 备份当前连线数据,用于对比操作记录步骤
    const copyModel = reactive<{
      cellId: string;
      mainTableId: string;
      mainTableColumnId: string;
      subTableId: string;
      subTableColumnId: string;
    }>(initValuesModelRef());
    // 连线数据校验规则
    const rulesRef = reactive({
      mainTableId: [{ required: true, message: '请选择主表' }],
      subTableId: [{ required: true, message: '请选择从表' }],
      mainTableColumnId: [{ required: true, message: '请选择主表字段' }],
      subTableColumnId: [{ required: true, message: '请选择从表字段' }],
    });
    const { resetFields, validate, validateInfos } = Form.useForm(modelRef, rulesRef);
    // 展示连线弹窗
    const drawerVisible = ref<boolean>(false);
    // 展示数据表弹窗
    const drawerTable = ref<boolean>(false);

    // x6画布
    const graph = ref<Graph>();
    const dnd = ref<Dnd>();
    // 记录点击的数据表id
    const clickTable = ref<string>();
    // 数据表字段下拉框数据
    const optionsState = reactive({
      mainTableColumnList: [],
      subTableColumnList: [],
    });
    // 画布数据表行宽高
    const LINE_HEIGHT = 24;
    const NODE_WIDTH = 250;
    onMounted(() => {
      // 自定义连接点布局
      Graph.registerPortLayout(
        'erPortPosition', // 自定义连接点布局名称
        portsPositionArgs => {
          return portsPositionArgs.map((_, index) => {
            return {
              position: {
                x: 0,
                y: (index + 1) * LINE_HEIGHT,
              },
              angle: 0,
            };
          });
        },
        true,
      );

      // 自定义注册节点
      Graph.registerNode(
        'er-rect',
        {
          inherit: 'rect',
          markup: [
            {
              tagName: 'rect',
              selector: 'body', // 对应attrs里面的样式
            },
            {
              tagName: 'text',
              selector: 'label',
            },
          ],
          attrs: {
            body: {
              strokeWidth: 1, // 节点边框粗细
              stroke: '#5F95FF', // 节点边框颜色
              fill: '#5F95FF', // 节点填充颜色
            },
            label: {
              fontWeight: 'bold', // 字体粗细-加粗
              fill: '#ffffff', // 文字填充颜色
              fontSize: 12, // 字体大小
            },
          },
          // 连接点
          ports: {
            //分组
            groups: {
              // 自定义list
              list: {
                markup: [
                  {
                    tagName: 'rect',
                    selector: 'portBody',
                  },
                  {
                    tagName: 'text',
                    selector: 'portNameLabel',
                  },
                  {
                    tagName: 'text',
                    selector: 'portTypeLabel',
                  },
                ],
                attrs: {
                  portBody: {
                    width: NODE_WIDTH, // 连接点框框宽度
                    height: LINE_HEIGHT, // 连接点框框高度
                    strokeWidth: 1, // 连接点边框粗细
                    stroke: '#5F95FF', // 连接点边框颜色
                    fill: '#EFF4FF', // 连接点框框填充颜色
                    magnet: true, // 是否可以创建连线
                  },
                  portNameLabel: {
                    ref: 'portBody', // 指定当前文本参照
                    refX: 6, // x方向偏移量
                    refY: 6, // 乙方向偏移量
                    fontSize: 10, // 文字大小
                  },
                  portTypeLabel: {
                    ref: 'portBody',
                    refX: NODE_WIDTH - 50,
                    refY: 6,
                    fontSize: 10,
                  },
                },
                position: 'erPortPosition', // 使用自定义连接点布局
              },
            },
          },
        },
        true,
      );
      graph.value = new Graph({
        container: document.getElementById('container')!,
        background: {
          color: '#eee',
        },
        mousewheel: true,
        autoResize: true,
        panning: true,
        grid: true,
        connecting: {
          allowNode: false,
          allowBlank: false,
          router: {
            name: 'er',
            args: {
              offset: 25, // 连接线，箭头距离
              direction: 'H', // ？？
            },
          },
          // 创建连接线
          createEdge() {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: '#0094ff', // 连接线颜色
                  strokeWidth: 2, // 连接线粗细
                },
              },
            });
          },
          validateConnection({ targetMagnet, targetCell, targetPort, sourceCell, sourcePort }) {
            if (!targetMagnet) return false;
            // 不能连接自身
            if (sourceCell === targetCell && targetPort === sourcePort) {
              return false;
            }
            // 不能重复连线
            const edges = this.getEdges();
            if (
              edges.find(edge => {
                const judgePort =
                  edge.getTargetPortId() == targetPort && sourcePort == edge.getSourcePortId();
                const judgeCell =
                  edge.getTargetCell() == targetCell && sourceCell == edge.getSourceCell();
                return judgeCell && judgePort;
              })
            ) {
              return false;
            }
            return true;
          },
        },
        highlighting: {
          magnetAvailable: {
            name: 'stroke',
            args: {
              attrs: {
                stroke: '#A4DEB1',
                strokeWidth: 4,
              },
            },
          },
        },
      });
      dnd.value = new Dnd({
        target: graph.value,
        getDragNode: node => node.clone({ keepId: true }),
        getDropNode: node => {
          tableData.value[node.id].show = true;
          return node.clone({ keepId: true });
        },
      });
      // 连线点击事件
      graph.value.on('edge:click', ({ cell }) => {
        optionsState.mainTableColumnList = cell
          .getSourceNode()
          .getPorts()
          .map(item => ({
            value: item.id,
            label: item.attrs.portNameLabel.text,
          }));
        optionsState.subTableColumnList = cell
          .getTargetNode()
          .getPorts()
          .map(item => ({
            value: item.id,
            label: item.attrs.portNameLabel.text,
          }));
        modelRef.mainTableId = (cell.source as any).cell;
        modelRef.subTableId = (cell.target as any).cell;
        modelRef.mainTableColumnId = (cell.source as any).port;
        modelRef.subTableColumnId = (cell.target as any).port;
        modelRef.cellId = cell.id;
        Object.assign(copyModel, modelRef);
        formTableData.value = graph.value.getNodes();
        drawerVisible.value = true;
      });
      // 画布数据表点击事件
      graph.value.on('node:click', ({ node }) => {
        clickTable.value = node.id;
        drawerTable.value = true;
      });
      // 连线连接成功事件
      graph.value.on('edge:connected', ({ isNew }) => {
        if (isNew) addStep();
      });
      // 画布数据表移动事件
      graph.value.on('node:moved', addStep);
      graph.value.clearCells();
      getTableStructure();
      getSQLList();
    });
    // 编辑时候监听默认事件
    watch(
      () => props.defaultGraph,
      erGraph => {
        if (erGraph && graph.value) {
          deleteMode.value = props.mode;
          tableData.value = props.table;
          for (const key in tableData.value) {
            tableData.value[key].show = true;
          }
          operationStep[0] = {
            graph: props.defaultGraph,
            tableData: { ...tableData.value },
          };
          graph.value.fromJSON(props.defaultGraph);
          if (props.transform) {
            const {
              translate: { tx, ty },
              zoom,
            } = props.transform;
            graph.value.zoomTo(zoom);
            graph.value.translate(tx, ty);
          }
        }
      },
    );
    // 更新连接
    const updateGraph = () => {
      validate()
        .then(() => {
          const sourceNode = graph.value.getNodes().find(item => item.id === modelRef.mainTableId);
          const targetNode = graph.value.getNodes().find(item => item.id === modelRef.subTableId);
          const edge = graph.value.getEdges().find(item => item.id === modelRef.cellId);
          edge.setSource({
            cell: sourceNode.id,
            port: modelRef.mainTableColumnId,
          });
          edge.setTarget({
            cell: targetNode.id,
            port: modelRef.subTableColumnId,
          });
          for (const key in modelRef) {
            if (modelRef[key] != copyModel[key]) {
              addStep();
              break;
            }
          }
          drawerVisible.value = false;
        })
        .catch(() => message.warn('验证失败'));
    };
    const leftState = reactive<{
      tableStructure: TableResult[];
      SQLList: SQLResult[];
    }>({
      tableStructure: [],
      SQLList: [],
    });
    // 提取数据
    const getSubData = () => {
      const obj = {};
      const edges = graph.value.getEdges();
      edges.forEach(item => {
        const mainTableId = (item.source as any).cell;
        const subTableId = (item.target as any).cell;
        const mainTableColumnId = (item.source as any).port;
        const subTableColumnId = (item.target as any).port;
        const key = mainTableId + subTableId;
        const columnItem = {
          mainTableColumnId,
          subTableColumnId,
        };
        if (obj[key]) {
          obj[key].columnRelations.push(columnItem);
        } else {
          obj[key] = {
            mainTableId,
            subTableId,
            columnRelations: [columnItem],
          };
        }
      });

      const subData = {
        deleteMode: deleteMode.value,
        erGraph: JSON.stringify({
          ...graph.value.toJSON(),
          transform: {
            translate: graph.value.translate(),
            zoom: graph.value.zoom(),
          },
        }),
        tableRelations: Object.values(obj),
      };
      return subData;
    };
    // 获取表结构列表数据
    const getTableStructure = async () => {
      const params = {
        page: 1,
        pageSize: 0,
        applicationId: appId,
        groupId: groupId.value,
      };
      const { result } = await findByPage(params);
      leftState.tableStructure = result.rows;
    };
    // 切换数据表
    const changeTable = (id: string, table: string) => {
      optionsState[table] = graph.value
        .getNodes()
        .find(item => item.id === id)
        .getPorts()
        .map(item => ({
          value: item.id,
          label: item.attrs.portNameLabel.text,
        }));
      const key = table.replace('List', 'Id');
      modelRef[key] = null;
    };
    // 获取自定义sql事件
    const getSQLList = async () => {
      const params = {
        page: 1,
        pageSize: 0,
        applicationId: appId,
        groupId: groupId.value,
      };
      const { result } = await viewFindByPage(params);
      leftState.SQLList = result.rows;
    };
    const tableData = ref({});
    // 拖拽表结构到画布事件
    const draggerDom = async (e, tableId) => {
      const { result } = await getTableById(tableId);
      if (tableData.value[tableId]?.show) return message.warning('图中已存在该表');
      tableData.value[tableId] = result;
      const node = graph.value.createNode({
        id: result.tableId,
        shape: 'er-rect',
        label: result.tableFullName,
        width: NODE_WIDTH,
        height: LINE_HEIGHT,
        // 字段
        ports: result.fieldList.map(field => ({
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
        })),
      });
      dnd.value.start(node, e);
    };
    return {
      addStep,
      draggerDom,
      updateGraph,
      changeTable,
      initValuesModelRef,
      drawerVisible,
      formTableData,
      modelRef,
      graph,
      drawerTable,
      deleteMode,
      deleteModeOptions,
      ...toRefs(optionsState),
      formLayout,
      operationStep,
      currentStep,
      columns,
      validateInfos,
      tableData,
      clickTable,
      resetFields,
      getSubData,
      ...toRefs(leftState),
    };
  },
  components: { KeyOutlined },
});
</script>
<style lang="less" scoped>
:deep(.ant-modal-body) {
  padding: 10px 20px;
}
:deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
