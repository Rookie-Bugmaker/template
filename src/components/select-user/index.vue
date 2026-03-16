<template>
  <a-row type="flex" :wrap="false">
    <a-col flex="1">
      <a-select
        style="width: 100%"
        v-model:value="userValue"
        :size="size"
        v-bind="$attrs"
        :options="userRows"
        :show-search="false"
        :field-names="{ label: showUsername ? 'userName' : 'userDescription', value: 'userId' }"
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
        <template v-if="!miniSelectBtn">选择用户</template>
      </a-button>
    </a-col>
  </a-row>
  <select-modal
    v-if="modalState.render"
    :open="modalState.open"
    :user-value="userValue"
    :user-rows="userRows"
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
import type { UserItem } from '@/api/system/user/index';
import { findByUserIds } from '@/api/system/user/index';
import SelectModal from './select-modal.vue';
import { Modal } from 'ant-design-vue';
import type { SizeType } from 'ant-design-vue/es/config-provider';
export default defineComponent({
  name: 'SelectUser',
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
    /**展示用户名-默认描述 */
    showUsername: Boolean,
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
    const userValue = ref<string[]>([]);
    /**控件选中数据 */
    const userRows = ref<UserItem[]>([]);
    /**查询选中数据 */
    const getUserList = async (keys: string[]) => {
      if (!keys.length) {
        emit(
          'bring',
          props.multiple ? (props.valueType == 'string' ? null : []) : null,
          props.multiple ? [] : null,
        );
        return;
      }
      const { success, message: content, result } = await findByUserIds(keys.join(','));
      if (success) {
        userRows.value = result.map(m => {
          m.userId = String(m.userId);
          m.userDescription = m.userDescription ?? m.userName;
          return m;
        });
        let keyStr = '';
        const keys = cloneDeep(userValue.value);
        if (props.valueType == 'string') {
          keyStr = keys.join(',');
        }
        const value = keyStr || (keys.length ? keys : null);
        emit('bring', value, props.multiple ? userRows.value : userRows.value?.[0]);
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
        userRows.value = [];
        if (props.valueType == 'string') {
          userValue.value = value ? (value as string)?.split?.(',') || [] : [];
        } else if (props.valueType == 'array') {
          userValue.value = (value as string[]) ?? [];
        }
        getUserList(userValue.value);
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
      const keys = cloneDeep(userValue.value);
      if (props.valueType == 'string') {
        keyStr = keys.join(',');
      }
      const value = keyStr || (keys.length ? keys : null);
      emit('update:value', value);
      emit('change', value, props.multiple ? userRows.value : userRows.value?.[0]);
    };
    // 更新数据和控件值
    const handleOk = (keys: string[], rows: UserItem[]) => {
      userValue.value = keys || [];
      userRows.value = rows || [];
      modalState.open = false;
      update();
    };
    return {
      userRows,
      userValue,
      handleOpen,
      handleOk,
      modalState,
    };
  },
  components: { SelectModal },
});
</script>
