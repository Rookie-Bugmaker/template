<template>
  <base-config-form>
    <template v-slot="{ config, size }">
      <a-collapse-panel key="2" header="属性设置">
        <a-form-item label="占位提示">
          <a-input v-model:value="config.options.placeholder" :size="size" allow-clear />
        </a-form-item>
        <a-form-item label="大小">
          <a-radio-group v-model:value="config.options.size" button-style="solid" :size="size">
            <a-radio-button value="small">小</a-radio-button>
            <a-radio-button value="middle">中</a-radio-button>
            <a-radio-button value="large">大</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="清除按钮">
          <a-switch
            v-model:checked="config.options.allowClear"
            checked-children="显示"
            un-checked-children="隐藏"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="输入框只读">
          <a-switch
            v-model:checked="config.options.inputReadOnly"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="选择器">
          <a-radio-group v-model:value="config.options.picker" button-style="solid" :size="size">
            <a-radio-button value="">默认</a-radio-button>
            <a-radio-button value="month">月</a-radio-button>
            <a-radio-button value="year">年</a-radio-button>
            <a-radio-button value="week">周</a-radio-button>
            <a-radio-button value="quarter">季度</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="显示日期格式化">
          <a-select
            v-model:value="config.options.format"
            :size="size"
            allow-clear
            :dropdown-match-select-width="false"
          >
            <a-select-option value="">无</a-select-option>
            <a-select-option value="YYYY-MM-DD">YYYY-MM-DD</a-select-option>
            <a-select-option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</a-select-option>
            <a-select-option value="YYYY年MM月DD日">YYYY年MM月DD日</a-select-option>
            <a-select-option value="YYYY年MM月DD日 HH:mm:ss">
              YYYY年MM月DD日 HH:mm:ss
            </a-select-option>
            <a-select-option value="YYYY年MM月DD日 HH时mm分ss秒">
              YYYY年MM月DD日 HH时mm分ss秒
            </a-select-option>
            <a-select-option value="YYYY-MM">YYYY-MM</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="显示时间">
          <a-switch
            v-model:checked="config.options.showTime"
            checked-children="是"
            un-checked-children="否"
            :size="size"
          />
        </a-form-item>
        <a-form-item label="值格式化">
          <a-select
            v-model:value="config.options.valueFormat"
            :size="size"
            allow-clear
            :dropdown-match-select-width="false"
            placeholder="默认(YYYY-MM-DD HH:mm:ss)"
          >
            <a-select-option value="YYYY-MM-DD">YYYY-MM-DD</a-select-option>
            <a-select-option value="YYYY-MM-DD 00:00:00">
              YYYY-MM-DD 00:00:00(一般用于查询开始时间)
            </a-select-option>
            <a-select-option value="YYYY-MM-DD 23:59:59">
              YYYY-MM-DD 23:59:59(一般用于查询结束时间)
            </a-select-option>
            <a-select-option value="YYYY-MM">YYYY-MM</a-select-option>
            <a-select-option value="YYYY">YYYY</a-select-option>
          </a-select>
        </a-form-item>
      </a-collapse-panel>
    </template>
  </base-config-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseConfigForm from '../common/base-config-form.vue';

export default defineComponent({
  name: '',
  setup() {
    return {};
  },
  components: {
    BaseConfigForm,
  },
});
</script>

<style lang="less" scoped></style>
