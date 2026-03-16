<template>
  <!-- <div class="user-tag" :style="{ 'background-color': '#3296fa' }">
    <span class="first-char">{{ userName.charAt(0) }}</span>
    <close-outlined v-if="!readonly" class="close-icon" @click="$emit('unselect-user')" />
    <span class="full-name" :title="userName">{{ userName }}</span>
  </div> -->
  <a-tooltip :title="userData?.userName" placement="top">
    <div class="user-tag">
      <a-avatar size="large" :style="{ backgroundColor: '#3296fa', verticalAlign: 'middle' }">
        {{ userData?.userDescription || userData?.userName }}
      </a-avatar>
      <close-outlined v-if="!readonly" class="close-icon" @click="$emit('unselect-user')" />
    </div>
  </a-tooltip>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { PropType } from 'vue';
import type { UserItem } from '@/api/system/user';

export default defineComponent({
  name: 'UserTag',
  props: {
    userData: {
      type: Object as PropType<UserItem>,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['unselect-user'],
  setup(props) {
    const userName = computed(() => {
      return props.userData.userName || '？';
    });

    const getRandomBgc = () => {
      return `rgba(${Math.trunc(Math.random() * 120 + 80)}, ${Math.trunc(
        Math.random() * 120 + 80,
      )}, ${Math.trunc(Math.random() * 120 + 80)}, ${Math.trunc(Math.random() * 55) / 55 + 0.45} )`;
    };

    return { userName, getRandomBgc };
  },
});
</script>

<style lang="less" scoped>
.user-tag {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 40px;
  margin-left: 6px;
  /* margin-right: 12px;
  margin-bottom: 22px;
  border-radius: 6px; */
  .first-char {
    color: #f5fafe;
    font-size: 18px;
  }
  .close-icon {
    position: absolute;
    top: -3px;
    right: -1px;
    padding: 2px;
    color: #fff;
    font-size: 9px;
    background-color: #c8c8c9;
    border-radius: 50%;
    cursor: pointer;
  }
  .full-name {
    position: absolute;
    bottom: 0;
    bottom: -22px;
    width: 100%;
    height: 22px;
    overflow: hidden;
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
  }
}
</style>
