import useCurrentUser from '@/views/low-code/parser/hooks/useCurrentUser';

/**
 * 获取实际查询params,将配置的params转换成查询参数params
 */
export function getParams(params: any, parentParams = {}) {
  if (params?.length) {
    return params
      .map(({ key, value, type, valueType }) => {
        if (key && type && valueType) {
          return {
            key,
            type,
            value: getParamValue(valueType, value, parentParams),
          };
        } else {
          return null;
        }
      })
      .filter(f => f);
  } else {
    return [];
  }
}

export function getParamValue(valueType, value, parentParams = {}) {
  if (valueType === 'currentUser') {
    const { getByCurrentUser } = useCurrentUser();
    return getByCurrentUser(value);
  } else if (valueType === 'parentParams') {
    return parentParams?.[value];
  } else {
    return value;
  }
}
