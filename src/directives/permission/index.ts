import { createVNode, render, isRef } from 'vue';
import type { DirectiveBinding } from 'vue';
import { isArray, isString, isEmpty, isBoolean, isPlainObject, isNil } from 'lodash';
import NoPermissionMask from './no-permission-mask.vue';
import router from '@/router';
import type { MenuRouteMeta, MenuRouteMetaPermission } from '@/router/typing';
import type { MaybeRef } from '@/typing';

/**
 * v-permission
 *
 * 例子:
 * code为权限代码（必需,string类型，或boolean直接控制，支持ref）
 * v-permission="code"
 * v-permission:auth:hide="code" 等同于v-permission="code"
 * v-permission:auth:mask="code"
 *
 * field为字段代码（必需，string类型，或boolean直接控制，支持ref）
 * block为快代码（可不传，如果页面有多个块控制的情况下）
 * isEdit是否是编辑页（可不传，有些页面权限仅控制编辑页，支持ref）,如果传了优先判断isEdit，如果isEdit是false，直接全部字段权限放开
 * v-permission:auth:hide="field"
 * v-permission:auth:hide="{field}"
 * v-permission:auth:hide="{field,[blockCode],[isEdit]}"
 *
 * v-permission:auth:mask 与v-permission:auth:disabled 参数用法同 v-permission:auth:hide
 *
 */

enum ArgType {
  AuthHide = 'auth:hide', //（按钮）如无权限，移除元素
  AuthMask = 'auth:mask', //（按钮）如无权限，为元素添加遮挡层
  FieldHide = 'field:hide', //（表单项）如无权限，移除元素
  FieldMask = 'field:mask', //（表单项）如无权限，为元素添加遮挡层
  FieldDisabled = 'field:disabled', //（表单项）如无权限，禁用元素(并未兼容所有组件的disabled,仅支持原生el的disabled)
}

interface ParamsObj {
  field: string;
  blockCode?: string;
  isEdit?: MaybeRef<boolean>;
}

type PermissionType = 'hide' | 'disabled';

const permission = {
  name: 'permission',
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const arg = binding.arg || 'auth:hide';

    //当前页面的元数据
    const currentRouteMeta = router.currentRoute.value?.meta as MenuRouteMeta;

    if (operation[arg]) {
      operation[arg](currentRouteMeta, el, binding);
    } else {
      console.warn('v-permission:arg类型错误，只能是', Object.values(ArgType).join(','));
    }
  },
};

const operation: Record<ArgType, any> = {
  'auth:hide': (currentRouteMeta: MenuRouteMeta, el: HTMLElement, binding: DirectiveBinding) => {
    if (!isAuth(currentRouteMeta, binding)) {
      el.remove();
    }
  },
  'auth:mask': (currentRouteMeta: MenuRouteMeta, el: HTMLElement, binding: DirectiveBinding) => {
    if (!isAuth(currentRouteMeta, binding)) {
      coverElement(el);
    }
  },
  'field:hide': (currentRouteMeta: MenuRouteMeta, el: HTMLElement, binding: DirectiveBinding) => {
    if (noPermission('hide', currentRouteMeta, binding)) {
      el.remove();
    }
  },
  'field:mask': (currentRouteMeta: MenuRouteMeta, el: HTMLElement, binding: DirectiveBinding) => {
    if (noPermission('hide', currentRouteMeta, binding)) {
      coverElement(el);
    }
  },
  'field:disabled': (
    currentRouteMeta: MenuRouteMeta,
    el: HTMLElement,
    binding: DirectiveBinding,
  ) => {
    if (noPermission('disabled', currentRouteMeta, binding)) {
      (el as HTMLInputElement).disabled = true;
    }
  },
};

//判断权限/按钮
const isAuth = (currentRouteMeta: MenuRouteMeta, binding: DirectiveBinding): boolean => {
  const auth = isRef(binding.value) ? binding.value.value : binding.value;
  if (isString(auth) && !isEmpty(auth)) {
    return hasAuthority(currentRouteMeta, auth);
  } else if (isBoolean(auth)) {
    return auth;
  } else {
    console.warn('v-permission参数类型错误，只能是string或boolean', binding.value);
  }
  return false;
};

//判断列/字段是否无权限
const noPermission = (
  type: PermissionType,
  currentRouteMeta: MenuRouteMeta,
  binding: DirectiveBinding,
): boolean => {
  const auth = binding.value;
  if (isString(auth) && !isEmpty(auth)) {
    return hasNoPermission(type, currentRouteMeta, auth);
  } else if (isPlainObject(auth)) {
    const { field, blockCode, isEdit } = auth as ParamsObj;
    if (!isNil(isEdit)) {
      const isEditVal = isRef(isEdit) ? isEdit.value : isEdit;
      if (isEditVal) {
        return hasNoPermission(type, currentRouteMeta, field, blockCode);
      } else {
        return false;
      }
    } else {
      return hasNoPermission(type, currentRouteMeta, field);
    }
  } else if (isBoolean(auth)) {
    return auth;
  } else {
    console.warn('v-permission参数类型错误，只能是string或array或boolean', binding.value);
  }
  return true;
};

//为元素添加遮罩层
const coverElement = (el: HTMLElement): void => {
  const mountNode = document.createElement('div');
  const vNode = createVNode(NoPermissionMask);
  render(vNode, mountNode);
  el.parentNode.insertBefore(mountNode.childNodes[0], el);
  el.remove();
};

//判断权限/按钮
export const hasAuthority = (routeMeta: MenuRouteMeta, authCode: string): boolean => {
  //动态路由转换时已经全部转换为字符串数组类型
  const routeMetaAuthority = (routeMeta?.authority || []) as string[];
  //根据当前页面的权限设置，判断参数authCode是否有权限（在权限数组中有权限）
  return routeMetaAuthority.includes(authCode) || false;
};

//判断列/字段显示权限和编辑权限
export const hasNoPermission = (
  type: PermissionType,
  routeMeta: MenuRouteMeta,
  field: string,
  blockCode?: string,
): boolean => {
  //当前页面的权限设置
  const routePermission = routeMeta?.permission as MenuRouteMetaPermission[];
  if (routePermission?.length) {
    //列权限，如果有指定块按指定获取列权限设置,没有则默认取第一个块权限
    const targetBlock = blockCode
      ? routePermission.find(f => f.blockCode === blockCode)
      : routePermission?.[0];
    if (type === 'hide') {
      const hideFields = (targetBlock?.hideColumns || []) as (string | string[])[];
      const flatHideFields = hideFields.map(m => {
        if (isArray(m)) {
          return m.join('.');
        } else {
          return m;
        }
      });
      return flatHideFields.includes(field) || false;
    } else {
      const disabledFields = (targetBlock?.disabledFields || []) as (string | string[])[];
      const flatDisabledFields = disabledFields.map(m => {
        if (isArray(m)) {
          return m.join('.');
        } else {
          return m;
        }
      });
      return flatDisabledFields.includes(field) || false;
    }
  }
  return true;
};

export default permission;
