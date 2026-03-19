<template>
  <import-export
    :onlyExport="config.importAndExport.onlyExport"
    :exportParams="exportParams"
    :exportUrl="exportUrl"
    :isLowCode="config.importAndExport?.exportType === 'lowCode'"
    :exportFileName="config.importAndExport.exportFileName"
    :downloadTempleteUrl="config.importAndExport.downloadTempleteUrl"
    :downloadTempleteName="config.importAndExport.downloadTempleteName"
    :checkFileUrl="config.importAndExport.checkFileUrl"
    :downloadResUrl="config.importAndExport.downloadResUrl"
    :downloadResName="config.importAndExport.downloadResName"
    :importUrl="config.importAndExport.importUrl"
    @success="$emit('success')"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import ImportExport from '@/components/import-export/index.vue';
import { Service } from '@/api/typing';

export default defineComponent({
  name: '',
  props: {
    config: {
      type: Object,
      required: true,
    },
    getExportParams: {
      type: Function,
      default: () => {
        return {};
      },
    },
  },
  emits: ['success'],
  setup(props) {
    const exportUrl =
      props.config.importAndExport?.exportType === 'lowCode'
        ? `${Service.LOWCODE}/export/file`
        : props.config.importAndExport.exportUrl;

    //低代码导出所需配置的列表格数据格式，格式如下：
    /* exportColumns: [
      { uid: '1', field: 'ITEM_CODE', title: '物料编码', decodeList: null },
      { uid: '2', field: 'STATUS', title: '状态', decodeList: [{ value: 'Y', text: '有效' }]] }, */
    // 实际导出接口需要的数据格式
    /* exportColumns: [
      { ITEM_CODE: { title: '物料编码' } },
      { ITEM_NAME: { title: '物料名称' } },
      { ITEM_TYPE_NAME: { title: '物料类型' } },
      { TRACE_CODE: { title: '追溯码' } },
      { VERIFICATION_CODE: { title: '防错验证码' } },
      { CREATE_BY: { title: '创建人', convertType:'user-info', userInfoField:'userDescription'} },
      {
        STATUS: {
          title: '状态',
          convertType:'decode', 
          decodeList: [{ Y: '有效' }, { N: '无效' }],
        },
      },
    ], */

    const exportColumns = props.config.importAndExport?.exportColumns?.map(m => {
      const convertType = m.convertType;
      const config = {
        title: m.title,
        convertType,
      };
      if (convertType === 'decode') {
        config['decodeList'] = m.decodeList?.length
          ? m.decodeList.map(x => {
              return {
                [x.value]: x.text,
              };
            })
          : undefined;
      }
      if (convertType === 'user-info') {
        config['userInfoField'] = m.userInfoField || 'userDescription';
      }
      return {
        [m.field]: config,
      };
    });

    const exportParams = computed(() => {
      const exportType = props.config.importAndExport?.exportType;
      if (exportType === 'lowCode') {
        const params = props.getExportParams();
        return Object.assign(params, { exportColumns });
      } else if (exportType === 'custom') {
        return props.getExportParams();
      }
      return {};
    });
    return { exportUrl, exportParams };
  },
  components: {
    ImportExport,
  },
});
</script>

<style lang="less" scoped></style>
