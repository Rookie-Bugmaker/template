import { ref } from 'vue';
import { localStorage } from '@/utils/local-storage';
import { STORAGE_TOKEN_KEY, STORAGE_TOKEN_TYPE_KEY } from '@/store/user';

export function useFileAuthPath() {
  const environment = process.env.VUE_APP_API_URL;

  const savedTokenType = localStorage.get(STORAGE_TOKEN_TYPE_KEY);
  const savedToken = localStorage.get(STORAGE_TOKEN_KEY);
  const previewPathPrefix = ref(
    `${environment}/file/preview?Authorization=${savedTokenType} ${savedToken}&fileId=`,
  );

  const downloadPathPrefix = ref(
    `${environment}/file/download?Authorization=${savedTokenType} ${savedToken}&fileId=`,
  );

  //监听storage中的token变化
  (localStorage as any).watch(STORAGE_TOKEN_KEY, () => {
    const tokenType = localStorage.get(STORAGE_TOKEN_TYPE_KEY);
    const token = localStorage.get(STORAGE_TOKEN_KEY);
    previewPathPrefix.value = `${environment}/file/preview?Authorization=${tokenType} ${token}&fileId=`;
    downloadPathPrefix.value = `${environment}/file/download?Authorization=${tokenType} ${token}&fileId=`;
  });

  return {
    previewPathPrefix,
    downloadPathPrefix,
  };
}
