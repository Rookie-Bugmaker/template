<template>
  <Teleport to="body">
    <transition name="zoom-fade" mode="out-in">
      <div :class="getClass" @click.stop v-if="open">
        <div :class="`${prefixCls}-content`" v-click-outside="handleClose">
          <div :class="`${prefixCls}-input__wrapper`">
            <a-input
              :class="`${prefixCls}-input`"
              :placeholder="t('component.globalSearch.search.placeholder')"
              ref="inputRef"
              allow-clear
              @change="handleSearch"
            >
              <template #prefix>
                <search-outlined />
              </template>
            </a-input>
            <span :class="`${prefixCls}-cancel`" @click="handleClose">
              {{ t('component.globalSearch.cancel') }}
            </span>
          </div>

          <div :class="`${prefixCls}-not-data`" v-show="getIsNotData">
            {{ t('component.globalSearch.noResult') }}
          </div>

          <ul :class="`${prefixCls}-list`" v-show="!getIsNotData" ref="scrollWrap">
            <li
              :ref="setRefs(index)"
              v-for="(item, index) in searchResult"
              :key="index"
              :data-index="index"
              @mouseenter="handleMouseenter"
              @click="handleEnter"
              :class="[
                `${prefixCls}-list__item`,
                {
                  [`${prefixCls}-list__item--active`]: activeIndex === index,
                },
              ]"
            >
              <div
                v-for="(pItem, pIndex) in item.pathItemArray"
                :key="pIndex"
                :class="`${prefixCls}-list__item-child`"
              >
                <span :class="`${prefixCls}-list__item-child-icon`">
                  <icon
                    v-if="pItem.meta?.icon"
                    :name="pItem.meta.icon as string"
                    style="margin-right: 5px"
                  />
                </span>
                <span :class="`${prefixCls}-list__item-child-text`">
                  {{ pItem.itemName }}
                </span>
                <span
                  :class="`${prefixCls}-list__item-child-arrow`"
                  v-if="pIndex !== item.pathItemArray.length - 1"
                >
                  >
                </span>
              </div>
              <div :class="`${prefixCls}-list__item-enter`">
                <enter-outlined />
              </div>
            </li>
          </ul>
          <search-footer />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, unref, ref, watch, nextTick, inject } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import SearchFooter from './search-footer.vue';
import vClickOutside from './directives/click-outside';
import { useRefs } from './hooks/useRefs';
import { useMenuSearch } from './useMenuSearch';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  open: { type: Boolean },
});

const emit = defineEmits(['close']);

const scrollWrap = ref(null);
const inputRef = ref<HTMLElement>(null);

const { t } = useI18n();
const prefixCls = 'global-search-modal';
const [refs, setRefs] = useRefs();
const isMobile = inject('isMobile', ref(false));

const { handleSearch, searchResult, keyword, activeIndex, handleEnter, handleMouseenter } =
  useMenuSearch(refs, scrollWrap, emit);

const getIsNotData = computed(() => !keyword || unref(searchResult).length === 0);

const getClass = computed(() => {
  return [
    prefixCls,
    {
      [`${prefixCls}--mobile`]: unref(isMobile),
    },
  ];
});

watch(
  () => props.open,
  (open: boolean) => {
    open &&
      nextTick(() => {
        unref(inputRef)?.focus();
      });
  },
);

function handleClose() {
  searchResult.value = [];
  emit('close');
}
</script>
<style lang="less" scoped>
@prefix-cls: ~'global-search-modal';
@footer-prefix-cls: ~'global-search-footer';
.@{prefix-cls} {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 800;
  display: flex;
  width: 100%;
  height: 100%;
  padding-top: 50px;
  background-color: rgba(0, 0, 0, 0.25);
  justify-content: center;

  &--mobile {
    padding: 0;

    > div {
      width: 100%;
    }

    .@{prefix-cls}-input {
      width: calc(100% - 38px);
    }

    .@{prefix-cls}-cancel {
      display: inline-block;
    }

    .@{prefix-cls}-content {
      width: 100%;
      height: 100%;
      border-radius: 0;
    }

    .@{footer-prefix-cls} {
      display: none;
    }

    .@{prefix-cls}-list {
      height: calc(100% - 80px);
      max-height: unset;

      &__item {
        &-enter {
          opacity: 0 !important;
        }
      }
    }
  }

  &-content {
    position: relative;
    width: 632px;
    margin: 0 auto auto auto;
    background-color: @component-background;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    flex-direction: column;
  }

  &-input__wrapper {
    display: flex;
    padding: 14px 14px 0 14px;
    justify-content: space-between;
    align-items: center;
  }

  &-input {
    width: 100%;
    height: 48px;
    font-size: 14px;
    color: #1c1e21;
    border-radius: 6px;

    span[role='img'] {
      color: #999;
    }
  }

  &-cancel {
    display: none;
    font-size: 1em;
    color: #666;
  }

  &-not-data {
    display: flex;
    width: 100%;
    height: 100px;
    font-size: 19px;
    color: rgb(150 159 175);
    align-items: center;
    justify-content: center;
  }

  &-list {
    max-height: 472px;
    padding: 0 14px;
    padding-bottom: 20px;
    margin: 0 auto;
    margin-top: 14px;
    overflow: auto;

    &__item {
      position: relative;
      display: flex;
      width: 100%;
      height: 56px;
      padding-bottom: 4px;
      padding-left: 22px;
      margin-top: 8px;
      font-size: 14px;
      color: @text-color;
      cursor: pointer;
      background-color: @component-background;
      border-radius: 4px;
      box-shadow: 0 1px 3px 0 #d4d9e1;
      align-items: center;

      > div:first-child,
      > div:last-child {
        display: flex;
        align-items: center;
      }

      &--active {
        color: #fff;
        background-color: @primary-color;

        .@{prefix-cls}-list__item-enter {
          opacity: 1;
        }
      }

      &-child {
        display: flex;
        align-items: center;
        justify-content: center;
        &-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          > * {
            padding-right: 10px;
          }
        }

        &-text {
          flex: 1;
        }

        &-arrow {
          width: 30px;
          text-align: center;
        }
      }

      &-enter {
        margin-left: auto;
        width: 30px;
        opacity: 0;
      }
    }
  }
}

// zoom-fade
.zoom-fade-enter-active,
.zoom-fade-leave-active {
  transition: transform 0.16s, opacity 0.3s ease-out;
}

.zoom-fade-enter-from {
  opacity: 0;
  transform: scale(0.92);
}

.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(1.06);
}
</style>
