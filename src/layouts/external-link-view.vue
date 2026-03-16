<template>
  <iframe v-if="!!src" :src="src" frameborder="0" class="external-link-view"></iframe>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
// import { useRoute } from 'vue-router';
import { useUserStore, type UserState } from '@/store/user';

export default defineComponent({
  name: 'ExternalLinkView',
  props: {
    externalLink: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const userStore = useUserStore();
    const currentUser = computed<UserState>(() => userStore.currentUser as UserState);

    /* const route = useRoute();

    const extraParamsStr = Object.keys(route.params).reduce((a, b) => {
      const v = route.params[b];
      return `${a}&${b}=${v}`;
    }, ''); */

    const src = computed<string>(() => {
      // const s = route.meta.externalLink as string;
      //改为构建路由时传递externalLink（如果通过路由获取，开启keep-alive时，切换路由会造成不必要的加载）
      const s = props.externalLink;
      if (!s) {
        return '';
      }
      return `${s}${s.includes('?') ? '&' : '?'}userId=${currentUser.value.userId}&roleId=${
        currentUser.value.currentRoleId
      }&orgId=${currentUser.value.currentOrgId}`; //${extraParamsStr}
    });
    return { src, currentUser };
  },
  components: {},
});
</script>

<style lang="less" scoped>
.external-link-view {
  width: calc(100% + 24px);
  height: calc(100% + 24px);
  margin: -12px;
  padding: 10px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}
</style>
