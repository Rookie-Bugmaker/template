<template>
  <div class="wrapper">
    <div class="title">业务组件</div>
    <a-list
      item-layout="horizontal"
      :loading="state.loading"
      :data-source="state.pageList"
      class="w-full"
    >
      <template #renderItem="{ item }">
        <a-list-item class="cursor-move">
          <template-item :item-info="item" />
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, inject, watch } from 'vue';
import TemplateItem from './template-item.vue';
import { getPageList } from '@/api/low-code/pages/index';
import { designerStateInjectKey } from '@/views/low-code/design/keys';

export default defineComponent({
  name: 'TemplateView',
  setup() {
    const designerState = inject(designerStateInjectKey);

    const state = reactive({
      loading: false,
      pageList: [],
    });

    const getTemplateList = async (groupId: string) => {
      state.loading = true;
      const { success, result } = await getPageList({ groupId, page: 1, pageSize: 0 });
      if (success) {
        state.pageList = result.rows?.filter(f => f.pageId !== designerState?.pageInfo?.pageId);
      }
      state.loading = false;
    };

    watch(
      () => designerState?.groupInfo?.groupId,
      (n, o) => {
        if (n && n !== o) {
          getTemplateList(n);
        }
      },
      {
        immediate: true,
      },
    );

    return { state };
  },
  components: {
    TemplateItem,
  },
});
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  .title {
    height: 40px;
    padding: 0 5px;
    font-weight: bold;
    font-size: 14px;
    line-height: 40px;
    text-align: left;
    width: 100%;
  }
}
</style>
