import { useRoute } from 'vue-router';
import type { MenuRouteMetaPermission } from '@/router/typing';
import { isArray } from 'lodash';
import { reactive, isRef, ref, unref, computed, toRefs } from 'vue';
import type { Ref } from 'vue';

export interface Props {
  [key: string]: any;
}
export type MaybeRef<T> = T | Ref<T>;

export interface StateInterface {
  disabledFields: (string | string[])[];
  flatDisabledFields: string[];
  hideFields: (string | string[])[];
  flatHideFields: string[];
}

export interface isDisabledFields {
  [key: string]: boolean;
}

/**
 * 根据当前页面的路由权限设置，控制编辑字段
 * @param modelRef 表单的字段，传递表单的数据对象即可
 * @param isEdit 一般表单的新增和修改是同一个界面，以下逻辑只用于控制编辑页面，所需要要传递当前是编辑状态还是新增状态
 * @param blockCode 如果编辑界面中有多个块需要控制，则传递该参数，否则默认使用第一个块的配置
 * @returns
 */
export const useFormPermission = (
  modelRef: MaybeRef<Props>,
  isEdit: MaybeRef<boolean>,
  blockCode?: string,
) => {
  const route = useRoute();
  const state = reactive<StateInterface>({
    disabledFields: [],
    flatDisabledFields: [],
    hideFields: [],
    flatHideFields: [],
  });
  //当前页面的权限设置
  const currentRoutePermission = route.meta?.permission as MenuRouteMetaPermission[];
  if (currentRoutePermission?.length) {
    //列权限，如果有指定块按指定获取列权限设置,没有则默认取第一个块权限
    const targetBlock = blockCode
      ? currentRoutePermission.find(f => f.blockCode === blockCode)
      : currentRoutePermission?.[0];
    state.disabledFields = (targetBlock?.disabledFields || []) as (string | string[])[];
    state.flatDisabledFields = state.disabledFields.map(m => {
      if (isArray(m)) {
        return m.join('.');
      } else {
        return m;
      }
    });
    state.hideFields = (targetBlock?.hideColumns || []) as (string | string[])[];
    state.flatHideFields = state.hideFields.map(m => {
      if (isArray(m)) {
        return m.join('.');
      } else {
        return m;
      }
    });
  }

  const isEditRef = isRef(isEdit) ? isEdit : ref(isEdit);

  //没有设置默认有编辑权限
  const isDisabled = (field: string) => {
    return state.flatDisabledFields.some(s => s === field);
  };

  //没有设置默认显示
  const isHide = (field: string) => {
    return state.flatHideFields.some(s => s === field);
  };

  const formFields = Object.keys(isRef(modelRef) ? unref(modelRef) : modelRef);

  const isDisabledFields = computed<isDisabledFields>(() => {
    const result = {};
    formFields.forEach(e => {
      result[e] = isEditRef.value ? isDisabled(e) : false;
    });
    return result;
  });

  const isHideFields = computed<isDisabledFields>(() => {
    const result = {};
    formFields.forEach(e => {
      result[e] = isEditRef.value ? isHide(e) : false;
    });
    return result;
  });

  return {
    ...toRefs(state),
    isDisabled,
    isHide,
    isDisabledFields,
    isHideFields,
  };
};
