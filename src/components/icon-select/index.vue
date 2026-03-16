<template>
  <a-spin :spinning="state.loading" wrapperClassName="icon-select">
    <a-input
      v-model:value="state.value"
      :readonly="readonly || inputReadonly"
      :placeholder="$t('component.iconSelect.value.placeholder')"
      allowClear
      :disabled="disabled"
      :size="size"
    >
      <template #prefix>
        <icon :name="state.value" style="margin-right: 5px"></icon>
      </template>
      <template #addonAfter>
        <a-popover
          v-model:open="state.open"
          :title="$t('component.iconSelect.modal.title')"
          trigger="click"
          placement="right"
          :get-popup-container="getPopupContainer"
        >
          <template #content>
            <a-radio-group v-model:value="state.type" button-style="solid" size="small">
              <a-radio-button value="Outlined">
                {{ $t('component.iconSelect.radioBtn.Outlined') }}
              </a-radio-button>
              <a-radio-button value="Filled">
                {{ $t('component.iconSelect.radioBtn.Filled') }}
              </a-radio-button>
              <a-radio-button value="TwoTone">
                {{ $t('component.iconSelect.radioBtn.TwoTone') }}
              </a-radio-button>
              <a-radio-button value="icon-">
                {{ $t('component.iconSelect.radioBtn.Custom') }}
              </a-radio-button>
            </a-radio-group>
            <div class="icon-wrapper">
              <span
                v-for="item in displayIconArr"
                :key="item"
                class="icon-item"
                :title="item"
                @click="selectIconItem(item)"
              >
                <icon :name="item" :size="22"></icon>
              </span>
            </div>
          </template>
          <select-outlined />
        </a-popover>
      </template>
    </a-input>
  </a-spin>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, computed } from 'vue';
import { debounce, upperFirst, camelCase } from 'lodash';
import type { PropType } from 'vue';
import type { SizeType } from 'ant-design-vue/lib/config-provider';

import * as Icons from '@ant-design/icons-vue';
//去除非大写开头的方法，只保留图标组件
const iconArr: string[] = Object.keys(Icons).filter(key => /[A-Z]/.test(key[0]));
//加入iconfont自定义图标
import IconFontJson from '@/icon/iconfont/iconfont.json';

const ifj = Object.freeze(IconFontJson);
const iconFontPrefix = ifj.css_prefix_text;
ifj.glyphs.forEach(e => iconArr.push(`${iconFontPrefix}${e.font_class}`));

export default defineComponent({
  name: 'IconSelect',
  props: {
    value: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as PropType<SizeType>,
      default: 'default',
    },
    //控制输入框只读，只读情况下，只能选不能输入
    inputReadonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const state = reactive({
      value: undefined,
      loading: false,
      open: false,
      type: 'Outlined',
    });
    watch(
      () => props.value,
      () => {
        state.value = props.value;
      },
      { immediate: true },
    );

    //禁用状态下不打开popover,暂时没有其他好方法
    watch(
      () => state.open,
      () => {
        if (props.disabled || props.readonly) {
          state.open = false;
        }
      },
      { immediate: true },
    );

    //非法的icon组件名，将组件值清空
    const validateValue = debounce((val: string) => {
      if (val && val.length) {
        //iconArr里的组件名称有驼峰和-链接，将输入值转成驼峰进行判断是否存在
        const camel = upperFirst(camelCase(val));
        if (!iconArr.some(i => i == camel) && !iconArr.some(i => i == val)) {
          state.value = '';
          emit('update:value', '');
        } else if (val.startsWith(iconFontPrefix)) {
          //iconfont的是-链接
          state.value = val;
          emit('update:value', val);
        } else {
          state.value = camel;
          emit('update:value', camel);
        }
      } else {
        emit('update:value', '');
      }
    }, 300);

    watch(
      () => state.value,
      (n, o) => {
        if (n != o) {
          validateValue(n);
        }
      },
      { immediate: true },
    );

    const displayIconArr = computed(() => {
      return iconArr.filter(i => i.endsWith(state.type) || i.startsWith(state.type));
    });

    const selectIconItem = (key: string) => {
      state.open = false;
      state.value = key;
      emit('update:value', state.value);
    };

    const getPopupContainer = () => {
      return document.body;
    };

    return {
      state,
      displayIconArr,
      selectIconItem,
      getPopupContainer,
    };
  },
});
</script>

<style lang="less" scoped>
.icon-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  width: 300px;
  height: 300px;
  margin-top: 12px;
  overflow: auto;
  .icon-item {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 35px;
    height: 35px;
    font-size: 22px;
    &:hover {
      background-color: rgb(248, 248, 248);
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  }
}
</style>
