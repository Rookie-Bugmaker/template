<template>
  <wrap-content v-show="externalLink && isKeepAlive">
    <template v-if="multiTab">
      <external-link-view
        v-for="item in cacheList"
        :key="item.key"
        :externalLink="item?.route?.meta?.externalLink as string"
        :style="{ display: currentCachePath == item.path ? 'block' : 'none' }"
      ></external-link-view>
    </template>
    <external-link-view
      v-else-if="isKeepAlive"
      :externalLink="route?.meta?.externalLink as string"
    ></external-link-view>
  </wrap-content>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { injectMultiTabStore } from '@/components/multi-tab/multi-tab-store';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/store/app';

import { default as WrapContent } from '@/components/base-layouts/wrap-content/index.vue';
import ExternalLinkView from './external-link-view.vue';

const multiTabState = injectMultiTabStore();
const currentCachePath = computed(() => multiTabState?.current);

//只显示仅显示内页外链externalLink，且为keepAlive的页面（不缓存的页面使用原来RouteView的方式显示）
const cacheList = computed(
  () =>
    multiTabState?.cacheList?.filter(
      f => f?.route?.meta?.externalLink && f?.route?.meta?.keepAlive,
    ) || [],
);

const route = useRoute();
const isKeepAlive = computed(() => route?.meta?.keepAlive);
const externalLink = computed(() => route?.meta?.externalLink);

//如果显示多标签，则缓存页面，如果不显示多标签，且当前页面为缓存页面，则直接使用此页面显示外链页面
const appStore = useAppStore();
const multiTab = computed(() => appStore.multiTab);
</script>

<style lang="less" scoped></style>
