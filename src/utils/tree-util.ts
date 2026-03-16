import { cloneDeep } from 'lodash';

type ArrayToTreeOptions = {
  key?: string;
  parentKey?: string;
  rootValue?: any; //根节点值
  childrenKey?: string;
  emptyChildren?: 'null' | 'array'; //遇到空子节点，是返回null还是空数组
  isLeafKey?: string; //叶子节点标识
};

/**
 * 数组转树形
 * @param array 需要转换的数组
 * @param options 额外配置
 * @returns
 */
export const arrayToTree = <T = any>(array: T[], options?: ArrayToTreeOptions) => {
  const copyArray = cloneDeep(array);
  const {
    key = 'id',
    parentKey = 'parentId',
    childrenKey = 'children',
    rootValue = null,
    emptyChildren = 'null',
    isLeafKey = 'isLeaf',
  } = options || {};

  return copyArray.filter(f => {
    f[isLeafKey] = false;
    const childArray = copyArray.filter(x => {
      return f[key] === x[parentKey];
    });
    if (childArray?.length) {
      f[childrenKey] = childArray;
    } else {
      f[childrenKey] = emptyChildren === 'null' ? null : [];
      f[isLeafKey] = true;
    }
    return f[parentKey] === rootValue;
  });
};

/**
 * 根据父级ID找出树形结构中的父级数据
 * @param parentId  父级ID
 * @param data 树形数据
 * @param primaryKey  主键的属性名
 * @param childrenKey 树形下级数据children的属性名
 * @returns data中的元素 | null
 */
export const findParentRow = <T = any, D = any>(
  parentId: T,
  data: D[],
  primaryKey = 'id',
  childrenKey = 'children',
): D | null => {
  if (!parentId) {
    return null;
  }
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item[primaryKey] == parentId) {
      return cloneDeep(item);
    }
    if (item?.[childrenKey]?.length) {
      const result = findParentRow(parentId, item[childrenKey], primaryKey, childrenKey);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

/**
 * 根据目标ID找出元素在树形结构中的路径 【目标元素，目标元素父元素，目标元素父元素的父元素,...】
 * @param targetId 目标ID
 * @param data 树形数据
 * @param primaryKey 主键的属性名
 * @param childrenKey 树形下级数据children的属性名
 * @returns data中的元素数组 | null
 */
export const findTreeItemPath = <T = any, D = any>(
  targetId: T,
  data: D[],
  primaryKey = 'id',
  childrenKey = 'children',
): D[] | null => {
  const returnResult: D[] = [];
  if (!targetId) {
    return null;
  }
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item[primaryKey] == targetId) {
      returnResult.push(item);
      return returnResult;
    } else if (item?.[childrenKey]?.length) {
      const result = findTreeItemPath(targetId, item[childrenKey], primaryKey, childrenKey);
      if (result?.length) {
        returnResult.push(...result, item);
        return returnResult;
      }
    }
  }
  return null;
};

/**
 * 根具限制层级提取出指定层级的数据
 * @param treeData 数据
 * @param limitLevel 限制层级 -1 不限制 默认 -1
 * @returns
 */
export const extractTopThreeLevels = (treeData, limitLevel = -1, level = 1) => {
  if (!Array.isArray(treeData) || treeData.length === 0) {
    return [];
  }
  if (limitLevel == -1) return treeData;

  const result = treeData.map(node => ({
    ...node,
    children:
      node.children && node.children.length > 0 && level < limitLevel
        ? extractTopThreeLevels(node.children, limitLevel, level + 1)
        : [],
  }));

  return result;
};
