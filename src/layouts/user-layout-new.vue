<template>
  <div id="userLayout" :class="['user-layout-wrapper']">
    <div class="user-container">
      <!-- <div class="company-logo-wrapper">
        <a href="/">
          <img
            src="~@/assets/image/login/company-logo.png"
            class="company-logo"
            alt="company-logo"
          />
        </a>
      </div> -->
      <div class="login-header-wrapper">
        <a href="/">
          <!--  <img
            src="~@/assets/image/login/company-logo.png"
            class="company-logo"
            alt="company-logo"
          /> -->
        </a>
      </div>

      <!-- <img src="~@/assets/image/login/bg.png" class="login-bg" alt="login-bg" /> -->
      <div style="padding: 15%; margin: 0 auto"></div>

      <router-view />

      <div class="footer">
        <!-- <div class="copyright">{{ $t('pages.login.copyright') }}</div>
        <div class="recommend">
          <span>{{ $t('pages.login.recommend') }}</span>
        </div> -->
        <div class="copyright">
          Copyright &copy; 2025 中车长春轨道客车股份有限公司 All rights reserved.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'UserLayout',
  setup() {
    onMounted(() => {
      document.body.classList.add('userLayout');
    });
    onUnmounted(() => {
      document.body.classList.remove('userLayout');
    });

    return {};
  },
});
</script>

<style>
@media screen and (max-width: 1024px) {
  html {
    font-size: 53px;
  }
}
@media screen and (min-width: 1024px) {
  html {
    font-size: 53px;
  }
}
@media screen and (min-width: 1280px) {
  html {
    font-size: 66px;
  }
}
@media screen and (min-width: 1366px) {
  html {
    font-size: 71px;
  }
}
@media screen and (min-width: 1600px) {
  html {
    font-size: 83px;
  }
}
@media screen and (min-width: 1920px) {
  html {
    font-size: 100px;
  }
}

@media screen and (min-width: 2560px) {
  html {
    font-size: 133px;
  }
}
@media screen and (min-width: 3840px) {
  html {
    font-size: 200px;
  }
}
</style>

<style lang="less" scoped>
@media screen and (max-width: 900px) {
  .user-container {
    .footer {
      justify-content: center !important;
    }
  }
}

@media screen and (max-width: 1024px) {
  .user-container {
    background-image: none !important;
    .main {
      position: absolute;
      top: 45% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
    }
  }
}

#userLayout.user-layout-wrapper {
  height: 100%;
  // background: #dbeaff;
  background-image: url(~@/assets/image/login/bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  overflow: auto;
  &.mobile {
    .user-con tainer {
      .main {
        width: 98%;
        max-width: 368px;
      }
    }
  }
  .user-container {
    // position: relative;
    width: 100%;
    min-width: 400px;
    min-height: 100%;
    padding: 120px 0 120px;
    //background-image: url(~@/assets/image/login/container-bg.png);
    background-color: #fff3;
    background-repeat: no-repeat;
    // background-position: 6.4em 9em;
    background-position: 1.18rem 0.92rem;
    background-size: auto 93.5%;

    a {
      text-decoration: none;
    }

    /* .company-logo-wrapper {
      position: absolute;
      top: 0.28rem;
      left: 0.52rem;
      .company-logo {
        height: 0.48rem;
        vertical-align: top;
        border-style: none;
      }
    } */

    .login-header-wrapper {
      background-image: url(~@/assets/image/login/header.png);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      /* width: 100%;
      height: 3.8vw; */
      width: 2.5rem;
      height: 0.85rem;
      position: absolute;
      /* top: 0;
      left: 0; */
      top: 0.4rem;
      left: 0.55rem;
    }

    .main {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 1.99rem;
      min-width: 5.83rem;
      margin: 0 auto;
      padding: 0.36rem 0.49rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0px 16px 47px 0px rgba(0, 0, 0, 0.08);
    }

    /* .footer {
      position: absolute;
      bottom: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin: 0.84rem 0 0.16rem;
      padding: 0 0.52rem;
      text-align: center;

      .copyright {
        color: #ffffff;
        font-size: 0.2rem;
      }

      .recommend {
        color: #ffffff;
        font-size: 0.2rem;
      }
    } */

    .footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      margin: 48px 0 24px;
      padding: 0 16px;
      text-align: center;

      .links {
        margin-bottom: 8px;
        font-size: 14px;
        a {
          color: @text-color-secondary;
          transition: all 0.3s;
          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }
      .copyright {
        color: @text-color-secondary;
        font-size: 14px;
      }
    }
  }
}
</style>
