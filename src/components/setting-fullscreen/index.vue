<template>
  <a-dropdown class="ant-pro-dropdown ant-pro-dropdown-action">
    <a-tooltip
      :title="
        screenState ? t('global.fullscreen.exitFullsreen') : t('global.fullscreen.setFullsreen')
      "
    >
      <!--  <fullscreen-outlined v-if="!screenState" @click="setFull" />
      <fullscreen-exit-outlined v-else @click="exitFull" /> -->
      <span>
        <icon-fullscreen v-if="!screenState" @click="setFull" />
        <icon-fullscreen-exit v-else @click="exitFull" />
      </span>
    </a-tooltip>
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { IconFullscreen, IconFullscreenExit } from '@/components/yl/icon/index';

/**
 * 需要结合useFullscreen使用
 */
export default defineComponent({
  props: {
    screenState: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['set-full', 'exit-full'],
  setup(_props, { emit }) {
    const { t } = useI18n();
    const setFull = () => {
      emit('set-full');
    };

    const exitFull = () => {
      emit('exit-full');
    };

    return {
      t,
      setFull,
      exitFull,
    };
  },
  components: { IconFullscreen, IconFullscreenExit },
});
</script>

<style lang="less" scoped></style>
