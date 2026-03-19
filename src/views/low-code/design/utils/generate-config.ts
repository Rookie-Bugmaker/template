import { getObjectByTableIdsAndViewIds } from '@/api/low-code/design/index';
import { uniq } from 'lodash';

export async function generateConfig(designerState: any) {
  const relations = await getRelations(designerState.pageInfo?.tableRelations);
  designerState.config.relations = relations;
}

/**
 * 获取表之间的关系
 */
export async function getRelations(tableRelations: any[]) {
  //去重获取关系图中所有objectId
  const objectIds = uniq(
    tableRelations?.reduce((a, b) => {
      return a.concat([b.mainTableId, b.subTableId]);
    }, []) || [],
  );
  if (objectIds.length) {
    const objectList = [];
    //获取objectId对应的表或视图信息
    const { success, result } = await getObjectByTableIdsAndViewIds(objectIds.join(','));
    if (success && result) {
      objectList.push(...(result.tableInfoList || []), ...(result.viewInfoList || []));
    }
    if (objectList.length) {
      //获取columnId对应的字段编码
      const getFieldCode = (columnId: string) => {
        const target = objectList
          .reduce((a, b) => {
            return a.concat(b.fieldList);
          }, [])
          .find(f => f.fieldId === columnId);
        return target?.fieldCode;
      };

      return tableRelations.map(e => {
        const columnRelations = e.columnRelations.map(m => {
          return {
            mainColumnId: m.mainTableColumnId,
            mainColumnCode: getFieldCode(m.mainTableColumnId),
            subColumnId: m.subTableColumnId,
            subColumnCode: getFieldCode(m.subTableColumnId),
          };
        });
        //构建关系对象数据
        return {
          mainId: e.mainTableId,
          subId: e.subTableId,
          columnRelations,
        };
      });
    }
  }

  return [];
}
