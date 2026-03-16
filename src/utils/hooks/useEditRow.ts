import { computed, ref, toRaw, type Ref } from 'vue';
import { cloneDeep, isArray, isEqual, isFunction } from 'lodash-es';
import { message } from 'ant-design-vue';
import { uuid } from '@/utils/unique-key-util';

export const EDIT_ROW_KEY = Symbol('editRowUKey');
export const IS_FAKE_ROW_KEY = Symbol('isFakeRowKey');
export const addKeysFilled = row => {
  if (!row[EDIT_ROW_KEY]) {
    row[EDIT_ROW_KEY] = uuid(32);
  }
  return row;
};

export interface IEditRowOptions {
  rowKey: string;
}

export const useEditRow = (dataList: Ref<any[]>, { rowKey }: IEditRowOptions) => {
  const editingKey = ref('');
  const editingKeyObj = ref({});

  const isEditing = computed(() => !!editingKey.value);

  const handleEdit = (record, callback = null) => {
    if (isEditing.value) return message.warning('请先保存正在编辑的行数据');
    const timer = setTimeout(() => {
      clearTimeout(timer);
      editingKeyObj.value = cloneDeep(record);
      editingKey.value = record[EDIT_ROW_KEY];

      callback?.({ editingKey, editingKeyObj });
    }, 0);
  };
  const handleCancel = () => {
    editingKey.value = '';
    editingKeyObj.value = {};
    //如果第一行是假数据，则删除 ，假数据是指为了显示一行编辑行，不得已像数据源中加入了一条数据
    if (dataList.value?.[0]?.[IS_FAKE_ROW_KEY]) {
      dataList.value.splice(0, 1);
    }
  };

  const handleSaveing = ref(false);
  const handleSaveIdx = ref(-1);
  const handleSave = async ({
    record,
    index,
    e,
    preparation = [() => [true]],
    handling,
    onAfterEdit = null,
    /**无变化自动跳过过程 */
    skipOnNotChange = false,
  }: {
    e?: Event;
    /**
     * 预备函数 比如参顺校验等 可传入多个 顺序执行
     * @returns {[boolean, string?]} [是否继续, 提示信息?]
     */
    preparation?: [() => [boolean, string?]];
    /**
     * 保存处理函数
     * @param curData 当前行数据
     * @returns {[boolean, any?, boolean?]} [是否继续, 保存后最新行数据?, 是否添加?]
     */
    handling?: (curData) => Promise<[boolean, any?, boolean?]>;
    onAfterEdit?: (result) => void;
    [key: string]: any;
  }) => {
    e?.stopPropagation();

    try {
      if (skipOnNotChange && isEqual(editingKeyObj.value, record)) return handleCancel();

      for (let index = 0; index < preparation.length; index++) {
        const prep = preparation[index];
        const [isCntu, messgae] = prep();
        if (!isCntu) return message.warning(messgae);
      }

      handleSaveIdx.value = index;
      handleSaveing.value = true;

      const pureEditingKeyObj = cloneDeep(toRaw(editingKeyObj.value));
      delete pureEditingKeyObj[IS_FAKE_ROW_KEY];
      delete pureEditingKeyObj[EDIT_ROW_KEY];

      const [isCntu, result = {}, isAdd = true] = (await handling?.(pureEditingKeyObj)) ?? [false];
      if (!isCntu) return;

      const r = isArray(result) ? result[0] : result;

      if (isFunction(onAfterEdit)) {
        onAfterEdit(r);
      } else {
        Object.assign(
          record,
          isAdd || r
            ? { ...r, [EDIT_ROW_KEY]: editingKeyObj.value[EDIT_ROW_KEY] }
            : editingKeyObj.value,
        );
        delete record[IS_FAKE_ROW_KEY];
      }
      handleCancel();
    } finally {
      handleSaveing.value = false;
      handleSaveIdx.value = -1;
    }
  };

  const handleAdd = async rowData => {
    if (isEditing.value) return message.warning('请先保存正在编辑的行数据');

    rowData = {
      ...cloneDeep(rowData),
      [EDIT_ROW_KEY]: uuid(32),
      //默认新添加的标记为假数据
      [IS_FAKE_ROW_KEY]: true,
    };
    // pause();
    editingKey.value = rowData[EDIT_ROW_KEY];
    editingKeyObj.value = rowData;
    dataList.value.unshift(rowData);
    // await nextTick();
    // resume();
  };

  const deleteRowIndex = ref(-1);

  const handleDelete = async ({
    record,
    index,
    handling,
    onAfterDelete,
  }: {
    record: any;
    index: number;
    handling?: (curData: any) => Promise<[boolean, any?, boolean?]>;
    onAfterDelete?: () => void;
  }) => {
    if (!record[rowKey]) {
      handleCancel();
    }
    try {
      deleteRowIndex.value = index;
      const [isCntu] = (await handling?.(record[rowKey])) ?? [false];
      if (!isCntu) return;
      dataList.value.splice(index, 1);

      if (isFunction(onAfterDelete)) {
        onAfterDelete();
      }
    } finally {
      deleteRowIndex.value = -1;
    }
  };

  return {
    /**编辑行为一ID */
    editingKey,
    /**行数据副本 */
    editingKeyObj,
    /**是否正在编辑 */
    isEditing,

    handleEdit,
    handleCancel,

    isSaving: handleSaveing,
    saveIdx: handleSaveIdx,
    handleSave,

    handleAdd,

    addKeysFilled,

    deleteRowIndex,
    handleDelete,
  };
};
