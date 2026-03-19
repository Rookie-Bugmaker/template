import { BlockType, MainType } from '@/views/low-code/parser/typing/index';

//表单只读
export const disabledForm = config => {
  return Object.assign({}, config, { editable: { enabled: false } });
};

//表格只读
export const disabledTable = config => {
  return Object.assign({}, config, {
    editable: { enabled: false, mode: config.editable.mode },
    action: { top: { items: [] }, column: { show: false, items: [] } },
    importAndExport: { enabled: false },
    workflow: { enabled: false },
  });
};

//递归禁用子页面中的表单表格
export const disabledChildPage = configs => {
  return configs.map(m => {
    if (m.children?.length) {
      m.children = disabledChildPage(m.children);
    }
    if (m.type === BlockType.Table) {
      return disabledTable(m);
    } else if (m.type === BlockType.Form) {
      return disabledForm(m);
    }
    return m;
  });
};

//表格只可编辑(只考虑到头行表，表格为行编辑，如果表格为弹出编辑的话，此限制编辑方法不支持)
export const onlyEditTable = config => {
  return Object.assign({}, config, {
    editable: {
      enabled: true,
      mode: config.editable.mode,
      create: { enabled: false },
      edit: {
        enabled: true,
        options: {
          disabled: false,
          text: '编辑',
          type: 'link',
          danger: false,
          size: 'small',
          shape: 'default',
        },
      },
      remove: { enabled: false },
    },
    action: {
      top: { items: [] },
      column: {
        show: true,
        title: config?.action?.column?.title || '操作',
        width: 80,
        fixed: config?.action?.column?.fixed || 'right',
        items: config?.action?.column?.items?.filter(f => f.mainType === MainType.TableEdit) || [],
      },
    },
    importAndExport: { enabled: false },
    workflow: { enabled: false },
    inWorkflowProcessEditable: true, //标记流程中仍可编辑
  });
};

//子页面可编辑，但不可新增和修改
export const onlyEditChildPage = configs => {
  return configs.map(m => {
    if (m.children?.length) {
      m.children = onlyEditChildPage(m.children);
    }
    //只控制表格即可
    if (m.type === BlockType.Table) {
      return onlyEditTable(m);
    }
    return m;
  });
};
