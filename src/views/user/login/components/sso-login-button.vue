<template>
  <template v-if="configList.length">
    <template v-if="configList.length > 1">
      <a-dropdown class="sso-login-btn">
        <a @click.prevent>
          认证登录
          <DownOutlined />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item v-for="item in configList" :key="item.id">
              <a class="login-link" :href="buildSsoAuthPath(item)" target="_self">
                <img :src="previewPath + item.fileId" />
                {{ item.configName }}
              </a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
    <a v-else class="login-link" :href="buildSsoAuthPath(configList[0])" target="_self">
      <img :src="previewPath + configList[0].fileId" />
      {{ configList[0].configName }}
    </a>
  </template>
</template>

<script lang="ts" setup>
import { useSsoLogin } from '../../hooks/useSsoLogin';
import { buildSsoAuthPath } from '../../utils';

const { configList, getConfigList } = useSsoLogin();
getConfigList(process.env.VUE_APP_PROJECT_CODE);

const environment = process.env.VUE_APP_API_URL;
const previewPath = `${environment}/file/preview?fileId=`;
</script>

<style lang="less" scoped>
.login-link {
  display: flex;
  align-items: center;
  img {
    height: 24px;
    width: 24px;
    margin-right: 8px;
  }
}
</style>
