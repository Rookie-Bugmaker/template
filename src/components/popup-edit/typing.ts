import type { MaybeRef, TableColumn } from '@/typing';
import type { Ref } from 'vue';
import type { ResponseBody, PageResult } from '@/api/typing';
import type { Context } from '@/utils/hooks/useFetchData';

export type Value = string | number | (string | number)[];

type RequestParams = MaybeRef<{
  [key: string]: any;
}>;

export interface FormField {
  field: string; //查询字段
  label: string | (() => string); //查询字段的标签
  defaultValue?: string | number; //查询字段的默认值
  slot?: string; //插槽名称(需要加上插槽前缀search-form-),插槽参数为queryParams查询参数对象
  // TODO : 动态控件类型，规则校验，需要再做
}

export interface Options<T = any> {
  valueField: string; //弹出框的值字段
  textField: string; //弹出框的描述字段
  searchTextField?: string; // 单选模式下，输入框输入搜索时的查询字段，默认使用textField，如果接口非标准接口的话，可以使用searchTextField设置查询字段
  searchFormFields: FormField[]; //构建查询表单的设置列表
  tableColumns: TableColumn[]; //分页查询结果的表格的列设置，跟antdv的table columns一个类型
  getDataById: (params?: string | number | RequestParams) => Promise<ResponseBody<T | T[]>>; //根据唯一值查询数据函数，构建初始输入框时需要根据唯一值查询，描述值(多选时，需要传多个id,返回list)
  getDataByPage: (params?: RequestParams) => Promise<ResponseBody<PageResult<T>>>; //分页查询函数，结果用于用户选择
  modalTitle?: string | (() => string); //模态框标题
  modalWidth?: number; //模态框宽度
  rowKeyFn?: (row: T) => string; // 表格自定义主键函数
  onValidateParams?: (params: RequestParams, next: () => void) => void; // 参数校验
  scrollY?: number; //表格滚动高度
}

export interface SearchFormState {
  queryParams: RequestParams;
  resetFields: () => void;
  validateInfos: Record<string, any>;
}

export interface TableState {
  tableState: Context<ResponseBody<PageResult<any>>>;
  reloadTable: () => void;
  handleTableChange: ({ current, pageSize }) => void;
}

export interface PopupEditBaseContext {
  loading: boolean;
  modalVisible: boolean;
  initRenderModal: boolean; //默认初始化组件时不渲染modal
  selectedKeys: (string | number)[];
  selectedRows: any[];
  tempSelectedKeys: (string | number)[]; //用于多选时临时存储选择项
  tempSelectedRows: any[]; //用于多选时临时存储选择项
}

export interface PopupEditSingleContext extends PopupEditBaseContext {
  multiple: false;
}

export interface PopupEditMultiContext extends PopupEditBaseContext {
  multiple: true;
}

export interface PopupEditState {
  state: PopupEditSingleContext | PopupEditMultiContext;
  confirmSelect: () => void;
  clearValue: () => void;
  handleDeselect: (value: string | number) => void;
  queryById: (value: string | number | (string | number)[]) => void;
  initValueInfo: (value: string | number | (string | number)[]) => void;
  textInputValue: Ref<string>;
  handleUpdateTextInputValue: (textValue: string) => void;
}

export interface PopupEditAction<T extends PopupEditSingleContext | PopupEditMultiContext>
  extends PopupEditState,
    SearchFormState,
    TableState {
  state: T;
  options: Options;
}

//弹出框事件
export interface EmitEvent {
  updateValue: (value) => void;
  change: (value, record) => void;
  select: (value, record) => void;
  bring: (value, record) => void;
  clear: () => void;
}

/**
 * 支持所有antdv table 插槽，但插槽名字需要加上前缀 table-
 */
