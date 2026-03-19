import { inject, toRaw } from 'vue';
import { cloneDeep } from 'lodash';
import { parserStateInjectKey } from '@/views/low-code/parser/keys';
import { insertData, updateData, deleteData } from '@/api/low-code/parser';
import type { ResponseBody } from '@/api/typing';

export const useCud = (config: any) => {
  const parserState = inject(parserStateInjectKey);

  const pageId = parserState.pageId;

  const dataObjectId = config.dataSource.dataObjectId;

  const dataObjectPrimaryKey = config.dataSource.dataObjectPrimaryKey;

  const beanName = config.dataSource.beanName;

  const insert = (data: any) => {
    const d = cloneDeep(toRaw(data));
    return new Promise<Partial<ResponseBody>>(resolve => {
      insertData({
        pageId: pageId,
        beanName,
        data: [
          {
            objectId: dataObjectId,
            data: [d],
          },
        ],
      })
        .then(res => {
          if (res.success) {
            resolve(res);
          } else {
            resolve(res);
          }
        })
        .catch(err => {
          resolve({ success: false, message: err.message });
        });
    });
  };

  const update = (data: any) => {
    const d = cloneDeep(toRaw(data));
    return new Promise<Partial<ResponseBody>>(resolve => {
      updateData({
        pageId: pageId,
        beanName,
        data: [
          {
            objectId: dataObjectId,
            data: [d],
          },
        ],
      })
        .then(res => {
          if (res.success) {
            resolve(res);
          } else {
            resolve(res);
          }
        })
        .catch(err => {
          resolve({ success: false, message: err.message });
        });
    });
  };

  const remove = (data: any) => {
    return new Promise<Partial<ResponseBody>>(resolve => {
      deleteData({
        pageId: pageId,
        beanName,
        data: [
          {
            objectId: dataObjectId,
            data: [
              {
                [dataObjectPrimaryKey]: data[dataObjectPrimaryKey],
              },
            ],
          },
        ],
      })
        .then(res => {
          if (res.success) {
            resolve(res);
          } else {
            resolve(res);
          }
        })
        .catch(err => {
          resolve({ success: false, message: err.message });
        });
    });
  };

  return { insert, update, remove };
};
