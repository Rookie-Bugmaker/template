import request, { CONTENT_TYPE_APPLICATION_JSON } from '@/utils/request';

/** 后端统一使用字符串返回ID及版本，编码/序列号也不转换为数字。 */
export interface PlsmRow {
  id: string;
  revision?: string;
  serial_number?: string;
  matnr?: string;
  producer_code?: string;
  producer_name?: string;
  produced_date?: string;
  status?: string;
  [key: string]: string | undefined;
}

export interface PlsmQuery {
  projectCode?: string;
  productionCode?: string;
  configurationType?: string;
  model?: string;
  trainCode?: string;
  vehicleNo?: string;
  location?: string;
  wbscode?: string;
  producerCode?: string;
  producerName?: string;
  supplierCode?: string;
  serialNumber?: string;
  matnr?: string;
  plant?: string;
  status?: string;
  showInvalid?: boolean;
}

export interface PlsmPage {
  records: PlsmRow[];
  total: number;
  current: number;
  size: number;
  warning?: string;
}

export interface ArchiveCommand {
  id?: string;
  revision?: string;
  serialNumber: string;
  matnr: string;
  producerCode?: string;
  producerName?: string;
  producedDate?: string;
  status?: string;
}

interface Envelope<T> {
  code: number;
  msg?: string;
  message?: string;
  data?: T;
  result?: T;
}

/** 网关服务前缀由部署填写，不能根据仓库名猜测。所有请求仍走模板认证和刷新令牌拦截器。 */
function endpoint(path: string) {
  const prefix = process.env.VUE_APP_PLSM_SERVICE_PREFIX?.trim();
  if (!prefix) {
    throw new Error('尚未配置 PLSM 服务，请联系管理员');
  }
  return `${prefix.replace(/\/$/, '')}/plsm${path}`;
}

/** 兼容平台 ResponseResult 的 data/result 和 msg/message，在业务模块内适配，不改全局请求。 */
function unwrap<T>(body: Envelope<T>): T {
  if (!body || Number(body.code) !== 200) {
    throw new Error(body?.msg || body?.message || 'PLSM 请求失败');
  }
  const result = body.data ?? body.result;
  if (result === undefined || result === null) {
    throw new Error('PLSM 返回数据为空');
  }
  return result;
}

export async function queryPage(
  kind: 'vehicles' | 'archives',
  query: PlsmQuery,
  pageNo: number,
  pageSize: number,
) {
  return unwrap(
    await request.post<unknown, Envelope<PlsmPage>>(endpoint(`/${kind}/page`), query, {
      params: { pageNo, pageSize },
      headers: CONTENT_TYPE_APPLICATION_JSON,
    }),
  );
}

export async function history(
  serialNumber: string,
  matnr: string,
  pageNo: number,
  pageSize: number,
) {
  return unwrap(
    await request.get<unknown, Envelope<PlsmPage>>(endpoint('/history'), {
      params: { serialNumber, matnr, pageNo, pageSize },
    }),
  );
}

export async function permissions() {
  return unwrap(
    await request.get<unknown, Envelope<{ canMaintainArchive: boolean }>>(endpoint('/permissions')),
  );
}

export async function saveArchive(command: ArchiveCommand) {
  const result = unwrap(
    await request.post<unknown, Envelope<{ success: boolean; message: string }[]>>(
      endpoint('/archives/save'),
      [command],
      { headers: CONTENT_TYPE_APPLICATION_JSON },
    ),
  );
  if (result.length !== 1 || !result[0].success) {
    throw new Error(result[0]?.message || '档案未保存');
  }
}

export async function exportVehicles(query: PlsmQuery) {
  let blob: Blob;
  try {
    blob = await request.post<unknown, Blob>(endpoint('/vehicles/export'), query, {
      headers: CONTENT_TYPE_APPLICATION_JSON,
      responseType: 'blob',
    });
  } catch (error) {
    // HTTP400等错误也会因为responseType变成Blob，先还原业务原因，避免只显示通用网络错误。
    const data = (error as { response?: { data?: Blob } }).response?.data;
    if (data instanceof Blob && data.type.includes('json')) {
      const body = JSON.parse(await data.text());
      throw new Error(body.msg || body.message || '导出失败');
    }
    throw error;
  }
  // 兼容全局异常处理返回HTTP200的JSON错误，避免把错误正文下载为报表。
  if (blob.type.includes('json')) {
    const body = JSON.parse(await blob.text());
    throw new Error(body.msg || body.message || '导出失败');
  }
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = '实车序列号查询.xlsx';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function errorText(error: unknown) {
  const e = error as { message?: string; response?: { data?: { msg?: string; message?: string } } };
  return e.response?.data?.msg || e.response?.data?.message || e.message || '操作失败，请重试';
}
