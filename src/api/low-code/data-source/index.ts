import request from '@/utils/request';
import type { ResponseBody, PageResult } from '@/api/typing';
import { Service } from '@/api/typing';

// 数据源信息
export interface DataSourceItem {
  dataSourceId: string;
  dataSourceCode: string;
  dbUrl: string;
  username: string;
  password: string;
  driverClassName: string;
  dataSourceDesc: string;
}

// 分页+查询
export interface DataSourceParams {
  page: number;
  pageSize: number;
  dataSourceCode?: string;
  dbUrl?: string;
  driverClassName?: string;
  dataSourceDesc?: string;
  language?: string;
}

// id查询
export interface QueryByIdParams {
  dataSourceId: string;
}

// 可用性测试
export interface AvailabilityTest {
  dbUrl: string;
  username: string;
  password: string;
  driverClassName: string;
}

// 分页+查询
export async function findDataSourceByPage(params: DataSourceParams) {
  return request.post<DataSourceParams, ResponseBody<PageResult<DataSourceItem>>>(
    `${Service.LOWCODE}/datasource/findByPage`,
    params,
  );
}

// 新增
export async function addDataSource(params: DataSourceItem) {
  return request.post<DataSourceItem, ResponseBody>(`${Service.LOWCODE}/datasource/add`, params);
}

// 修改
export async function updateDataSource(params: DataSourceItem) {
  return request.post<DataSourceItem, ResponseBody>(`${Service.LOWCODE}/datasource/update`, params);
}

// 根据id查询数据源
export async function findDataSourceById(dataSourceId: string) {
  return request.post<QueryByIdParams, ResponseBody<DataSourceItem>>(
    `${Service.LOWCODE}/datasource/findById`,
    {
      dataSourceId,
    },
  );
}

// 删除
export async function deleteDataSource(dataSourceId: string) {
  return request.post<string, ResponseBody>(`${Service.LOWCODE}/datasource/delete`, {
    dataSourceId,
  });
}

// 数据源可用性测试
export async function dataSourceAvailabilityTest(params: AvailabilityTest) {
  return request.post<AvailabilityTest, ResponseBody>(
    `${Service.LOWCODE}/datasource/availabilityTest`,
    params,
  );
}
