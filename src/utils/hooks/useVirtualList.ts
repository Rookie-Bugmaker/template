/**
使用示例：
【普通 List】
<div class="scroll-container"> // 滚动容器
  <div class="actual-height-container">// 渲染实际高度的容器
    <div class="tranlate-container"> // 用于偏移的容器
      <div v-for="(item, i) in data">
        ...
      </div>
    </div>
  </div>
</div>
const data = useVirtualList({
  data: tableData, // 列表数据
  scrollContainer: '.scroll-container', // 滚动容器
  actualHeightContainer: '.actual-height-container', // 渲染实际高度的容器
  translateContainer: '.tranlate-container', // 需要偏移的目标元素,
  itmeContainer: '.item', // 列表项
  itemHeight: 50, // 列表项的大致高度
  size: 20, // 单次渲染数量 请保证能铺满第一屏
});
【antd-table 组件】
const data = useVirtualList({
  data: tableData,
  itemHeight: 100,
  size: 10,
  scrollContainer: ".ant-table-body", // 滚动容器
  actualHeightContainer: ".ant-table-body", // 渲染实际高度的容器
  translateContainer: ".ant-table-tbody", // 需要偏移的目标元素
});
 */

import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import type { Ref } from 'vue';

interface Config {
  /**数据源 */
  data: Ref<any[]>;
  /**滚动容器的元素选择器 */
  scrollContainer: string;
  /**用于撑开高度的元素选择器 */
  actualHeightContainer: string;
  /**用于偏移的元素选择器 */
  translateContainer: string;
  /**列表项选择器 */
  itmeContainer: string;
  /**列表项大约高度 高度差异 滚动的时候抖动越大 最好是固定高度*/
  itemHeight: number;
  /**每次渲染数据量 */
  size: number;
}

type HtmlElType = HTMLElement | null;

export default function useVirtualList(config: Config) {
  // 获取元素
  let actualHeightContainerEl: HtmlElType = null,
    translateContainerEl: HtmlElType = null,
    scrollContainerEl: HtmlElType = null,
    dataSource: any[] = [];

  onMounted(() => {
    actualHeightContainerEl = document.querySelector(config.actualHeightContainer);
    scrollContainerEl = document.querySelector(config.scrollContainer);
    translateContainerEl = document.querySelector(config.translateContainer);

    // 数据源发生变动
    watch(
      () => config.data.value,
      newVla => {
        dataSource = newVla;
        // 计算需要渲染的数据
        updateRenderData(0);
      },
      { immediate: true },
    );
  });

  // 更新实际高度
  const updateActualHeight = () => {
    let actualHeight = 0;
    dataSource.forEach((_, i) => {
      actualHeight += getItemHeightFromCache(i);
    });

    actualHeightContainerEl!.style.height = actualHeight + 'px';
  };

  // 缓存已渲染元素的高度
  const RenderedItemsCache: any = {};

  // 更新已渲染列表项的缓存高度
  const updateRenderedItemCache = async (index: number) => {
    // 当所有元素的实际高度更新完毕，就不需要重新计算高度
    const shouldUpdate = Object.keys(RenderedItemsCache).length < dataSource.length;
    if (!shouldUpdate) return;

    await nextTick();

    // 获取所有列表项元素
    const Items: HTMLElement[] = Array.from(document.querySelectorAll(config.itmeContainer));

    // 进行缓存
    Items.forEach(el => {
      if (!RenderedItemsCache[index]) RenderedItemsCache[index] = el.offsetHeight;
      index++;
    });

    // 更新实际高度
    updateActualHeight();
  };

  // 获取缓存高度，无缓存，取配置项的 itemHeight
  const getItemHeightFromCache = (index: number | string) => {
    const val = RenderedItemsCache[index];
    return val === void 0 ? config.itemHeight : val;
  };

  // 实际渲染的数据
  const actualRenderData: Ref<any[]> = ref([]);

  // 更新偏移值
  const updateOffset = (offset: number) =>
    (translateContainerEl!.style.transform = `translateY(${offset}px)`);
  // 更新实际渲染数据
  const updateRenderData = (scrollTop: number) => {
    let startIndex = 0;
    let offsetHeight = 0;

    for (let i = 0; i < dataSource.length; i++) {
      offsetHeight += getItemHeightFromCache(i);

      if (offsetHeight >= scrollTop) {
        startIndex = i;
        break;
      }
    }

    // 计算得出的渲染数据
    actualRenderData.value = dataSource.slice(startIndex, startIndex + config.size);
    // 缓存最新的列表项高度
    updateRenderedItemCache(startIndex);
    // 更新偏移值
    updateOffset(offsetHeight - getItemHeightFromCache(startIndex));
  };

  const handleScroll = (e: any) => updateRenderData(e.target.scrollTop);

  onMounted(() => {
    scrollContainerEl?.addEventListener('scroll', handleScroll);
  });
  onBeforeUnmount(() => {
    scrollContainerEl?.removeEventListener('scroll', handleScroll);
  });

  return actualRenderData;
}
