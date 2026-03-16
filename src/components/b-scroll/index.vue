<script lang="ts">
import { defineComponent, ref, nextTick, onMounted, h } from 'vue';
import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';
BScroll.use(MouseWheel);
import ScrollBar from '@better-scroll/scroll-bar';
BScroll.use(ScrollBar);
import ObserveDOM from '@better-scroll/observe-dom';
BScroll.use(ObserveDOM);

/**
 * docs
 * https://better-scroll.github.io/docs/zh-CN/
 */
export default defineComponent({
  name: 'BScorll',
  /**
   * 标签类型，默认div
   */
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    /**
     * 1. probeType 为 0，在任何时候都不派发 scroll 事件，
     * 2. probeType 为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件，
     * 3. probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件，
     * 4. probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
     */
    probeType: {
      type: Number,
      default: 1,
    },
    /**
     * 点击列表是否派发click事件
     */
    click: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否开启纵向滚动（默认开启）
     */
    scrollY: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否开启横向滚动，默认纵向滚动。
     * 开启横向滚动需要将传入元素设置为横向例如：display:inline-block
     */
    scrollX: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const scroll = ref<any>(null);

    const scrollRef = ref(null);

    onMounted(() => {
      nextTick(() => {
        scroll.value = new BScroll(scrollRef.value as any, {
          scrollY: props.scrollY,
          scrollX: props.scrollY,
          click: props.click,
          mouseWheel: true,
          scrollbar: {
            fade: false,
            interactive: true,
            scrollbarTrackClickable: true,
          },
          observeDOM: true,
        });
      });
    });

    return () =>
      h(
        props.tag,
        {
          class: 'b-scroll',
          ref: scrollRef,
        },
        slots.default?.(),
      );
  },
});
</script>

<style lang="less" scoped>
.b-scroll {
  position: relative;
}
</style>
