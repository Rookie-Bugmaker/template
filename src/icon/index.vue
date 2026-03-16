<template>
  <template v-if="name">
    <span
      v-if="isIconfont"
      role="img"
      :class="['app-iconify', 'anticon', spin && 'app-iconify-spin']"
      :style="wrapStyle"
      v-bind="$attrs"
    >
      <iconfont :name="name" />
    </span>
    <component
      v-else
      :is="antdIcon"
      :class="['app-iconify']"
      :spin="spin"
      :style="wrapStyle"
      v-bind="$attrs"
    ></component>
  </template>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, resolveComponent, defineAsyncComponent } from 'vue';
import type { PropType, CSSProperties } from 'vue';
// import Iconfont from './iconfont/index.vue';
const Iconfont = defineAsyncComponent(() => import(/* @vite-ignore */ './iconfont/index.vue'));
import { isString } from 'lodash-es';
/* import IconfontJson from './iconfont/iconfont.json';
const ICONFONT_PREFIX = IconfontJson.css_prefix_text; */
const ICONFONT_PREFIX = 'icon-';

export default defineComponent({
  name: 'Icon',
  inheritAttrs: false,
  props: {
    // icon name
    name: {
      type: String,
      default: '',
    },
    // icon color (iconfont的图标要先去掉图标的颜色，此处设置颜色才有效)
    color: {
      type: String,
      default: '',
    },
    // icon size
    size: {
      type: [String, Number] as PropType<string | number>,
      default: 14,
    },
    spin: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { attrs }) {
    const state = reactive({});
    const isIconfont = computed(() => props.name?.startsWith?.(ICONFONT_PREFIX));
    const antdIcon = computed(() => {
      const c = props.name ? resolveComponent(props.name) : '';
      return typeof c == 'string' ? 'span' : c;
    });

    const wrapStyle = computed((): CSSProperties => {
      const { size, color } = props;
      let fs = size;
      if (isString(size)) {
        fs = parseInt(size, 14);
      }

      const hasClickEvent = Object.prototype.hasOwnProperty.call(attrs, 'onClick');

      return {
        fontSize: `${fs}px`,
        color: color,
        display: 'inline-flex',
        cursor: hasClickEvent ? 'pointer' : 'default',
      };
    });

    return {
      state,
      isIconfont,
      antdIcon,
      wrapStyle,
    };
  },
  components: {
    Iconfont,
  },
});
</script>

<style lang="less" scoped>
.app-iconify {
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  &-spin {
    svg {
      animation: loadingCircle 1s infinite linear;
    }
  }
}
</style>
