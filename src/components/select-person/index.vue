<template>
  <a-row type="flex" :wrap="false">
    <a-col flex="1">
      <a-select
        style="width: 100%"
        v-model:value="personValue"
        :options="personRows"
        :size="size"
        v-bind="$attrs"
        :show-search="false"
        :field-names="{ label: 'fullName', value: 'personId' }"
        :mode="multiple ? 'multiple' : null"
        :placeholder="placeholder"
        :allow-clear="allowClear"
        :max-tag-count="maxTagCount"
        :disabled="disabled"
        :open="false"
        :showArrow="false"
        @change="handleOk"
      ></a-select>
    </a-col>
    <a-col>
      <a-button
        type="primary"
        :disabled="disabled"
        :size="size"
        v-bind="$attrs"
        @click="handleOpen"
      >
        <template #icon><team-outlined /></template>
        <template v-if="!miniSelectBtn">选择人员</template>
      </a-button>
    </a-col>
  </a-row>
  <select-modal
    v-if="modalState.render"
    :open="modalState.open"
    :person-value="personValue"
    :person-rows="personRows"
    :multiple="multiple"
    :extraQueryParams="extraQueryParams"
    @cancel="modalState.open = false"
    @ok="handleOk"
  ></select-modal>
</template>
<script lang="ts">
import { cloneDeep } from 'lodash-es';
import type { PropType } from 'vue';
import { defineComponent, reactive, ref, watch } from 'vue';
import type { PersonItem } from '@/api/organization/person';
import { findPersonByIds } from '@/api/organization/person';
import SelectModal from './select-modal.vue';
import { Modal } from 'ant-design-vue';
import type { SizeType } from 'ant-design-vue/es/config-provider';
export default defineComponent({
  name: 'SelectPerson',
  props: {
    /**控件绑定值 */
    value: {
      type: [String, Array] as PropType<string | string[]>,
      default: () => [],
    },
    /**是否禁用 */
    disabled: Boolean,
    /**是否多选 */
    multiple: Boolean,
    /**是否隐藏按钮文字 */
    miniSelectBtn: Boolean,
    /**是否显示清除按钮 */
    allowClear: {
      type: Boolean,
      default: true,
    },
    /**占位提示文字 */
    placeholder: {
      type: String,
      default: '请选择',
    },
    /**绑定值类型， */
    valueType: {
      type: String as PropType<'string' | 'array'>,
      default: 'string',
    },
    /**多选展示tag数 */
    maxTagCount: {
      type: Number,
      default: 1,
    },
    /**控件大小 */
    size: {
      type: String as PropType<SizeType>,
      default: 'default',
    },
    /**自定义查询参数 */
    extraQueryParams: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:value', 'bring', 'change'],
  setup(props, { emit }) {
    /**控件选中值 */
    const personValue = ref<string[]>([]);
    /**控件选中数据 */
    const personRows = ref<PersonItem[]>([]);
    /**查询选中数据 */
    const getPersonList = async (keys: string[]) => {
      if (!keys.length) {
        emit(
          'bring',
          props.multiple ? (props.valueType == 'string' ? null : []) : null,
          props.multiple ? [] : null,
        );
        return;
      }
      const { success, message: content, result } = await findPersonByIds(keys);
      if (success) {
        personRows.value = result.map(m => {
          m.personId = String(m.personId);
          return m;
        });
        let keyStr = '';
        const keys = cloneDeep(personValue.value);
        if (props.valueType == 'string') {
          keyStr = keys.join(',');
        }
        const value = keyStr || (keys.length ? keys : null);
        emit('bring', value, props.multiple ? personRows.value : personRows.value?.[0]);
      } else {
        Modal.error({ title: '错误', content });
      }
    };
    /**监听外部数据变化 */
    watch(
      () => props.value,
      value => {
        if (typeof value === 'number') {
          value = String(value);
        }
        personRows.value = [];
        if (props.valueType == 'string') {
          personValue.value = value ? (value as string).split(',') : [];
        } else if (props.valueType == 'array') {
          personValue.value = (value as string[]) ?? [];
        }
        getPersonList(personValue.value);
      },
      {
        immediate: true,
        deep: true,
      },
    );
    // 弹窗状态
    const modalState = reactive({
      open: false,
      render: false,
    });
    // 打开弹窗
    const handleOpen = () => {
      modalState.open = true;
      modalState.render = true;
    };
    // 更新组件值
    const update = () => {
      let keyStr = '';
      const keys = cloneDeep(personValue.value);
      if (props.valueType == 'string') {
        keyStr = keys.join(',');
      }
      const value = keyStr || (keys.length ? keys : null);
      emit('update:value', value);
      emit(
        'change',
        value,
        personRows.value,
        props.multiple ? personRows.value : personRows.value?.[0],
      );
    };
    // 更新数据和控件值
    const handleOk = (keys: string[], rows: PersonItem[]) => {
      personValue.value = keys || [];
      personRows.value = rows || [];
      modalState.open = false;
      update();
    };
    return {
      personRows,
      personValue,
      update,
      handleOpen,
      handleOk,
      modalState,
    };
  },
  components: { SelectModal },
});
</script>
