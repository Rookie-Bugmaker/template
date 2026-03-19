import { inject, ref, computed } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { generateKey } from '@/views/low-code/design/utils/key';

export interface ConditionItem {
  uid: string;
  name: string;
  desc: string;
  func: string;
}

const searchValue = ref(null);

const editingKey = ref(null);

export default function useConditions() {
  const designerState = inject(designerStateInjectKey);

  const conditions = computed<ConditionItem[]>(() => {
    const v = searchValue.value;
    if (v?.length) {
      return (
        designerState.config?.conditions?.filter(f => f.name?.includes(v) || f.desc?.includes(v)) ||
        []
      );
    } else {
      return designerState.config?.conditions || [];
    }
  });

  const initNewCondition = (): ConditionItem => {
    return {
      uid: generateKey(),
      name: '条件',
      desc: '',
      func: '',
    };
  };

  const add = () => {
    if (!designerState.config?.conditions) {
      designerState.config.conditions = [];
    }
    const c = initNewCondition();
    designerState.config.conditions.push(c);
    editingKey.value = c.uid;
    return c.uid;
  };

  const edit = (uid: string) => {
    editingKey.value = uid;
  };

  const remove = (uid: string) => {
    // 删除条件
    const index = designerState.config.conditions.findIndex(item => item.uid === uid);
    if (index !== -1) {
      designerState.config.conditions.splice(index, 1);
    }
  };

  return {
    conditions,
    searchValue,
    editingKey,
    add,
    edit,
    remove,
  };
}
