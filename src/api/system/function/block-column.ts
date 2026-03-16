import request from '@/utils/request';
import type { ResponseBody } from '@/api/typing';
import { Service } from '@/api/typing';

export type FlagType = 'Y' | 'N'; //Y:是、N:否

/**
 * 列类型(varchar:字符、number:数字、date:日期)
 */
export enum BlockColumnType {
  VARCHAR = 'varchar',
  NUMBER = 'number',
  DATE = 'date',
}

//Block信息
export interface BlockItem {
  functionId: string;
  fcId: string;
  fcCode: string;
  fcName: string;
  fcDesc: string;
  children?: ColumnItem[];
  createBy: number; //创建人ID
  createDate: string; //创建时间
  lastUpdateBy: number; //最后修改人ID
  lastUpdateDate: string; //最后修改时间
  lastUpdateLogin: string;

  key: string; //用于行编辑
}

//Column信息
export interface ColumnItem {
  parentId?: string; //blockId
  fcId: string;
  fcCode: string;
  fcName: string;
  fcDesc: string;
  fcType: BlockColumnType;
  fcDisplayFlag: FlagType; //是否默认显示
  fcEditableFlag: FlagType; //是否默认可编辑
  vsId: string;
  vsCode: string;
  createBy: number; //创建人ID
  createDate: string; //创建时间
  lastUpdateBy: number; //最后修改人ID
  lastUpdateDate: string; //最后修改时间
  lastUpdateLogin: string;

  hideColumn?: boolean; //实际是否隐藏
  editableFlag?: FlagType; //实际是否可编辑

  key: string; //用于行编辑
}

//Block操作
export interface BlockOperationParams {
  functionId: string;
  fcId?: string;
  fcCode: string;
  fcName: string;
  fcDesc: string;

  key: string; //用于行编辑
}

//Column操作
export interface ColumnOperationParams {
  parentId?: string; //blockId
  fcId?: string;
  fcCode: string;
  fcName: string;
  fcDesc: string;
  fcType: BlockColumnType;
  fcDisplayFlag: FlagType;
  fcEditableFlag: FlagType;
  vsId: string;

  key: string; //用于行编辑
}

export interface FindByFunctionIdParams {
  functionId: string;
}

export interface DeleteParams {
  fcIds: string;
}

export async function findBlockAndColumnByFunctionId(functionId: string) {
  return request.post<FindByFunctionIdParams, ResponseBody<BlockItem[]>>(
    `${Service.SYS}/function/column/findByFunctionId`,
    { functionId },
  );
}

export async function addBlock(params: BlockOperationParams) {
  return request.post<BlockOperationParams, ResponseBody>(
    `${Service.SYS}/function/column/add`,
    params,
  );
}
export async function updateBlock(params: BlockOperationParams) {
  return request.post<BlockOperationParams, ResponseBody>(
    `${Service.SYS}/function/column/update`,
    params,
  );
}

export async function addColumn(params: ColumnOperationParams) {
  return request.post<ColumnOperationParams, ResponseBody>(
    `${Service.SYS}/function/column/add`,
    params,
  );
}
export async function updateColumn(params: ColumnOperationParams) {
  return request.post<ColumnOperationParams, ResponseBody>(
    `${Service.SYS}/function/column/update`,
    params,
  );
}

export async function deleteBlockOrColumn(fcIds: string) {
  return request.post<DeleteParams, ResponseBody>(`${Service.SYS}/function/column/delete`, {
    fcIds,
  });
}

//根据菜单ID查询该菜单下的所有功能的块与列权限
export async function findBlockAndColumnByMenuId(menuId: string) {
  return request.post<{ menuId: string }, ResponseBody>(
    `${Service.SYS}/function/column/findByMenuId`,
    {
      menuId,
    },
  );
}
