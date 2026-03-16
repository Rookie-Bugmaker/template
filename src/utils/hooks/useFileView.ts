import { reactive, isRef, computed, watch, toRefs } from 'vue';
import type { Ref } from 'vue';
import { findByFileId, findByFileHeaderId } from '@/api/file';
import to from 'await-to-js';
import { encode } from 'js-base64';
import { isArray } from 'lodash';
import { useFileAuthPath } from './useFileAuthPath';

export interface Options {
  fileUrl?: string; //文件url
  fileId?: string; //文件ID
  fileHeaderId?: string; //文件头ID
  isImgPreview?: boolean; //是否为返回图片预览url（支持多图预览）
}

export interface FileViewContext {
  loading: boolean; //是否加载中
  previewSrc: string; //预览地址
}

//单文件预览路径及参数名
export const FILE_VIEW_SINGLE_FILE_PATH: string = '/onlinePreview?url=';
//多图预览路径及参数名
export const FILE_VIEW_MULTI_IMG_PATH: string = '/picturesPreview?urls=';

/**
 * 根据kkFileView规则将url编码
 * @param url
 * @returns
 */
export const getEncodeFileUrl = (url: string) => {
  return encodeURIComponent(encode(url));
};

/**
 * 在文件名后面添加fileId作为新文件名，防止重新上传文件后，仍然使用上次上传文件的缓存
 * （kkFileView通过文件URL作为缓存依据，通过不同的文件名可以防止缓存，并且拼接的是fileId，不是时间，更有效的利用缓存）
 * @param fileName
 * @param fileId
 * @returns
 */
export const convertFileName = (fileName: string, fileId: string) => {
  const fileExtIndex = fileName.lastIndexOf('.');

  // 异常处理：确保文件名包含扩展名
  if (fileExtIndex === -1) {
    console.error('错误的文件名:预览文件必须包含后缀');
    return fileName;
  }

  const fileExt = fileName.substring(fileExtIndex + 1);
  //const fileNameWithoutExt = fileName.substring(0, fileExtIndex);

  // 返回构造的文件名
  //${fileNameWithoutExt}_   去掉文件名前缀，因为文件名中如果包含特殊字符，如&之类的，会导致预览服务报错
  return `${fileId}.${fileExt}`;
};

/**
 * 根据options获取文件url,如果都有值的话，优先级:fileUrl > fileId > fileHeaderId
 * @param options
 * @returns
 */
export const getFileUrl = async ({
  fileUrl,
  fileId,
  fileHeaderId,
}: Options): Promise<string | string[]> => {
  const { downloadPathPrefix } = useFileAuthPath();
  if (fileUrl) {
    return fileUrl;
  } else if (fileId) {
    const [err, { success, result }] = await to(findByFileId(fileId));
    if (err || !success || !result) {
      console.error('获取文件信息失败');
    } else {
      const fileName = result.oldFileName;
      const cFileName = convertFileName(fileName, fileId);
      return `${downloadPathPrefix.value}${fileId}&fullfilename=${cFileName}`;
    }
  } else if (fileHeaderId) {
    const [err, { success, result }] = await to(findByFileHeaderId(fileHeaderId));
    if (err || !success || !result?.length) {
      console.error('获取文件信息失败');
    } else {
      return result.map(m => {
        const fileName = m.oldFileName;
        const cFileName = convertFileName(fileName, fileId);
        return `${downloadPathPrefix.value}${m.fileId}&fullfilename=${cFileName}`;
      });
    }
  }
  return null;
};

/**
 * 根据不同情况获取url,
 * 单文件直接预览（单url）
 * 多文件（数组url）,如果是图片的话，可以多图预览
 * 多文件（数组url,且不是图片的话，取返回的数组的第0个文件预览
 * @param options
 * @returns
 */
export const getPreviewUrl = async (options: Options) => {
  let src = null;
  const url = await getFileUrl(options);
  if (!url) return src;
  const prefixUrl = process.env.VUE_APP_FILE_VIEW_URL;
  if (isArray(url)) {
    if (options.isImgPreview) {
      src = prefixUrl + FILE_VIEW_MULTI_IMG_PATH + getEncodeFileUrl(url.join('|'));
    } else {
      src = prefixUrl + FILE_VIEW_SINGLE_FILE_PATH + getEncodeFileUrl(url[0]);
    }
  } else {
    src = prefixUrl + FILE_VIEW_SINGLE_FILE_PATH + getEncodeFileUrl(url);
  }
  return src;
};

/**
 * 直接根据参数打开预览
 * @param options
 * @param target
 * @param windowFeatures
 */
export const openPreview = async (options: Options, target = '_blank', windowFeatures) => {
  const url = await getPreviewUrl(options);
  url && window.open(url, target, windowFeatures);
};

export const useFileView = (options: Options | Ref<Options>) => {
  const ops = computed(() => (isRef(options) ? options.value : options));

  const state: FileViewContext = reactive({
    loading: false,
    previewSrc: '',
  });

  const changeSrc = async (options: Options) => {
    state.loading = true;
    state.previewSrc = await getPreviewUrl(options);
    state.loading = false;
  };

  watch(
    () => ops.value,
    async n => {
      if (n) {
        changeSrc(n);
      }
    },
    { immediate: true, deep: true },
  );

  /**
   * 窗口方式打开预览页面
   * @param target
   * @param windowFeatures
   */
  const open = (target = '_blank', windowFeatures?: any) => {
    state.previewSrc && window.open(state.previewSrc, target, windowFeatures);
  };

  /**
   * 异步-窗口方式打开预览页面
   * @param options
   * @param target
   * @param windowFeatures
   */
  const openAsync = async (options: Options, target = '_blank', windowFeatures?: any) => {
    await changeSrc(options);
    window.open(state.previewSrc, target, windowFeatures);
  };

  return {
    ...toRefs(state),
    open,
    openAsync,
  };
};
