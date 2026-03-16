import type { ResponseBody } from '@/api/typing';
import { uuid } from '@/utils/unique-key-util';
import { Form } from 'ant-design-vue';
import { message, Modal } from 'ant-design-vue';
import { cloneDeep, pick } from 'lodash';
import type { Ref } from 'vue';
import { computed, reactive, ref, watch } from 'vue';

export interface LineEditOptions<T extends Record<string, any>> {
  /**新增默认值 */
  defaultValue: () => T;
  /**新增接口 */
  add?: (...args: any[]) => Promise<ResponseBody>;
  /**修改接口 */
  update?: (...args: any[]) => Promise<ResponseBody>;
  /**删除接口 */
  del?: (...args: any[]) => Promise<ResponseBody>;
  /**列表数据 */
  list: Ref<T[]>;
  /**主键 */
  primaryKey: string;
  /**参数校验规则 */
  editRule?: Parameters<typeof Form.useForm>[1];
  /**新增/修改成功 */
  onSuccess?: () => void;
  /**删除成功 */
  onDelteSuccess?: () => void;
}

export const useLineEdit = <T extends Record<string, any>>({
  defaultValue,
  add,
  update,
  del,
  list,
  editRule,
  primaryKey,
  onSuccess,
  onDelteSuccess,
}: LineEditOptions<T>) => {
  const loading = ref(false);
  const editData = reactive({ ...cloneDeep(defaultValue()), key: uuid(32) });
  const isEdit = computed(() => {
    const index = list.value.findIndex(f => f.key == editData.key);
    return index > -1;
  });
  const { validate, validateInfos, resetFields } = Form.useForm(editData, editRule || {});
  watch(
    list,
    data => {
      for (const item of data) {
        (item as T & { key: string }).key = uuid(32);
      }
    },
    { immediate: true },
  );
  /**新增 */
  const handleAdd = () => {
    if (isEdit.value) {
      return message.warning('请先保存正在编辑的行');
    }
    const row = { ...cloneDeep(defaultValue()), key: uuid(32) };
    list.value.unshift(row);
    handleEdit(row);
  };
  /**修改 */
  const handleEdit = (record: Omit<T, 'key'>) => {
    if (isEdit.value) {
      return message.warning('请先保存正在编辑的行');
    }
    resetFields(pick(record, Object.keys(editData)));
  };
  /**保存 */
  const handleSave = async () => {
    try {
      await validate();
    } catch {
      return message.warning('校验失败');
    }
    loading.value = true;
    const { success, message: content } = await (editData[primaryKey] ? update : add)(editData);
    loading.value = false;
    if (success) {
      message.success(editData[primaryKey] ? '修改成功' : '新增成功');
      onSuccess?.();
    } else {
      Modal.error({ title: '错误', content });
    }
  };
  /**删除 */
  const handleDelete = async (record: T) => {
    loading.value = true;
    const { success, message: content } = await del(record[primaryKey]);
    loading.value = false;
    if (success) {
      message.success('删除成功');
      onDelteSuccess?.();
    } else {
      Modal.error({ title: '错误', content });
    }
  };
  /**取消编辑 */
  const handleCancel = () => {
    if (!editData[primaryKey]) {
      list.value.shift();
    }
    resetFields({ ...cloneDeep(defaultValue()), key: uuid(32) });
  };
  return {
    isEdit,
    loading,
    editData,
    validateInfos,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
  };
};
