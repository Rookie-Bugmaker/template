export enum FieldType {
  VARCHAR = 'varchar',
  VARCHAR2 = 'varchar2',
  CLOB = 'clob',
  TEXT = 'text',
  NUMBER = 'number',
  BIGINT = 'bigint',
  DECIMAL = 'decimal',
  DATE = 'date',
  DATETIME = 'datetime',
  TIMESTAMP = 'timestamp',
}

export enum OperatorType {
  eq = 'eq', //(equal to)
  neq = 'neq', //(not equal to)
  isnull = 'isnull', //(is equal to null)
  isnotnull = 'isnotnull', //(is not equal to null)
  lt = 'lt', //(less than)
  lte = 'lte', //(less than or equal to)
  gt = 'gt', //(greater than)
  gte = 'gte', //(greater than or equal to)
  startswith = 'startswith',
  doesnotstartwith = 'doesnotstartwith',
  endswith = 'endswith',
  doesnotendwith = 'doesnotendwith',
  contains = 'contains',
  doesnotcontain = 'doesnotcontain',
  /* isempty = 'isempty',
    isnotempty = 'isnotempty', */
  in = 'in',
}

export const OPERATOR_LIST = [
  {
    value: OperatorType.eq,
    text: '等于',
    type: [
      FieldType.VARCHAR,
      FieldType.VARCHAR2,
      FieldType.CLOB,
      FieldType.TEXT,
      FieldType.NUMBER,
      FieldType.BIGINT,
      FieldType.DECIMAL,
      FieldType.DATE,
      FieldType.DATETIME,
    ],
  },
  {
    value: OperatorType.neq,
    text: '不等于',
    type: [
      FieldType.VARCHAR,
      FieldType.VARCHAR2,
      FieldType.CLOB,
      FieldType.TEXT,
      FieldType.NUMBER,
      FieldType.BIGINT,
      FieldType.DECIMAL,
      FieldType.DATE,
      FieldType.DATETIME,
    ],
  },
  {
    value: OperatorType.lt,
    text: '小于',
    type: [
      FieldType.NUMBER,
      FieldType.BIGINT,
      FieldType.DECIMAL,
      FieldType.DATE,
      FieldType.DATETIME,
    ],
  },
  {
    value: OperatorType.lte,
    text: '小于等于',
    type: [
      FieldType.NUMBER,
      FieldType.BIGINT,
      FieldType.DECIMAL,
      FieldType.DATE,
      FieldType.DATETIME,
    ],
  },
  {
    value: OperatorType.gt,
    text: '大于',
    type: [
      FieldType.NUMBER,
      FieldType.BIGINT,
      FieldType.DECIMAL,
      FieldType.DATE,
      FieldType.DATETIME,
    ],
  },
  {
    value: OperatorType.gte,
    text: '大于等于',
    type: [
      FieldType.NUMBER,
      FieldType.BIGINT,
      FieldType.DECIMAL,
      FieldType.DATE,
      FieldType.DATETIME,
    ],
  },
  {
    value: OperatorType.contains,
    text: '包含',
    type: [FieldType.VARCHAR, FieldType.VARCHAR2, FieldType.CLOB, FieldType.TEXT],
  },
  {
    value: OperatorType.doesnotcontain,
    text: '不包含',
    type: [FieldType.VARCHAR, FieldType.VARCHAR2, FieldType.CLOB, FieldType.TEXT],
  },
  {
    value: OperatorType.startswith,
    text: '以此开头',
    type: [FieldType.VARCHAR, FieldType.VARCHAR2, FieldType.CLOB, FieldType.TEXT],
  },
  {
    value: OperatorType.doesnotstartwith,
    text: '不以此开头',
    type: [FieldType.VARCHAR, FieldType.VARCHAR2, FieldType.CLOB, FieldType.TEXT],
  },
  {
    value: OperatorType.endswith,
    text: '以此结尾',
    type: [FieldType.VARCHAR, FieldType.VARCHAR2, FieldType.CLOB, FieldType.TEXT],
  },
  {
    value: OperatorType.doesnotendwith,
    text: '不以此结尾',
    type: [FieldType.VARCHAR, FieldType.VARCHAR2, FieldType.CLOB, FieldType.TEXT],
  },
  /* {
    value: OperatorType.isempty,
    text: '为空',
    type: [FieldType.VARCHAR,   FieldType.NUMBER,
      FieldType.BIGINT,
      FieldType.DECIMAL,
      FieldType.DATE,
      FieldType.DATETIME],
  },
  {
    value: OperatorType.isnotempty,
    text: '不为空',
    type: [FieldType.VARCHAR,   FieldType.NUMBER,
      FieldType.BIGINT,
      FieldType.DECIMAL,
      FieldType.DATE,
      FieldType.DATETIME],
  }, */
  {
    value: OperatorType.isnull,
    text: '为NULL',
    type: [
      FieldType.VARCHAR,
      FieldType.VARCHAR2,
      FieldType.CLOB,
      FieldType.TEXT,
      FieldType.NUMBER,
      FieldType.BIGINT,
      FieldType.DECIMAL,
      FieldType.DATE,
      FieldType.DATETIME,
    ],
  },
  {
    value: OperatorType.isnotnull,
    text: '不为NULL',
    type: [
      FieldType.VARCHAR,
      FieldType.VARCHAR2,
      FieldType.CLOB,
      FieldType.TEXT,
      FieldType.NUMBER,
      FieldType.BIGINT,
      FieldType.DECIMAL,
      FieldType.DATE,
      FieldType.DATETIME,
    ],
  },
  {
    value: OperatorType.in,
    text: '在...之中',
    type: [
      FieldType.VARCHAR,
      FieldType.VARCHAR2,
      FieldType.CLOB,
      FieldType.TEXT,
      FieldType.NUMBER,
      FieldType.BIGINT,
      FieldType.DECIMAL,
    ],
  },
];
