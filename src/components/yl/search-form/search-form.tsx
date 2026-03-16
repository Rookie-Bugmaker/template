import { ref, reactive, onMounted, nextTick, defineComponent, h } from 'vue';
import type { FunctionalComponent } from 'vue';

const SearchFormWrapper: FunctionalComponent<any, ['collapse', 'search', 'reset']> = (
  props,
  { attrs, emit, slots },
) => {
  return (
    <a-form style="padding:10px;" {...attrs}>
      <a-row gutter={[16, 0]}>
        {slots.default()}
        <a-col flex="auto">
          <a-form-item wrapper-col={{ span: 24 }} class="search-form-query-item">
            <a-space>
              <a-button
                type="link"
                onClick={() => {
                  emit('collapse');
                }}
              >
                {props.collapse ? <downOutlined /> : <up-outlined />}
                {props.collapse ? '展开' : '收起'}
              </a-button>
              <yl-button
                act-type="search"
                html-type="submit"
                onClick={() => {
                  emit('search');
                }}
              ></yl-button>
              <yl-button
                act-type="reset"
                onClick={() => {
                  emit('reset');
                }}
              ></yl-button>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  );
};

const SearchForm = defineComponent({
  name: 'YlSearchForm',
  props: {
    //默认展示项
    maxCount: {
      type: Number,
      default: 2,
    },
    //默认折叠
    defaultCollapse: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['search', 'reset'],
  setup: (props, { attrs, slots, emit }) => {
    const searchFormRef = ref(null);
    const initState = () => ({
      collapse: props.defaultCollapse,
      foldHeight: 0, //收起时的高度
      unfoldHeight: 0, //展开后的高度
    });
    const state = reactive(initState());

    const collapseForm = () => {
      if (state.collapse) {
        if (state.unfoldHeight) {
          state.collapse = false;
          //已经展开过，直接用记录高度
          requestAnimationFrame(() => {
            searchFormRef.value.style.height = `${state.unfoldHeight}px`;
          });
        } else {
          //第一次展开
          //先设置auto,自动展开至最大高度
          searchFormRef.value.style.height = 'auto';
          state.collapse = false;
          nextTick(() => {
            //获取展开后的高度，记录展开后的高度(不支持动态高度，动态高度需要每次获取，频繁回流影响性能)
            state.unfoldHeight = searchFormRef.value.offsetHeight;
            //获取展开后的高度后，设置成收起高度
            searchFormRef.value.style.height = `${state.foldHeight}px`;
            //下一帧后设置成展开高度，触发动画
            requestAnimationFrame(() => {
              searchFormRef.value.style.height = `${state.unfoldHeight}px`;
            });
          });
        }
      } else {
        if (state.foldHeight) {
          state.collapse = true;
          //已经收起过，直接用记录高度
          requestAnimationFrame(() => {
            searchFormRef.value.style.height = `${state.foldHeight}px`;
          });
        } else {
          //第一次收起
          //先设置auto
          searchFormRef.value.style.height = 'auto';
          state.collapse = true;
          nextTick(() => {
            //获取收起后的高度，记录收起后的高度(不支持动态高度，动态高度需要每次获取，频繁回流影响性能)
            state.foldHeight = searchFormRef.value.offsetHeight;
            //获取收起后的高度后，设置成展开高度
            searchFormRef.value.style.height = `${state.unfoldHeight}px`;
            //下一帧后设置成收起高度，触发动画
            requestAnimationFrame(() => {
              searchFormRef.value.style.height = `${state.foldHeight}px`;
            });
          });
        }
      }
    };

    onMounted(() => {
      nextTick(() => {
        if (props.defaultCollapse) {
          //获取初始化收起时的高度
          state.foldHeight = searchFormRef.value?.offsetHeight;
        } else {
          //获取初始化展开时的高度
          state.unfoldHeight = searchFormRef.value?.offsetHeight;
        }
      });
    });

    return () =>
      h(
        'div',
        {
          ref: searchFormRef,
          style: 'transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s;overflow:hidden;',
        },
        h(
          SearchFormWrapper,
          {
            ...attrs,
            collapse: state.collapse,
            onCollapse: () => {
              collapseForm();
            },
            onSearch: () => {
              emit('search');
            },
            onReset: () => {
              emit('reset');
            },
          },
          {
            default: () =>
              state.collapse ? slots?.default?.().slice(0, props.maxCount) : slots?.default?.(),
          },
        ),
      );
  },
});

export default SearchForm;
