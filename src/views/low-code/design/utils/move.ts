import { cloneDeep } from 'lodash';
import { generateKey } from './key';
import { BlockType } from '../typing/index';
import type { WidgetType } from '../typing/index';

interface Playload {
  uid: string;
  type: BlockType | WidgetType;
  [key: string]: any;
}

interface MoveParams {
  addedIndex: number | null;
  removedIndex: number | null;
  payload?: Playload;
}

//移动表单字段
export function moveFormField(
  params: MoveParams,
  dropFormId: string,
  dropFieldId: string,
  blockMap: Map<string, any>,
) {
  //addedIndex和removedIndex只会有一个等于null，不会同时等于或同时不是null
  if (params.addedIndex === null && params.removedIndex === null) {
    return;
  }
  const blockConfig = blockMap.get(dropFormId);
  if (blockConfig) {
    const fieldConfig = cloneDeep(params.payload);
    if (!fieldConfig) {
      return;
    }
    if (!fieldConfig?.uid) {
      Object.assign(fieldConfig, { uid: generateKey() });
    }
    //两者相等说明没有移动
    if (params.addedIndex !== params.removedIndex) {
      if (params.addedIndex !== null) {
        //如果投放目标为空，说明改表单无字段，直接将新增字段放入表单即可
        if (dropFieldId === null) {
          blockConfig.fieldList.push(fieldConfig);
        } else {
          const dropTargetFieldIndex = getKeyIndexInBlock(dropFieldId, blockConfig);
          if (dropTargetFieldIndex !== -1) {
            //新字段
            if (!fieldConfig?.uid) {
              blockConfig.fieldList.splice(
                dropTargetFieldIndex + params.addedIndex,
                0,
                fieldConfig,
              );
            } else {
              //移动字段
              const dragFieldIndex = getKeyIndexInBlock(fieldConfig.uid, blockConfig);
              blockConfig.fieldList.splice(
                dropTargetFieldIndex + params.addedIndex,
                0,
                fieldConfig,
              );
              //dragFieldIndex !== -1说明是从当前表单中移动的字段
              if (dragFieldIndex !== -1) {
                if (dragFieldIndex < dropTargetFieldIndex) {
                  blockConfig.fieldList.splice(dragFieldIndex, 1);
                } else {
                  blockConfig.fieldList.splice(dragFieldIndex + 1, 1);
                }
              } else {
                //是从别的表单块拖过来的字段，需要移除来源表单中的字段
                const targetBlock = getFieldBlock(fieldConfig.uid, blockMap, dropFormId);
                if (targetBlock) {
                  const removeIndex = targetBlock.fieldList.findIndex(
                    f => f.uid === fieldConfig.uid,
                  );
                  targetBlock.fieldList.splice(removeIndex, 1);
                }
                //还是找不到说明是从左侧拖入的新增字段，不用进行来源表单字段删除
              }
            }
          }
        }
      }
    }
  }
}

export function getKeyIndexInBlock(fieldId: string, blockConfig: any): number {
  if (!blockConfig) {
    return -1;
  } else if (blockConfig.type === BlockType.Form || blockConfig.type === BlockType.SearchForm) {
    return blockConfig.fieldList.findIndex(f => f.uid === fieldId);
  } else if (blockConfig.type === BlockType.Table) {
    return blockConfig.columns.findIndex(f => f.uid === fieldId);
  } else {
    return -1;
  }
}

export function getFieldBlock(
  fieldId: string,
  blockMap: Map<string, any>,
  excludeBlockId?: string,
) {
  return Array.from(blockMap.values())
    .filter(f => f.uid !== excludeBlockId)
    .find(blockConfig => {
      if (blockConfig.type === BlockType.Form || blockConfig.type === BlockType.SearchForm) {
        return blockConfig.fieldList.some(f => f.uid === fieldId);
      } else if (blockConfig.type === BlockType.Table) {
        return blockConfig.columns.some(f => f.uid === fieldId);
      } else {
        return false;
      }
    });
}

export function moveBlok(params: MoveParams, dropBlockId: string, blockMap: Map<string, any>) {
  if (params === null) {
    return;
  }
  //addedIndex和removedIndex只会有一个等于null，不会同时等于或同时不是null
  if (params.addedIndex === null && params.removedIndex === null) {
    return;
  }
  const blockConfig = blockMap.get(dropBlockId);
  const removedIndex = params.removedIndex;
  const addedIndex = params.addedIndex;

  //说明块是从外部移动进来
  if (removedIndex == null) {
    const addBlockConfig = cloneDeep(params.payload);
    if (!addBlockConfig?.uid) {
      Object.assign(addBlockConfig, { uid: generateKey() });
    }
    blockConfig.children.splice(addedIndex, 0, addBlockConfig);
  } else if (addedIndex == null) {
    //说明块从原有地方移动到其他地方
    blockConfig.children.splice(removedIndex, 1);
  } else {
    const newChildren = blockConfig.children.slice();
    const childItem = newChildren[removedIndex];
    newChildren.splice(removedIndex, 1);
    if (addedIndex === 0) {
      newChildren.unshift(childItem);
    } else {
      newChildren.splice(addedIndex, 0, childItem);
    }
    blockConfig.children = newChildren;
  }
}
