import type { MenuDataItem } from '@/router/typing';
import { staticRoutes } from '@/router/index';
import { useUserStore, type UserState } from '@/store/user';
import {
  ref,
  onBeforeMount,
  unref,
  nextTick,
  computed,
  watch,
  type Ref,
  type VNodeChild,
} from 'vue';
import { clone, debounce } from 'lodash-es';
import { useRouter } from 'vue-router';
import { useScrollTo } from '@/utils/hooks/event/useScrollTo';
import { onKeyStroke } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import PinyinMatch from 'pinyin-match';

export interface SearchResult {
  name: string;
  path: string;
  icon?: string | VNodeChild | JSX.Element;
  pathItemArray?: MenuItem[];
}

type Nullable<T> = T | null;

type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

type EmitType = (event: string, ...args: any[]) => void;

interface ChangeEvent extends Event {
  target: HTMLInputElement;
}

export type MenuItem = {
  pathName?: string; //按全路径菜单名
  pathItemArray?: MenuItem[]; //菜单层级数据
  itemName?: string; //当前菜单名称
} & MenuDataItem;

// Translate special characters
/* function transform(c: string) {
  const code: string[] = ['$', '(', ')', '*', '+', '.', '[', ']', '?', '\\', '^', '{', '}', '|'];
  return code.includes(c) ? `\\${c}` : c;
}

function createSearchReg(key: string) {
  const keys = [...key].map(item => transform(item));
  const str = ['', ...keys, ''].join('.*');
  return new RegExp(str);
} */

export function useMenuSearch(refs: Ref<HTMLElement[]>, scrollWrap: Ref<ElRef>, emit: EmitType) {
  const searchResult = ref<SearchResult[]>([]);
  const keyword = ref('');
  const activeIndex = ref(-1);

  const { t } = useI18n();
  const router = useRouter();
  const userStore = useUserStore();
  const currentUser = computed<UserState>(() => userStore.currentUser as UserState);

  const handleSearch = debounce(search, 200);

  const leafNodeList: MenuItem[] = [];

  //将树形结构的路由树转换成数组，并只取叶子节点路由
  function convertRoutersAndSetLeafNodeList(routers: MenuItem[], parentItem?: MenuItem) {
    routers.forEach(item => {
      const currentItemTitle = item.meta.title !== undefined ? t(item.meta.title as string) : '';
      if (parentItem) {
        item.pathItemArray = [...parentItem.pathItemArray, item];
        item.pathName = `${parentItem.pathName} > ${currentItemTitle}`;
        item.itemName = currentItemTitle;
      } else {
        item.pathItemArray = [item];
        item.pathName = currentItemTitle;
        item.itemName = currentItemTitle;
      }
      if (item?.children?.length && !item.meta.hideChildrenInMenu) {
        convertRoutersAndSetLeafNodeList(item.children, item);
      } else if (!item.meta.hideInMenu) {
        leafNodeList.push(item);
      }
    });
  }

  onBeforeMount(async () => {
    /* const allowRouters = computed(() => userStore.allowRouters);
    //浅拷贝对象即可满足需求，深拷贝包含了组件对象，会导致页面卡顿
    const routers = clone(allowRouters.value)?.filter(f => {
      //去除固定路由
      return !staticRoutes.some(x => x.path === f.path);
    });
    convertRoutersAndSetLeafNodeList(routers as any); */

    //因为菜单异步加载了，所以需要去监听userStore.allowRouters
    watch(
      () => userStore.allowRouters,
      () => {
        const allowRouters = userStore.allowRouters;
        //浅拷贝对象即可满足需求，深拷贝包含了组件对象，会导致页面卡顿
        const routers = clone(allowRouters)?.filter(f => {
          //去除固定路由
          return !staticRoutes.some(x => x.path === f.path);
        });
        convertRoutersAndSetLeafNodeList(routers as any);
      },
      {
        immediate: true,
      },
    );
  });

  function handlerSearchResult(keyword: string): SearchResult[] {
    const ret: SearchResult[] = leafNodeList
      .filter(f => PinyinMatch.match(f.pathName, keyword))
      .map(({ pathName, path, meta, pathItemArray }) => {
        return {
          name: pathName,
          path,
          icon: meta.icon,
          pathItemArray,
        };
      });
    return ret;
  }

  function search(e: ChangeEvent) {
    e?.stopPropagation();
    const key = e.target.value;
    keyword.value = key.trim();
    if (!key) {
      searchResult.value = [];
      return;
    }
    /*   const reg = createSearchReg(unref(keyword));
    searchResult.value = handlerSearchResult(reg); */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    searchResult.value = handlerSearchResult(unref(keyword));
    activeIndex.value = 0;
  }

  /* function handlerSearchResult(reg: RegExp): SearchResult[] {
    const ret: SearchResult[] = leafNodeList
      .filter(f => reg.test(f.pathName))
      .map(({ pathName, path, meta, pathItemArray }) => {
        return {
          name: pathName,
          path,
          icon: meta.icon,
          pathItemArray,
        };
      });
    return ret;
  } */

  // Activate when the mouse moves to a certain line
  function handleMouseenter(e: any) {
    const index = e.target.dataset.index;
    activeIndex.value = Number(index);
  }

  // Arrow key up
  function handleUp() {
    if (!searchResult.value.length) return;
    activeIndex.value--;
    if (activeIndex.value < 0) {
      activeIndex.value = searchResult.value.length - 1;
    }
    handleScroll();
  }

  // Arrow key down
  function handleDown() {
    if (!searchResult.value.length) return;
    activeIndex.value++;
    if (activeIndex.value > searchResult.value.length - 1) {
      activeIndex.value = 0;
    }
    handleScroll();
  }

  // When the keyboard up and down keys move to an invisible place
  // the scroll bar needs to scroll automatically
  function handleScroll() {
    const refList = unref(refs);
    if (!refList || !Array.isArray(refList) || refList.length === 0 || !unref(scrollWrap)) {
      return;
    }

    const index = unref(activeIndex);
    const currentRef = refList[index];
    if (!currentRef) {
      return;
    }
    const wrapEl = unref(scrollWrap);
    if (!wrapEl) {
      return;
    }
    const scrollHeight = currentRef.offsetTop + currentRef.offsetHeight;
    const wrapHeight = wrapEl.offsetHeight;
    const { start } = useScrollTo({
      el: wrapEl,
      duration: 100,
      to: scrollHeight - wrapHeight,
    });
    start();
  }

  const pattern = /^((\/)?(https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;

  // enter keyboard event
  async function handleEnter() {
    if (!searchResult.value.length) {
      return;
    }
    const result = unref(searchResult);
    const index = unref(activeIndex);
    if (result.length === 0 || index < 0) {
      return;
    }
    const to = result[index];
    handleClose();
    await nextTick();
    const path = to.path;
    const isOtherUrl = pattern.test(path);
    //如果外链用内部打开，path会被转变为普通路由path,外链存在meta.externalLink
    //这里直接判断是否外链即可
    if (isOtherUrl) {
      const routes = router.getRoutes();
      const { target } = routes.find(r => r.path.indexOf(path) > -1)?.meta || {};
      const url = `${path}${path.includes('?') ? '&' : '?'}userId=${
        currentUser.value.userId
      }&roleId=${currentUser.value.currentRoleId}&orgId=${currentUser.value.currentOrgId}`;
      window.open(url, target as string);
    } else {
      router.push(path);
    }
  }

  // close search modal
  function handleClose() {
    searchResult.value = [];
    emit('close');
  }

  // enter search
  onKeyStroke('Enter', handleEnter);
  // Monitor keyboard arrow keys
  onKeyStroke('ArrowUp', handleUp);
  onKeyStroke('ArrowDown', handleDown);
  // esc close
  onKeyStroke('Escape', handleClose);

  return { handleSearch, searchResult, keyword, activeIndex, handleMouseenter, handleEnter };
}
