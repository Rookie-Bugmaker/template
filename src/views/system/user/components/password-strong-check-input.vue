<template>
  <a-input
    class="password-strong-check-input"
    v-model:value="inputValue"
    :type="visibilityToggle ? 'text' : 'password'"
    autocomplete="new-password"
  >
    <template #suffix>
      <template v-if="!!inputValue">
        <a-popover title="用户密码要求">
          <template #content>
            <p class="mb-3px">
              1、密码组成字符包括以下四类:数字、大写字母、小写字母、特殊字符，必须包含三种字符及以上
            </p>
            <p class="mb-3px">2、密码长度为8至16位，密码不能包含账号</p>
            <p class="mb-3px">3、连续3位及以上数字不能连号(例如123、654)</p>
            <p class="mb-3px">4、连续3位及以上字母不能连续(例如abc、cba)</p>
            <p class="mb-3px">5、密码不能包含连续3个及以上相同字符(例如aaa、rrr)</p>
            <p class="mb-3px">6、密码不能包含用户名、姓名全拼</p>
          </template>
          <loading-outlined v-show="loading" />
          <span v-show="!loading" :style="`color:${levelMap[level]?.color}`">
            {{ levelMap[level]?.text() }}
          </span>
        </a-popover>
      </template>
      <span class="icon-eye" @click="() => (visibilityToggle = !visibilityToggle)">
        <eye-outlined v-if="visibilityToggle" />
        <eye-invisible-outlined v-else />
      </span>
    </template>
  </a-input>
</template>

<script lang="ts">
import { defineComponent, ref, watch, watchEffect } from 'vue';
import { message } from 'ant-design-vue';
import { LoadingOutlined } from '@ant-design/icons-vue';
import { passwordStrongCheck } from '@/api/system/user';
import { debounce } from 'lodash';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'PasswordStrongCheckInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    passwordLevel: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue', 'update:passwordLevel'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const loading = ref(false);
    const inputValue = ref('');
    const level = ref(0);
    const visibilityToggle = ref(false);

    watch(
      () => props.modelValue,
      n => {
        inputValue.value = n;
      },
      { immediate: true },
    );

    watch(
      () => props.passwordLevel,
      n => {
        level.value = n;
      },
      { immediate: true },
    );

    /**
     * 字符类型：数字、小写字母、大写字母、特殊字符。
     * 密码强度：
     * 0：非常弱(长度<8位)
     * 1：弱(长度>=8位，并且只存在一种字符)
     * 2：中(长度>=8位，并且由2种字符组成)
     * 3：强(长度>=8位，并且由3种字符组成)
     * 4：非常强(长度>=8位，并且由4种字符组成)
     */
    const levelMap = {
      0: { color: 'red', text: () => t('view.system.user.modal.password.veryWeak.Level') },
      1: { color: 'orange', text: () => t('view.system.user.modal.password.weak.Level') },
      2: { color: '#2f54eb', text: () => t('view.system.user.modal.password.middle.Level') },
      3: { color: '#a0d911', text: () => t('view.system.user.modal.password.strong.Level') },
      4: { color: 'green', text: () => t('view.system.user.modal.password.veryStrong.Level') },
    };

    const checkPassword = debounce((val: string) => {
      if (val) {
        //密码长度小于8,强度为0
        if (val.length < 8) {
          level.value = 0;
        } else {
          loading.value = true;
          passwordStrongCheck(val)
            .then(({ success, result, message: msg }) => {
              if (success) {
                level.value = result;
              } else {
                level.value = 0;
                message.warning(msg);
              }
            })
            .catch(err => {
              console.error(err);
            })
            .finally(() => {
              loading.value = false;
            });
        }
      }
    }, 600);

    watch(
      () => inputValue.value,
      n => {
        checkPassword(n);
      },
      { immediate: true },
    );

    watchEffect(() => {
      emit('update:modelValue', inputValue.value);
      emit('update:passwordLevel', level.value);
    });

    return {
      t,
      levelMap,
      loading,
      inputValue,
      level,
      visibilityToggle,
      //handleChangeValue,
    };
  },
  components: {
    LoadingOutlined,
  },
});
</script>

<style lang="less" scoped>
.password-strong-check-input {
  .icon-eye {
    margin-left: 5px;
    color: #00000073;
    cursor: pointer;
    &:hover {
      color: #000000d9;
    }
  }
}
</style>
