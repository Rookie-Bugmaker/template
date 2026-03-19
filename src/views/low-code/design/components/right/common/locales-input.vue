<template>
  <a-input :value="inputValue" @change="handleChangeInputValue" v-bind="$attrs">
    <template #suffix>
      <a-popover
        v-model:open="state.popoverVisible"
        title="多语言设置"
        trigger="click"
        placement="left"
        :get-popup-container="getPopupContainer"
        @open-change="handlePopoverVisibleChange"
      >
        <template #content>
          <div v-if="!!targetLocales" class="locales-wrapper">
            <a class="unbindLocales-btn" @click="unbindLocales">解除文案关联</a>
            <a-form-item label="中文">
              <a-input v-model:value="targetLocales['zh-CN']" />
            </a-form-item>
            <a-form-item label="英文">
              <a-input v-model:value="targetLocales['en-US']" />
            </a-form-item>
          </div>
          <div v-else class="locales-wrapper">
            <a-input
              v-model:value.trim="state.searchValue"
              placeholder="搜索语言方案"
              style="width: 100%"
              allow-clear
              @change="searchLocales"
            >
              <template #suffix>
                <search-outlined style="color: rgba(0, 0, 0, 0.45)" />
              </template>
            </a-input>
            <a-button type="primary" block @click="addLocales" style="margin: 10px 0">
              创建多语言方案
            </a-button>
            <ul class="preselection-list">
              <li v-for="item in state.preselectionData" :key="item.uid" @click="bindLocales(item)">
                <span class="text">中文：{{ item['zh-CN'] }}</span>
                <span class="text">英文：{{ item['en-US'] }}</span>
              </li>
            </ul>
          </div>
        </template>
        <global-outlined :class="['setting-icon', { 'is-set': !!targetLocales }]" />
      </a-popover>
    </template>
  </a-input>
</template>

<script lang="ts">
import { defineComponent, computed, inject, reactive } from 'vue';
import { designerStateInjectKey } from '@/views/low-code/design/keys';
import { generateKey } from '@/views/low-code/design/utils/key';

export default defineComponent({
  name: '',
  props: {
    value: {
      type: [Object, String],
      default: '',
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const designerState = inject(designerStateInjectKey);

    const state = reactive({ popoverVisible: false, searchValue: '', preselectionData: [] });

    const targetLocales = computed(() => {
      if (typeof props.value === 'string') {
        return undefined;
      } else {
        return designerState.config.locales.find(f => f.uid === (props.value as any).uid);
      }
    });

    const inputValue = computed(() => {
      return typeof props.value === 'string' ? props.value : targetLocales.value?.['zh-CN'];
    });

    const handleChangeInputValue = e => {
      const v = e.target.value;
      if (typeof props.value === 'string') {
        emit('update:value', v);
      } else {
        if (targetLocales.value) {
          targetLocales.value['zh-CN'] = v;
          //emit('update:value', targetLocales.value);
        } else {
          emit('update:value', '');
        }
      }
    };

    const searchLocales = () => {
      const searchValue = state.searchValue.trim();
      if (searchValue.length === 0) {
        state.preselectionData = [];
        return;
      }
      state.preselectionData = designerState.config.locales
        .filter(f => f['zh-CN'].indexOf(searchValue) > -1 || f['en-US'].indexOf(searchValue) > -1)
        .slice(0, 5);
    };

    const addLocales = () => {
      const newItem = { uid: generateKey(), 'zh-CN': inputValue.value, 'en-US': 'English' };
      emit('update:value', newItem);
      designerState.config.locales.push(newItem);
    };

    const unbindLocales = () => {
      emit('update:value', inputValue.value);
    };

    const bindLocales = data => {
      emit('update:value', data);
    };

    const handlePopoverVisibleChange = (open: boolean) => {
      if (open) {
        state.searchValue = '';
        state.preselectionData = [];
      }
    };

    const getPopupContainer = () => {
      return document.body;
    };

    return {
      state,
      targetLocales,
      inputValue,
      handleChangeInputValue,
      searchLocales,
      addLocales,
      unbindLocales,
      bindLocales,
      handlePopoverVisibleChange,
      getPopupContainer,
    };
  },
});
</script>

<style lang="less" scoped>
.setting-icon {
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
  &.is-set {
    color: #1890ff;
  }
}

.locales-wrapper {
  display: flex;
  flex-direction: column;
  width: 250px;
  .unbindLocales-btn {
    align-self: flex-end;
    float: right;
    margin-bottom: 8px;
  }
  .preselection-list {
    margin: 0;
    padding: 0 10px;
    list-style: none;
    li {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 5px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        cursor: pointer;
      }
      .text {
        flex: 1 1 49%;
      }
      .divider {
        flex: 0 0 2%;
      }
    }
  }
}
</style>
