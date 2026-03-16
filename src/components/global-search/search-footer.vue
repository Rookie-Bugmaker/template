<template>
  <div :class="`${prefixCls}`">
    <enter-outlined :class="`${prefixCls}-item`" />
    <span>{{ t('component.globalSearch.confirm') }}</span>
    <arrow-up-outlined :class="`${prefixCls}-item`" />
    <arrow-down-outlined :class="`${prefixCls}-item`" />
    <span>{{ t('component.globalSearch.navigate') }}</span>
    <span :class="`${prefixCls}-item`">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        class="iconify iconify--mdi"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M1 7h6v2H3v2h4v2H3v2h4v2H1V7m10 0h4v2h-4v2h2a2 2 0 0 1 2 2v2c0 1.11-.89 2-2 2H9v-2h4v-2h-2a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2m8 0h2a2 2 0 0 1 2 2v1h-2V9h-2v6h2v-1h2v1c0 1.11-.89 2-2 2h-2a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2Z"
        ></path>
      </svg>
    </span>
    <span>{{ t('component.globalSearch.close') }}</span>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
const prefixCls = 'global-search-footer';
const { t } = useI18n();
</script>
<style lang="less" scoped>
@prefix-cls: ~'global-search-footer';

.@{prefix-cls} {
  position: relative;
  display: flex;
  height: 44px;
  padding: 0 16px;
  font-size: 12px;
  color: #666;
  background-color: @component-background;
  border-top: 1px solid @border-color-base;
  border-radius: 0 0 16px 16px;
  align-items: center;
  flex-shrink: 0;

  &-item {
    display: flex;
    width: 20px;
    height: 18px;
    padding-bottom: 2px;
    margin-right: 0.4em;
    background-color: linear-gradient(-225deg, #d5dbe4, #f8f8f8);
    border-radius: 2px;
    box-shadow: inset 0 -2px 0 0 #cdcde6, inset 0 0 1px 1px #fff,
      0 1px 2px 1px rgba(30, 35, 90, 0.4);
    align-items: center;
    justify-content: center;

    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(6) {
      margin-left: 14px;
    }
  }
}
</style>
