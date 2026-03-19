import { BlockType, MainType, WidgetType } from '../typing';

export const defaultConfig = {
  mainType: MainType.Block,
  type: BlockType.Table,
  name: '表格',
  columns: [],
  dataSource: {
    type: 'table', //'table' | 'view'
    objectId: '',
    dataObjectId: '',
    dataObjectPrimaryKey: '',
    mappingRelations: [],
    beanName: null, //前后置增强
    sort: [],
  },
  editable: {
    enabled: true,
    mode: 'popup', //'popup' | 'inline'
    popup: {
      title: '编辑页',
      width: 900,
      configTreeId: '',
      closeAfterSave: true, //保存后关闭
      params: [], //{key:'',field:''} key:参数key,field:参数字段
      defaultMaximize: false, //默认打开时最大化
    },
    create: {
      enabled: true,
      options: {
        disabled: false,
        disabledCondition: null,
        text: '新增',
        type: 'primary', // 'link' | '' | 'primary' | 'dashed'
        danger: false,
        size: 'small', //large | middle | small
        shape: 'default', //default | circle | round
      },
    },
    edit: {
      enabled: true,
      options: {
        disabled: false,
        disabledCondition: null,
        text: '编辑',
        type: 'link', // 'link' | '' | 'primary' | 'dashed'
        danger: false,
        size: 'small', //large | middle | small
        shape: 'default', //default | circle | round
      },
    },
    remove: {
      enabled: true,
      confirm: {
        enabled: true,
        title: '是否删除该条数据？',
      },
      options: {
        disabled: false,
        disabledCondition: null,
        text: '删除',
        type: 'link', // 'link' | '' | 'primary' | 'dashed'
        danger: true,
        size: 'small', //large | middle | small
        shape: 'default', //default | circle | round
      },
    },
  },
  action: {
    top: {
      position: 'left', // 'right' | 'left'
      items: [],
    },
    column: {
      show: true,
      title: '操作',
      width: 120,
      fixed: 'right', // 'right' | 'left' | null
      items: [],
    },
  },
  importAndExport: {
    enabled: false,
    onlyExport: false, //仅导出
    exportUrl: '',
    exportFileName: '', //导出文件名
    downloadTempleteUrl: '',
    downloadTempleteName: '', //下载模板文件名
    checkFileUrl: '',
    downloadResUrl: '',
    downloadResName: '', //下载验证结果文件名
    importUrl: '',
    exportType: 'lowCode', // custom:客制化导出|lowCode:低代码导出
    exportColumns: [],
    //低代码导出所需配置的列表格数据格式，格式如下：
    /* exportColumns: [
      { uid: '1', field: 'ITEM_CODE', title: '物料编码', decodeList: null },
      { uid: '2', field: 'STATUS', title: '状态', decodeList: [{ value: 'Y', text: '有效' }]] }, */
    // 实际导出接口需要的数据格式
    /* exportColumns: [
      { ITEM_CODE: { title: '物料编码' } },
      { ITEM_NAME: { title: '物料名称' } },
      { ITEM_TYPE_NAME: { title: '物料类型' } },
      { TRACE_CODE: { title: '追溯码' } },
      { VERIFICATION_CODE: { title: '防错验证码' } },
      {
        STATUS: {
          title: '状态',
          decodeList: [{ Y: '有效' }, { N: '无效' }],
        },
      },
    ], */
  },
  workflow: {
    enabled: false, //是否启用工作流功能，默认为false
    templateAlias: '',
    bizCodeField: '',
  },
  options: {
    title: '表格块',
    stripe: false,
    bordered: false,
    needRowIndex: true,
    size: 'small', // 'default' | 'middle' | 'small'
    autoFetch: true, //初始化后自动查询
    pagination: {
      enabled: true,
      pageSize: null, //默认不设置，让全局分页hooks控制分页大小
    },
    scrollY: null,
    customRowKey: null, //自定义 rowKey，默认为null，即使用默认的数据源主键作为rowKey
    rowSelection: {
      enabled: false, // 是否启用选择功能
      hideSelectAll: false, // 隐藏全选勾选框与自定义选择项
      selections: true, //选择项下拉列表
      type: 'checkbox', // 多选/单选，checkbox or radio
      //以下为默认设置，暂时不在配置中给用户选择控制
      hideDefaultSelections: false, // 去掉『全选』『反选』两个默认选项
      columnWidth: 65, //自定义列表选择框宽度
      fixed: true, //把选择框列固定在左边
    },
  },
};

export const defaultColumnConfig = {
  mainType: MainType.ColumnWidget,
  name: '表格列',
  uid: '',
  key: '',
  title: '名称',
  dataIndex: 'name',
  width: 120,
  ellipsis: true,
  cellGroupMerge: false, //列单元格分组合并
  bodyCellSlot: {
    //只会替换非编辑状态下的bodyCell
    type: 'none', // none | presets | function
    options: {
      fn: '', // ({ text, record, index, column })=> {fn}
      asHtml: false, //fn返回的结果作为html插入，默认false
      presets: {
        type: 'status-tag', // status-tag | date-format | value-set | user-info
        statusValueType: 'string', // status-tag 特有属性 string | number
        statusList: [], // status-tag 特有属性 {value,text,color?,icon?}
        dateFormat: '', // date-format 特有属性  '' (不处理) | YYYY-MM-DD HH:mm:ss (格式化日期) | ...等等
        setCode: '', // value-set 特有属性,集编码
        codeValue: false, // value-set 特有属性,是否以编码作为值
        userInfoField: '', //user-info 特有属性,使用指定字段作为描述 (userName | userDescription)，不选默认为userDescription
      },
    },
  },
};

export const defaultColumnActionItemConfig = {
  mainType: MainType.ColumnWidget,
  type: WidgetType.Button,
  uid: '',
  name: '列操作',
  options: {
    disabled: false, //是否禁用
    hidden: false, //是否隐藏
    text: '操作',
    type: 'link', // 'link' | '' | 'primary' | 'dashed'
    danger: false,
    size: 'small', //large | middle | small
    shape: 'default', //default | circle | round
    eventType: '', //绑定事件类型 '':无 | 'config':图形化配置 | 'custom':自定义
    customFn: '', //自定义事件
  },
};
