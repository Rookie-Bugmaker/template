<template>
  <template v-if="'function' === column?.bodyCellSlot?.type">
    <span
      v-if="column?.bodyCellSlot?.options?.asHtml === true"
      v-html="executeFn(column?.bodyCellSlot?.options?.fn)"
    ></span>
    <span v-else>
      {{ executeFn(column?.bodyCellSlot?.options?.fn) }}
    </span>
  </template>
  <template v-else-if="'presets' === column?.bodyCellSlot?.type">
    <status-tag
      v-if="column?.bodyCellSlot?.options?.presets?.type === 'status-tag'"
      :value="text"
      :status-list="column?.bodyCellSlot?.options?.presets?.statusList"
    />
    <span v-else-if="column?.bodyCellSlot?.options?.presets?.type === 'date-format'">
      {{ formatDate(text, column?.bodyCellSlot?.options?.presets?.dateFormat) }}
    </span>
    <span v-else-if="column?.bodyCellSlot?.options?.presets?.type === 'value-set'">
      {{ valueSetValueDesc }}
    </span>
    <span v-else-if="column?.bodyCellSlot?.options?.presets?.type === 'user-info'">
      {{ userInfoDesc }}
    </span>
  </template>
  <process-status
    v-else-if="column?.type === WidgetType.ProcessStatus"
    :process-status-data="processStatusData"
    :key="record.editRowKey"
  />
  <upload-file
    v-else-if="column?.type === WidgetType.UploadFile"
    disabled
    :type="column.options?.type"
    multiple
    :size="column.options?.size"
    :preview="column.options?.preview"
    :value="text as string"
    :key="record.editRowKey as string"
  />
  <upload-image
    v-else-if="column?.type === WidgetType.UploadImage"
    disabled
    :type="column.options?.type"
    inImage
    multiple
    :size="column.options?.size"
    :value="text as string"
    :width="column.options?.width"
    :height="column.options?.height"
    :key="record.editRowKey as string"
  />
  <!-- :style="{ width: `${column.width}px` }" -->
  <ellipsis v-else-if="column?.ellipsis" :style="{ width: '100%' }">
    {{ text }}
  </ellipsis>
  <span v-else>{{ text }}</span>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, computed, unref } from 'vue';
import StatusTag from '@/components/status-tag/index.vue';
import Ellipsis from '@/components/ellipsis/index.vue';
import dayjs from 'dayjs';
import { findNoRootByCode } from '@/api/system/value-set';
import type { ValueSetItem } from '@/api/system/value-set';
import ProcessStatus from '@/components/workflow/process-status/index.vue';
import type { ProcessStatusItem } from '@/api/workflow/instance/index';
import { WidgetType } from '@/views/low-code/parser/typing/typing';
import UploadFile from '@/components/upload-file/index.vue';
import UploadImage from '@/components/upload-image/index.vue';
import type { UserItem } from '@/api/system/user';

export default defineComponent({
  name: '',
  props: {
    text: {
      type: [String, Number],
      default: '',
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: null,
    },
    column: {
      type: Object,
      default: () => ({}),
    },
    conversionMap: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:conversionMap'],
  setup(props, { emit }) {
    const { conversionMap } = toRefs(props);

    const executeFn = (fn: string) => {
      return eval(`(text, record, index, column)=>{${fn}}`)(
        props.text,
        props.record,
        props.index,
        props.column,
      );
    };

    const formatDate = (dateStr: string, format: string) => {
      if (dateStr && format) {
        //后端返回的都是标准格式
        return dayjs(dateStr, 'YYYY-MM-DD HH:mm:ss').format(format);
      } else {
        return '';
      }
    };

    //集编码
    const setCode = computed(() => props?.column?.bodyCellSlot?.options?.presets?.setCode);
    //集编码下的值列
    const valueList = ref<ValueSetItem[]>([]);
    //获取值列表
    const getValueList = (code: string): void => {
      findNoRootByCode(code)
        .then(({ success, result }) => {
          if (success && result) {
            valueList.value = result;
          } else {
            valueList.value = [];
          }
          //查询后更新转换map
          emit(
            'update:conversionMap',
            unref(Object.assign(conversionMap.value, { [setCode.value]: valueList.value })),
          );
        })
        .catch(err => {
          console.log(err);
        });
    };

    //设置集编码才去查询
    if (setCode.value) {
      const target = conversionMap.value[setCode.value];
      //先去找转换map中是否有值，没有值再去查询转换列表
      if (target) {
        valueList.value = target;
      } else {
        //第0行才触发查询，避免触发多次查询(其他行不需要触发查询，等第0行查询值集返回结果即可)
        if (props.index === 0) {
          getValueList(setCode.value);
        }
      }
    }

    const valueSetValueDesc = computed(() => {
      //父集编码
      const parentCode = props?.column?.bodyCellSlot?.options?.presets?.parentSetCode;
      //父值字段
      const parentValueField = props?.column?.bodyCellSlot?.options?.presets?.parentValueField;
      //父集编码对应的值集
      const parentValueList = conversionMap.value[parentCode];
      //父值ID
      let parentId = null;
      //根据值集设置(是存储code还是存储id)
      if (props?.column?.bodyCellSlot?.options?.presets?.parentCodeValue === true) {
        //父值(编码)
        const parentValue = props.record[parentValueField];
        //父集编码对应的值集的父值数据
        const parentItem = parentValueList?.find(f => f['vsCode'] === parentValue);
        parentId = parentItem?.['vsId'];
      } else {
        parentId = props.record[parentValueField];
      }
      //根据值集设置(是存储code还是存储id)
      const key =
        props?.column?.bodyCellSlot?.options?.presets?.codeValue === true ? 'vsCode' : 'vsId';
      //获取值并切割，因为值集可能多选
      const v = props.text as string;
      const val = v ? (typeof v === 'string' ? v.split(',') : [v]) : [];
      //获取转换列表
      let vList = conversionMap.value[setCode.value] || [];
      if (parentId) {
        vList = vList.filter(f => f.parentLineId == parentId);
      }

      //获取并返回值名称
      if (val?.length) {
        return val
          .map(m => {
            return vList.find(f => f[key] == m)?.['vsName'];
          })
          .filter(x => x)
          .join(',');
      }
      return null;
    });

    const processStatusData = computed<ProcessStatusItem>(() => {
      const psList: ProcessStatusItem[] = conversionMap.value['PROCESS_INSTANCE_ID'] || [];
      return psList.find(f => f.processInstanceId === props.text);
    });

    const userInfoDesc = computed<string>(() => {
      const userList: UserItem[] = conversionMap.value['USER-INFO-LIST'] || [];
      const fieldKey =
        props?.column?.bodyCellSlot?.options?.presets?.userInfoField || 'userDescription';
      return userList.find(f => f.userId === props.text)?.[fieldKey];
    });

    return {
      executeFn,
      formatDate,
      valueSetValueDesc,
      processStatusData,
      WidgetType,
      userInfoDesc,
    };
  },
  components: {
    StatusTag,
    Ellipsis,
    ProcessStatus,
    UploadFile,
    UploadImage,
  },
});
</script>

<style lang="less" scoped></style>
