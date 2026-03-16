import { reactive, provide, inject, watchEffect, onUnmounted, ref, watch, computed } from 'vue';
import type {
  PopupEditSingleContext,
  PopupEditMultiContext,
  Options,
  PopupEditAction,
  EmitEvent,
  Value,
} from './typing';
import { Form } from 'ant-design-vue';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { POPUP_EDIT_STATE_KEY } from './keys';
import { isArray, debounce, trim } from 'lodash';

type SingleStateOrMultiState<T extends boolean> = PopupEditAction<
  T extends true ? PopupEditMultiContext : PopupEditSingleContext
>;

export function usePopupEdit<T extends boolean>(
  props: {
    options: Options;
    multiple: T;
    valueType: 'string' | 'array';
    pageSize: number;
    value: Value;
    skipFirstBring?: boolean;
  },
  emitEvent: EmitEvent,
): SingleStateOrMultiState<T> {
  //暂不支持响应式，直接结构
  const { options, multiple, valueType, pageSize } = props;
  //获取实时value值
  const val = computed(() => props.value);
  //初始化state值
  const initState = () => {
    const baseState = {
      loading: false,
      modalVisible: false,
      initRenderModal: false, //默认初始化组件时不渲染modal
      //实际控件的选中值及选中行
      selectedKeys: [],
      selectedRows: [],
      //临时记录选中值与选中行
      tempSelectedKeys: [],
      tempSelectedRows: [],
    };
    const multiState: PopupEditMultiContext = {
      multiple: true,
      ...baseState,
    };
    const singleState: PopupEditSingleContext = {
      multiple: false,
      ...baseState,
    };
    return multiple ? multiState : singleState;
  };

  const state = reactive(initState());

  //临时记录值始终等于控件当前选中值
  const stop = watchEffect(
    () => {
      state.tempSelectedKeys = state.selectedKeys;
      state.tempSelectedRows = state.selectedRows;
    },
    {
      flush: 'post',
    },
  );

  onUnmounted(() => {
    //卸载时停止监听
    stop();
  });

  //确认选择，并改变控件值（单选时选中直接触发，多选时需要点确认触发）
  const confirmSelect = () => {
    state.selectedKeys = state.tempSelectedKeys;
    state.selectedRows = state.tempSelectedRows;

    //多选根据valueType返回string或者array，单选取第0条
    const v =
      state.multiple === true
        ? valueType === 'string'
          ? state.selectedKeys.join(',')
          : state.selectedKeys
        : state.selectedKeys[0];

    const r = state.multiple === true ? state.selectedRows : state.selectedRows[0];

    emitEvent.updateValue(v);
    emitEvent.change(v, r);
    emitEvent.select(v, r);
    emitEvent.bring(v, r);

    state.modalVisible = false;
  };

  //清除控件值
  const clearValue = () => {
    const v = state.multiple === true ? (valueType === 'array' ? [] : null) : null;

    emitEvent.updateValue(v);
    emitEvent.change(v, v);
    emitEvent.select(v, v);
    emitEvent.bring(v, v);
    emitEvent.clear();

    //清空输入值
    textInputValue.value = '';
  };

  //多选模式(只有多选才会触发)下的反选，删除项，全部清除，都会触发此方法
  const handleDeselect = value => {
    //删除反选的行数据
    const index = state.selectedRows.findIndex(k => k[options.valueField] == value);
    if (index !== -1) {
      state.selectedRows.splice(index, 1);
    }
    //反选触发相应事件
    const v = valueType === 'string' ? state.selectedKeys.join(',') : state.selectedKeys;
    emitEvent.updateValue(v);
    emitEvent.change(v, state.selectedRows);
    emitEvent.bring(v, state.selectedRows);
    //全部清空触发clear
    if (state.selectedKeys.length === 0) {
      emitEvent.clear();
    }
  };

  //根据一个或多个id查询结果
  const queryById = value => {
    state.loading = true;
    //这里的getDataById，单选时需要返回一个对象，多选时需要返回一个数组（实际多选时此接口应该叫getDataByIds，这里没做区分）
    options
      .getDataById(value)
      .then(({ success, result }) => {
        if (success && result) {
          //防止在初始化是，value值连续变化引起的bug（一开始是有值的，然后在getDataById执行过程中，value值清空了）
          //需要拿到实时的value值（val）进行判断，函数入参的value为非响应式
          const v = val.value;
          if (
            ![undefined, null, ''].includes(v as any) ||
            (multiple === true && (v as (string | number)[])?.length)
          ) {
            //兼容数据，都转成字符串；因为超长数字后端返回的是string，普通数字返回的是number(主要还是后端的问题，同一个字段的返回类型不统一)
            const resultArray = (isArray(result) ? result : [result]).map(m => {
              m[options.valueField] += '';
              return m;
            });
            state.selectedKeys = resultArray.map(m => m[options.valueField]);
            state.selectedRows = resultArray;
            //查出当前控件值后，带出相关数据
            if (!props.skipFirstBring) {
              emitEvent.bring(
                multiple ? state.selectedKeys : state.selectedKeys[0],
                multiple ? state.selectedRows : state.selectedRows[0],
              );
            }
            //TODO:如果返回的结果数比传递的id数多，说明后端查询异常，需要弹error
          }
        } else {
          state.selectedKeys = [];
          state.selectedRows = [];
          clearValue();
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        state.loading = false;
      });
  };

  //初始化input显示值
  const initValueInfo = (value: any) => {
    if (state.multiple === true) {
      // string | array 都可以用此判断是否有值
      if (!value?.length) {
        state.selectedKeys = [];
        state.selectedRows = [];
        clearValue();
      } else {
        queryById(value);
      }
    } else {
      //防止value为0的情况
      if ([undefined, null, ''].includes(value)) {
        state.selectedKeys = [];
        state.selectedRows = [];
        clearValue();
      } else {
        queryById(value);
      }
    }
  };

  //初始化查询参数
  const initValues = () => {
    return options.searchFormFields?.reduce((obj, item) => {
      obj[item.field] = item.defaultValue || null;
      return obj;
    }, {});
  };
  const queryParams = reactive(initValues());

  const rulesRef = reactive({
    // 注意如果数据类型不相同，一定要指定数据类型 `type` 否则会校验失败
    // userName: [{ required: true, message: '用户名必须填写' }],
  });

  const { resetFields, validateInfos } = Form.useForm(queryParams, rulesRef);

  const fetchDataContext = reactive({
    page: 1,
    pageSize: pageSize,
    stripe: false,
    requestParams: queryParams,
  });
  const { reload: reloadTable, context: tableState } = useFetchData(
    async params => {
      const res = await options.getDataByPage(params);
      const { success, result } = res;
      if (success && result) {
        //兼容数据，都转成字符串；因为超长数字后端返回的是string，普通数字返回的是number(主要还是后端的问题，同一个字段的返回类型不统一)
        result.rows.forEach(e => {
          e[options.valueField] += '';
        });
      }
      return res;
    },
    fetchDataContext,
    {
      autoFetch: false,
      onValidateParams: options?.onValidateParams,
    },
  );
  const handleTableChange = ({ current: page, pageSize }) => {
    tableState.page = page;
    tableState.pageSize = pageSize;
  };

  //输入框输入值
  const textInputValue = ref('');

  //选中数据变化时，更新显示值
  watch(
    () => state.selectedRows,
    n => {
      //仅单选时需要这样监听赋值
      if (state.multiple === false) {
        if (n?.length) {
          textInputValue.value = n[0]?.[options.textField];
        } else {
          textInputValue.value = '';
        }
      }
    },
  );

  //根据输入框值搜索对应的值，并赋值或弹出选择
  const searchDataByTextInput = debounce(textValue => {
    state.loading = true;
    const searchField = options.searchTextField || options.textField;
    queryParams[searchField] = textValue;
    reloadTable()
      .then(() => {
        const length = tableState.dataSource.length;
        //如果查询结果只有一条，则直接选中
        if (length === 1) {
          const targetData = tableState.dataSource[0];
          state.tempSelectedKeys = [targetData[options.valueField]];
          state.tempSelectedRows = [targetData];
          confirmSelect();
          //如果直接选中，则可以清除查询条件
          queryParams[searchField] = null;
        } else {
          //如果查询结果有多条，或者0条，则直接弹出modal,并清空选择值和输入值
          state.initRenderModal = true;
          state.modalVisible = true;
          clearValue();
        }
      })
      .finally(() => {
        state.loading = false;
      });
  }, 600);

  //单选情况下（单选且没禁用输入框的情况下才能输入），监听用户输入输入框变化
  const handleUpdateTextInputValue = (textValue: string) => {
    //去除前后空格
    const v = trim(textValue);
    textInputValue.value = v;
    if (v?.length) {
      //如果有输入内容则搜索
      searchDataByTextInput(v);
    } else {
      //清空输入框则清空选中值
      clearValue();
    }
  };

  provide(POPUP_EDIT_STATE_KEY, {
    options,
    state,
    confirmSelect,
    clearValue,
    handleDeselect,
    queryById,
    initValueInfo,
    queryParams,
    resetFields,
    validateInfos,
    tableState,
    reloadTable,
    handleTableChange,
    textInputValue,
    handleUpdateTextInputValue,
  });

  return {
    options,
    state: state as any,
    confirmSelect,
    clearValue,
    handleDeselect,
    queryById,
    initValueInfo,
    queryParams,
    resetFields,
    validateInfos,
    tableState,
    reloadTable,
    handleTableChange,
    textInputValue,
    handleUpdateTextInputValue,
  };
}

export function injectPopupEditState() {
  return inject(POPUP_EDIT_STATE_KEY);
}
