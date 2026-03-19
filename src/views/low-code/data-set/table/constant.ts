//支持的数据库类型
export enum DBEnum {
  ORACLE = 'oracle',
  DM = 'dm',
  MYSQL = 'mysql',
}

export const disabledKeys = [
  'ORG_ID',
  'CREATE_BY',
  'CREATE_DATE',
  'LAST_UPDATE_BY',
  'LAST_UPDATE_DATE',
  'LAST_UPDATE_LOGIN',
];

export const dbFieldEditAttrsMap = {
  [DBEnum.ORACLE]: {
    fieldLengthRequired: [],
    fieldLengthDisabled: ['clob', 'date'],
    fieldAccuracyRequired: [],
    fieldAccuracyDisabled: ['varchar2', 'clob', 'date'],
  },
  [DBEnum.DM]: {
    fieldLengthRequired: [],
    fieldLengthDisabled: ['text', 'timestamp'],
    fieldAccuracyRequired: [],
    fieldAccuracyDisabled: ['varchar', 'text', 'timestamp'],
  },
  [DBEnum.MYSQL]: {
    fieldLengthRequired: ['bigint', 'decimal'],
    fieldLengthDisabled: ['text', 'datetime', 'bigint'], //mysql的'bigint'长度实际固定是20，设置的长度是用于ZEROFILL使用
    fieldAccuracyRequired: ['decimal'],
    fieldAccuracyDisabled: ['bigint', 'varchar', 'text', 'datetime'],
  },
};

//不同数据库默认字段属性
const dbFieldPropsMap = {
  [DBEnum.ORACLE]: {
    CREATE_BY: { fieldType: 'number', fieldLength: null },
    CREATE_DATE: { fieldType: 'date', fieldLength: null },
    LAST_UPDATE_BY: { fieldType: 'number', fieldLength: null },
    LAST_UPDATE_DATE: { fieldType: 'date', fieldLength: null },
    LAST_UPDATE_LOGIN: { fieldType: 'number', fieldLength: null },
    ORG_ID: { fieldType: 'number', fieldLength: null },
  },
  [DBEnum.DM]: {
    CREATE_BY: { fieldType: 'number', fieldLength: null },
    CREATE_DATE: { fieldType: 'timestamp', fieldLength: null },
    LAST_UPDATE_BY: { fieldType: 'number', fieldLength: null },
    LAST_UPDATE_DATE: { fieldType: 'timestamp', fieldLength: null },
    LAST_UPDATE_LOGIN: { fieldType: 'number', fieldLength: null },
    ORG_ID: { fieldType: 'number', fieldLength: null },
  },
  [DBEnum.MYSQL]: {
    CREATE_BY: { fieldType: 'bigint', fieldLength: 20 },
    CREATE_DATE: { fieldType: 'datetime', fieldLength: null },
    LAST_UPDATE_BY: { fieldType: 'bigint', fieldLength: 20 },
    LAST_UPDATE_DATE: { fieldType: 'datetime', fieldLength: null },
    LAST_UPDATE_LOGIN: { fieldType: 'bigint', fieldLength: 20 },
    ORG_ID: { fieldType: 'bigint', fieldLength: 20 },
  },
};

const DEFAULT_FIELDS = [
  {
    fieldSerialNo: '1',
    fieldCode: 'CREATE_BY',
    fieldDesc: '创建人',
    allowNull: false,
    fieldType: 'number',
    fieldAccuracy: null,
    fieldLength: null,
    primaryKey: false,
    status: 'Y',
    dataAuth: null,
  },
  {
    fieldSerialNo: '2',
    fieldCode: 'CREATE_DATE',
    fieldDesc: '创建时间',
    allowNull: false,
    fieldType: 'date',
    fieldAccuracy: null,
    fieldLength: null,
    primaryKey: false,
    status: 'Y',
    dataAuth: null,
  },
  {
    fieldSerialNo: '3',
    fieldCode: 'LAST_UPDATE_BY',
    fieldDesc: '最后更改人',
    allowNull: true,
    fieldType: 'number',
    fieldAccuracy: null,
    fieldLength: null,
    primaryKey: false,
    status: 'Y',
    dataAuth: null,
  },
  {
    fieldSerialNo: '4',
    fieldCode: 'LAST_UPDATE_DATE',
    fieldDesc: '最后修改日期',
    allowNull: true,
    fieldType: 'date',
    fieldAccuracy: null,
    fieldLength: null,
    primaryKey: false,
    status: 'Y',
    dataAuth: null,
  },
  {
    fieldSerialNo: '5',
    fieldCode: 'LAST_UPDATE_LOGIN',
    fieldDesc: '最后修改的登陆信息ID',
    allowNull: true,
    fieldType: 'number',
    fieldAccuracy: null,
    fieldLength: null,
    primaryKey: false,
    status: 'Y',
    dataAuth: null,
  },
];

const DEFAULT_ORG_FIELDS = [
  {
    fieldSerialNo: '1',
    fieldCode: 'ORG_ID',
    fieldDesc: '部门ID',
    allowNull: false,
    fieldType: 'number',
    fieldAccuracy: null,
    fieldLength: '',
    primaryKey: false,
    status: 'Y',
    dataAuth: null,
  },
];

export const defaultFieldData = (dbType: DBEnum) => {
  const dbFieldProps = dbFieldPropsMap[dbType];
  return DEFAULT_FIELDS.map(m => {
    return Object.assign(m, dbFieldProps[m.fieldCode]);
  });
};

export const defaultOrgFieldData = (dbType: DBEnum) => {
  const dbFieldProps = dbFieldPropsMap[dbType];
  return DEFAULT_ORG_FIELDS.map(m => {
    return Object.assign(m, dbFieldProps[m.fieldCode]);
  });
};
