import type { UploadProps } from 'ant-design-vue';
import type { FileItem } from '@/api/file/index';
import { message, Modal } from 'ant-design-vue';
import { h, nextTick, reactive, watch } from 'vue';
import {
  deleteByFileId,
  downloadAllFile,
  findByFileHeaderId,
  upload,
  downloadFile4Bolb,
} from '@/api/file/index';
import type { Ref } from 'vue';
import { useFileAuthPath } from './useFileAuthPath';

/**hooks配置 */
export interface Config {
  /**文件类型 */
  accept: Ref<string>;
  /**单个文件大小-kb */
  maxFileSize: Ref<number>;
  /**多文件 */
  multiple: Ref<boolean>;
  /**控件绑定值 */
  value: Ref<string>;
  /**最大上传数量 */
  maxUpload: Ref<number>;
  /**不接收文件类型 */
  unAccept?: Ref<string>;
}

/**hooks事件 */
export interface UploadFileEvent {
  /**上传成功 */
  uploadSuccess?: (value: string, fileList: FileItem[]) => void;
  /**删除成功 */
  deleteSuccess?: () => void;
  /**查询列表完成 */
  querySuccess?: (value: string, fileList: FileItem[]) => void;
  /**文件列表change */
  listChange?: (value: string, fileList) => void;
}

/**上传状态 */
export interface UploadState {
  /**进入上传的文件数量 */
  uploadNum: number;
  /**校验通过的文件数 */
  pass: number;
  /**上传文件总数 */
  total: number;
  /**上传中状态 */
  loading: boolean;
  /**上传完成弹窗内容 */
  modalContent: string[];
  /**form表单数据 */
  formdata: FormData;
}

export const environment =
  process.env.NODE_ENV == 'development' ? '/api' : process.env.VUE_APP_API_BASE_URL;
export const useUploadFile = (config: Config, event?: UploadFileEvent) => {
  // 文件列表
  const fileList = reactive<FileItem[]>([]);
  // 默认上传状态
  const initValue = (): UploadState => ({
    pass: 0,
    total: 0,
    uploadNum: 0,
    loading: false,
    modalContent: [],
    formdata: new FormData(),
  });
  // 初始化上传状态
  const initState = () => {
    Object.assign(uploadState, initValue());
  };
  // 上传状态
  const uploadState = reactive(initValue());
  // 根据文件组ID查询文件列表
  const queryList = async () => {
    if (!config.value.value) {
      return;
    }
    const { success, message: msg, result } = await findByFileHeaderId(config.value.value);
    if (success) {
      fileList.splice(0);
      fileList.push(...result);
      event?.querySuccess?.(config.value.value, fileList);
    } else {
      Modal.error({ title: '查询失败', content: msg || '查询文件失败' });
    }
  };
  watch(
    () => config.value.value,
    value => {
      if (value) {
        queryList();
      } else {
        fileList.splice(0);
      }
    },
    { immediate: true },
  );
  // 上传之前做一些校验
  const beforeUpload: UploadProps['beforeUpload'] = (file: File, list: File[]) => {
    const [type] = file.type.split('/');
    const splitArr = file.name.split('.');
    const fileType = splitArr[splitArr.length - 1];
    const fileTypeArr = config.accept.value.replaceAll('.', '').split(',');
    if (file.size / 1024 > config.maxFileSize.value && config.maxFileSize.value !== null) {
      uploadState.modalContent.push(`${file.name}：超出文件大小限制`);
    } else if (
      config.accept.value != '*' &&
      !fileTypeArr.includes(fileType) &&
      fileTypeArr.includes('image/*') &&
      type != 'image'
    ) {
      uploadState.modalContent.push(`${file.name}：不支持上传该格式文件`);
    } else if (config.unAccept?.value?.split(',').includes(fileType)) {
      uploadState.modalContent.push(`${file.name}：不支持上传${config.unAccept.value}格式文件`);
    } else {
      uploadState.modalContent.push(`${file.name}：上传成功`);
      uploadState.formdata.append(`file${uploadState.modalContent.length}`, file);
      uploadState.pass++;
    }
    uploadState.total = list.length;
  };
  // 自定义上传
  const customRequest = async () => {
    uploadState.uploadNum++;
    // 所有通过文件
    if (uploadState.uploadNum != uploadState.total) {
      return;
    } else if (
      !!config.maxUpload.value &&
      uploadState.total + fileList.length > config.maxUpload.value &&
      config.multiple.value
    ) {
      message.warning(`最多上传${config.maxUpload.value}个文件`);
      initState();
      return;
    } else if (!uploadState.pass) {
      const content = uploadState.modalContent.join('\n');
      Modal.error({
        title: '上传失败',
        content: () => h('pre', { style: { whiteSpace: 'pre-wrap' } }, content),
      });
      initState();
      return;
    }
    // 有fileHeaderId就带上
    if (config.value.value) {
      uploadState.formdata.append('fileHeaderId', config.value.value);
    }
    // 开始上传
    uploadState.loading = true;
    const { result, success, message: msg } = await upload(uploadState.formdata);
    uploadState.loading = false;
    if (success) {
      const content = uploadState.modalContent.join('\n');
      message.success(h('pre', { style: { whiteSpace: 'pre-wrap' } }, content));
      // 单文件上传完之后，删掉原来的图片
      if (!config.multiple.value) {
        for (const item of fileList) {
          deleteFile(item.fileId, false);
        }
      }
      fileList.push(...result);
      const [item] = result;
      event?.uploadSuccess?.(item.fileHeaderId, fileList);
      nextTick(() => {
        event?.listChange?.(config.value.value, fileList);
      });
    } else {
      Modal.error({
        title: '上传失败',
        content: msg || '上传失败',
      });
    }
    initState();
  };
  // 删除文件
  const deleteFile = async (id: string, tip = true) => {
    const { success, message: content } = await deleteByFileId(id);
    if (success) {
      // 单文件重新上传删除时不需要提示
      if (tip) {
        message.success('删除成功');
      }
      const index = fileList.findIndex(f => f.fileId == id);
      fileList.splice(index, 1);
      if (!fileList.length) {
        event?.deleteSuccess?.();
      }
      nextTick(() => {
        event?.listChange?.(config.value.value, fileList);
      });
    } else {
      Modal.error({ title: '错误', content });
    }
  };
  const { downloadPathPrefix } = useFileAuthPath();
  // 下载文件
  const downloadFile = (fileId: string) => {
    location.href = `${downloadPathPrefix.value}${fileId}`;
  };
  // 下载文件
  const downloadFile4Blob = async (fileId: string) => {
    const data = await downloadFile4Bolb(fileId);
    return new Blob([data]);
  };
  // 下载所有文件
  const downloadAll = async () => {
    const data = await downloadAllFile(config.value.value);
    const fileUrl = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement('a');
    a.href = fileUrl;
    a.setAttribute('download', `${Date.now()}.zip`); // 注意文件后缀
    a.click();
    a.remove();
  };
  return {
    fileList,
    uploadState,
    queryList,
    initState,
    deleteFile,
    downloadAll,
    beforeUpload,
    downloadFile,
    customRequest,
    downloadFile4Blob,
  };
};
