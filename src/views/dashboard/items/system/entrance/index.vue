<template>
  <page-component-wrapper :title="title" :loading="loading">
    <a-flex
      justify="start"
      align="start"
      wrap="wrap"
      gap="small"
      :vertical="false"
      style="padding: 12px"
    >
      <div
        v-for="(item, index) in list"
        :key="index"
        @click="toSubApp(item.name, item.url)"
        class="entrance-item"
      >
        <img class="app-img" src="@/assets/image/home/entrance.png" />
        <div class="app-name">{{ item.nameCn }}</div>
      </div>
    </a-flex>
  </page-component-wrapper>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import PageComponentWrapper from '@/views/dashboard/components/page-component-wrapper.vue';
import { getCurrentUserProjectList } from '@/api/system/project';
import { useFetchList } from '@/utils/hooks/useFetchList';
import { useRouter, useRoute } from 'vue-router';
import { Flex as AFlex, message } from 'ant-design-vue';

defineProps<{
  title: string;
}>();

const { list, loading, reload } = useFetchList(getCurrentUserProjectList, {
  autoFetch: false,
});

const router = useRouter();
const route = useRoute();

const toSubApp = (name: string, url: string) => {
  router.push({
    path: `/sub-app`,
    query: {
      name,
      url: encodeURIComponent(url),
    },
  });
};

//用于单点登录进来之后跳转进子应用
watch(
  () => route.query?.subCode,
  async (n, o) => {
    await reload();
    if (n && n != o) {
      const target = list.value.find(f => f.name == n);
      if (target) {
        toSubApp(target.name, target.url);
      } else {
        message.warning(`您没有项目${n}的权限，请联系系统管理员`);
      }
    }
  },
  {
    immediate: true,
  },
);
</script>

<style lang="less" scoped>
.entrance-item {
  display: inline-block;
  cursor: pointer;
  width: 120px;
  .app-img {
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 5px;
  }
  .app-name {
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--primary-color);
    opacity: 0.65;
    font-weight: 800;
    margin-top: 4px;
  }
}
</style>
