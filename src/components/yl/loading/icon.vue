<template>
  <a-icon spin v-bind="$attrs" class="yl-loading-icon">
    <template #component="svgProps">
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        v-bind="svgProps"
      >
        <title>loading</title>
        <defs>
          <linearGradient x1="100%" y1="50%" x2="50%" y2="0%" id="linearGradient-1">
            <stop stop-color="currentColor" offset="0%" stop-opacity="0.6"></stop>
            <stop stop-color="currentColor" offset="30%" stop-opacity="0.7"></stop>
            <stop stop-color="currentColor" offset="70%" stop-opacity="0.8"></stop>
            <stop stop-color="currentColor" offset="100%" stop-opacity="1"></stop>
          </linearGradient>
        </defs>
        <g id="设计规范" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="基础组件" transform="translate(-2565.000000, -2187.000000)">
            <g id="loading" transform="translate(2559.000000, 2181.000000)">
              <g
                transform="translate(6.750000, 6.750000)"
                fill="url(#linearGradient-1)"
                fill-rule="nonzero"
                id="Oval-3"
              >
                <path
                  d="M11.25,-1.99840144e-15 C12.1376005,-1.99840144e-15 12.8571429,0.719542366 12.8571429,1.60714286 C12.8571429,2.49474335 12.1376005,3.21428571 11.25,3.21428571 C6.81199755,3.21428571 3.21428571,6.81199755 3.21428571,11.25 C3.21428571,15.6880025 6.81199755,19.2857143 11.25,19.2857143 C15.6880025,19.2857143 19.2857143,15.6880025 19.2857143,11.25 C19.2857143,10.449345 19.1691009,9.6661513 18.9422693,8.91704698 C18.6850349,8.06753825 19.165168,7.17034566 20.0146768,6.91311123 C20.8641855,6.65587681 21.7613781,7.13601 22.0186125,7.98551873 C22.3366588,9.0358567 22.5,10.1328814 22.5,11.25 C22.5,17.4632034 17.4632034,22.5 11.25,22.5 C5.03679656,22.5 0,17.4632034 0,11.25 C0,5.03679656 5.03679656,-1.99840144e-15 11.25,-1.99840144e-15 Z"
                ></path>
              </g>
              <rect
                id="Rectangle-9"
                fill="#D8D8D8"
                opacity="0"
                x="0"
                y="0"
                width="36"
                height="36"
              ></rect>
            </g>
          </g>
        </g>
      </svg>
    </template>
  </a-icon>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AIcon from '@ant-design/icons-vue';

export default defineComponent({
  name: 'LoadingIcon',
  setup() {
    return {};
  },
  components: {
    AIcon,
  },
});
</script>

<style lang="less" scoped>
.yl-loading-icon {
  color: @primary-color;
}
</style>
