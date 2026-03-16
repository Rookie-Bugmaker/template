<template>
  <a-layout style="height: 100%">
    <a-layout-sider :width="240">
      <left-menu-layout
        :groupId="groupId"
        @changeGroup="changeGroup"
        @changeCreatePageFlag="() => (createPageFlag = true)"
      ></left-menu-layout>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <content-layout></content-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import { defineComponent, ref, provide } from 'vue';
import { useRoute } from 'vue-router';
import LeftMenuLayout from './left-menu-layout.vue';
import ContentLayout from './content-layout.vue';
import { groupIdInjectKey, appIdInjectKey, createPageFlagInjectKey } from './keys';
export default defineComponent({
  setup() {
    const groupId = ref<string>();
    const createPageFlag = ref<boolean>(false);
    const route = useRoute();
    const changeGroup = (id: string) => {
      groupId.value = id;
    };
    provide(groupIdInjectKey, groupId);
    provide(appIdInjectKey, route.params.applicationId as string);
    provide(createPageFlagInjectKey, createPageFlag);
    return {
      groupId,
      changeGroup,
      createPageFlag,
    };
  },
  components: {
    LeftMenuLayout,
    ContentLayout,
  },
});
</script>
<style lang="less" scoped></style>
