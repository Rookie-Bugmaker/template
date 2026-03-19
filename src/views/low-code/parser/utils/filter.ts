import { cloneDeep } from 'lodash';
import { BlockType } from '@/views/low-code/parser/typing/index';
import { OperatorType } from '@/views/low-code/design/typing/operator';
import useCurrentUser from '@/views/low-code/parser/hooks/useCurrentUser';

/**
 * 获取实际查询filter,将配置的filter转换成查询参数filter
 */
export function getFilter(
  filter: any,
  blockRefMap: Map<string, any>,
  blockConfigMap: Map<string, any>,
  parentParams = {},
) {
  //后端要求filter不能为空，如果最后转换结果为null,需要有个空的filter替代
  return (
    convertFilter(cloneDeep(filter), blockRefMap, blockConfigMap, parentParams) || {
      logic: 'and',
      filters: [],
    }
  );
}

export function convertFilter(
  filter: any,
  blockRefMap: Map<string, any>,
  blockConfigMap: Map<string, any>,
  parentParams = {},
) {
  //有logic说明是filter group
  if (filter?.logic) {
    filter.filters = filter.filters
      ?.map(ft => {
        return convertFilter(ft, blockRefMap, blockConfigMap, parentParams);
      })
      .filter(x => x); //仅获取正常配置项(null的不获取)
    //如果filters是空数组，则丢弃整个group配置，否则返回filter
    if (filter.filters?.length) {
      return filter;
    } else {
      return null;
    }
  } else {
    //没有logic说明是单条filter

    //配置完整才构建filter
    if (filter?.field && filter?.operator) {
      //如果有配置value，通过getFilterValue转换获取实际value值
      if (filter?.value) {
        const val = getFilterValue({
          valueType: filter.valueType,
          value: filter.value,
          blockRefMap,
          blockConfigMap,
          parentParams,
        });
        const filt = {
          field: filter.field,
          operator: filter.operator,
          value: val,
        };
        return val ? filt : filter.optional ? null : filt;
      } else if ([OperatorType.isnull, OperatorType.isnotnull].includes(filter?.operator)) {
        //如果value没配置，则判断operator是不是isnull或者isnotnull，这两种情况下不用配置value
        return {
          field: filter.field,
          operator: filter.operator,
          value: null,
        };
      }
    } else {
      return null;
    }
  }
}

/**
 * 判断filter里面的值是否有空值
 * @param filter
 * @returns
 */
export function hasNullFilterValue(filter: any) {
  const filterCopy = cloneDeep(filter);
  //有logic说明是filter group
  if (filterCopy?.logic) {
    filterCopy.filters = filterCopy.filters
      ?.map(ft => {
        return hasNullFilterValue(ft);
      })
      .filter(x => x); //仅获取值为空的项
    //如果filters不为空，说明有值为空
    if (filterCopy.filters?.length) {
      return true;
    } else {
      return false;
    }
  } else {
    //没有logic说明是单条filter
    return (
      [undefined, null, ''].includes(filterCopy?.value) &&
      !filterCopy.optional &&
      ![OperatorType.isnull, OperatorType.isnotnull].includes(filterCopy?.operator)
    );
  }
}

interface BaseFilter {
  blockRefMap: Map<string, any>;
  blockConfigMap: Map<string, any>;
  parentParams?: Record<string, any>;
  modelData?: Record<string, any>;
}

interface StringFilter extends BaseFilter {
  valueType: 'string';
  value: string;
}

interface NumberFilter extends BaseFilter {
  valueType: 'number';
  value: number;
}

interface CurrentUserFilter extends BaseFilter {
  valueType: 'currentUser';
  value: 'userId' | 'roleId' | 'orgId';
}

interface BlockFilter extends BaseFilter {
  valueType: 'block';
  value: { block: string; field: string };
}

interface ParentParamsFilter extends BaseFilter {
  valueType: 'parentParams';
  value: string;
}

interface ModelDataFilter extends BaseFilter {
  valueType: 'modelData';
  value: string;
}

export function getFilterValue({
  valueType,
  value,
  blockRefMap,
  blockConfigMap,
  parentParams = {},
  modelData = {},
}:
  | StringFilter
  | NumberFilter
  | CurrentUserFilter
  | BlockFilter
  | ParentParamsFilter
  | ModelDataFilter) {
  if (valueType === 'block') {
    if (value?.block && value?.field) {
      //查询块的值通过控件id绑定，其他数据块通过数据源的字段绑定
      const key =
        blockConfigMap.get(value.block)?.type === BlockType.SearchForm
          ? `widget_${value.field}`
          : value.field;
      return blockRefMap.get(value.block)?.getModel?.()?.[key] || null;
    } else {
      return null;
    }
  } else if (valueType === 'currentUser') {
    const { getByCurrentUser } = useCurrentUser();
    return getByCurrentUser(value);
  } else if (valueType === 'parentParams') {
    return parentParams?.[value];
  } else if (valueType === 'modelData') {
    return modelData?.[value];
  } else {
    return value;
  }
}

//返回所有需要监听的响应式对象（函数）
export function getWatchDepends(
  filter: any,
  blockRefMap: Map<string, any>,
  blockConfigMap: Map<string, any>,
) {
  const depends = getDepends(filter, blockRefMap);
  return depends.map(m => () => {
    //查询块的值通过控件id绑定，其他数据块通过数据源的字段绑定
    const key =
      blockConfigMap.get(m.block)?.type === BlockType.SearchForm ? `widget_${m.field}` : m.field;
    return blockRefMap?.get(m.block)?.getModel?.()?.[key];
  });
}

//获取所有查询依赖块字字段
export function getDepends(filter: any, blockRefMap: Map<string, any>) {
  const depends = [];
  getBlockFilter(filter, depends, blockRefMap);
  return depends;
}

export function getBlockFilter(filter: any, depends: any[], blockRefMap: Map<string, any>) {
  //如果是filter层，则继续递归遍历子filters
  if (filter?.logic) {
    filter.filters?.forEach(ft => {
      getBlockFilter(ft, depends, blockRefMap);
    });
  } else if (
    filter?.field &&
    filter?.operator &&
    filter?.value &&
    filter.valueType === 'block' &&
    filter.value?.block &&
    filter.value?.field
  ) {
    depends.push(filter.value);
  }
}
