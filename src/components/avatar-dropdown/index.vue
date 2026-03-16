<template>
  <a-dropdown
    v-if="currentUser"
    class="ant-pro-dropdown ant-pro-dropdown-action"
    placement="bottomRight"
    overlayClassName="pro-components-header-dropdown-index-container"
  >
    <span style="text-wrap: nowrap">
      <!-- <a-avatar
        size="small"
        :src="
          currentUser.avatar ||
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
        "
        class="ant-pro-header-account-avatar"
      /> 
      <span class="ant-pro-header-account-name anticon">{{ currentUser.userName }}</span>-->
      <a-avatar
        class="ant-pro-header-account-avatar"
        size="small"
        :style="{
          color: avatarInfo.color,
          'background-color': avatarInfo.bgColor,
        }"
      >
        {{ avatarInfo?.name?.slice(0, 1) }}
      </a-avatar>
      <span class="ant-pro-header-account-name anticon">
        {{ avatarInfo.name }}
        <template v-if="!isMobile && !avatarInfo.onlyUserName">
          <a-divider type="vertical" />
          <span class="ant-pro-header-user-name">{{ currentUser.userName }}</span>
        </template>
      </span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-dropdown-menu" :selected-keys="[]">
        <!-- <a-menu-item v-if="menu" key="center" @click="handleToCenter">
            <template #icon><user-outlined /></template>
            个人中心
          </a-menu-item>
          <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
            <template #icon><setting-outlined /></template>
            个人设置
          </a-menu-item> -->

        <switch-role key="role" :current-user="currentUser" @switch-role="handleSwitchRole" />

        <switch-company
          key="company"
          :current-user="currentUser"
          @switch-company="handleSwitchCompany"
        />

        <switch-dept key="dept" :current-user="currentUser" @switch-dept="handleSwitchDept" />

        <!-- <switch-org key="org" :current-user="currentUser" @switch-org="handleSwitchOrg" /> -->

        <a-menu-divider v-if="menu" />
        <a-menu-item key="editPwd" @click="editPwdVisible = true">
          <template #icon><form-outlined /></template>
          {{ t('component.avatarDropdown.menuItem.editPwd.text') }}
        </a-menu-item>
        <a-menu-item key="logout" @click="handleLogout">
          <template #icon><logout-outlined /></template>
          {{ t('component.avatarDropdown.menuItem.loginOut.text') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
  <edit-modal
    :open="editPwdVisible"
    @cancel="
      () => {
        if (!canNotClosePwdModal) {
          editPwdVisible = false;
        }
      }
    "
    @ok="
      () => {
        handleLogout();
      }
    "
    :canNotClose="canNotClosePwdModal"
  ></edit-modal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import {
  /* UserOutlined, SettingOutlined,  */ LogoutOutlined,
  FormOutlined,
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/store/user';
import { switchRole, switchOrg, switchCompany, switchDept } from '@/api/system/user/index';
import { notification, message } from 'ant-design-vue';

import SwitchRole from './switch-role.vue';
// import SwitchOrg from './switch-org.vue';
import SwitchCompany from './switch-company.vue';
import SwitchDept from './switch-dept.vue';
import EditModal from './component/editModal.vue';

import { injectMultiTabStore } from '@/components/multi-tab/index';
import { injectMenuState } from '@/layouts/use-menu-state';

import useMediaQuery from '@/utils/hooks/useMediaQuery';
import { stringToColor, getContrastColor } from '@/utils/color';

export default defineComponent({
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null,
    },
    menu: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();

    const colSize = useMediaQuery();
    const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs');

    const avatarInfo = computed(() => {
      const name = userStore?.personInfo?.fullName ?? userStore?.userDescription;
      const userName = userStore?.userName;
      const bgColor = stringToColor(name);
      const color = getContrastColor(bgColor);
      return {
        color,
        bgColor,
        onlyUserName: !name, //是否只有用户名，没有人员姓名或用户描述
        name: name || userName,
      };
    });

    const { t } = useI18n();
    const handleToCenter = () => {
      router.push({ path: '/account/center' });
    };
    const handleToSettings = () => {
      router.push({ path: '/account/settings' });
    };

    const multiTabStore = injectMultiTabStore();
    const { selectedKeys } = injectMenuState();
    const handleLogout = () => {
      //退出登录时清空已选择的选项卡keys(至少保留一个)
      selectedKeys.value = ['/dashboard'];
      userStore.LOGOUT().then(() => {
        //退出登录时清空选项卡列表(至少保留一个)
        multiTabStore.cacheList = multiTabStore.cacheList.filter(f => f.path == '/dashboard');
        //跳转根目录
        router.replace({ path: '/user/login' });
      });
    };

    //用于解决多窗口下，切换组织，其他窗口不刷新问题
    const refreshOtherWindows = () => {
      localStorage.setItem('refreshSignal', new Date().getTime() + '');
    };

    const handleSwitchRole = (roleId: string) => {
      switchRole(roleId)
        .then(({ success, message: msg }) => {
          if (success) {
            notification.success({
              message: () => t('component.avatarDropdown.notification.switchRole.success.message'),
              description: () =>
                t('component.avatarDropdown.notification.switchRole.success.description'),
            });
            // refreshOtherWindows();
            window.location.reload();
          } else {
            message.warning(msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    };

    const handleSwitchOrg = (orgId: string) => {
      switchOrg(orgId)
        .then(({ success, message: msg }) => {
          if (success) {
            notification.success({
              message: () => t('component.avatarDropdown.notification.switchOrg.success.message'),
              description: () =>
                t('component.avatarDropdown.notification.switchOrg.success.description'),
            });
            refreshOtherWindows();
            window.location.reload();
          } else {
            message.warning(msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    };

    const handleSwitchCompany = (companyId: number) => {
      switchCompany(companyId)
        .then(({ success, message: msg }) => {
          if (success) {
            notification.success({
              message: () => t('component.avatarDropdown.notification.switchRole.success.message'),
              description: () =>
                t('component.avatarDropdown.notification.switchRole.success.description'),
            });
            // refreshOtherWindows();
            window.location.reload();
          } else {
            message.warning(msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    };

    const handleSwitchDept = (deptId: number) => {
      switchDept(deptId)
        .then(({ success, message: msg }) => {
          if (success) {
            notification.success({
              message: () => t('component.avatarDropdown.notification.switchRole.success.message'),
              description: () =>
                t('component.avatarDropdown.notification.switchRole.success.description'),
            });
            // refreshOtherWindows();
            window.location.reload();
          } else {
            message.warning(msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    };

    // 修改密码弹窗
    const editPwdVisible = ref<boolean>(false);

    const canNotClosePwdModal = computed(() => {
      return userStore.nextLoginUpdatePassword === 'Y';
    });

    //有密码过期时间则直接弹出提示修改
    onMounted(() => {
      watch(
        [() => userStore.nextLoginUpdatePassword, () => userStore.passwordExpireDate],
        () => {
          if (userStore.nextLoginUpdatePassword === 'Y' || userStore.passwordExpireDate) {
            editPwdVisible.value = true;
          }
        },
        {
          immediate: true,
        },
      );
    });

    return {
      t,
      isMobile,
      avatarInfo,
      handleToCenter,
      handleToSettings,
      handleLogout,
      handleSwitchRole,
      handleSwitchOrg,
      handleSwitchCompany,
      handleSwitchDept,
      editPwdVisible,
      canNotClosePwdModal,
    };
  },
  components: {
    /* UserOutlined,
      SettingOutlined, */
    LogoutOutlined,
    SwitchRole,
    // SwitchOrg,
    SwitchCompany,
    SwitchDept,
    EditModal,
    FormOutlined,
  },
});
</script>

<style lang="less">
body {
  @import '../header-dropdown.less';
  .ant-pro-header-account-name {
    vertical-align: unset;
    .ant-pro-header-user-name {
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .ant-pro-header-account-avatar {
    /* margin: 12px 8px 12px 0;
    color: @primary-color;
    vertical-align: top;
    background: hsla(0, 0%, 100%, 0.85); */
    margin-bottom: 3px !important;
    margin-right: 6px !important;
    .ant-avatar-string {
      font-size: 14px !important;
    }
  }
}
</style>
