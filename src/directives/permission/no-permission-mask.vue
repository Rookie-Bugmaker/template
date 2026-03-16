<template>
  <div class="no-permission">
    <div class="frosted-glass">
      <a-tooltip title="您无权限查看该数据；如需开通权限，请联系系统管理员。">
        <minus-circle-outlined style="color: rgba(0, 0, 0, 0.45); margin-top: 2px" />
        无权限
      </a-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { Tooltip as ATooltip } from 'ant-design-vue';
import { MinusCircleOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  name: '',
  setup() {
    const state = reactive({});
    return {
      state,
    };
  },
  components: {
    ATooltip,
    MinusCircleOutlined,
  },
});
</script>

<style lang="less" scoped>
.no-permission {
  position: relative;
  width: 100%;
  padding: 16px 22px;
  text-align: center;
  background: repeating-linear-gradient(
    70deg,
    #ffffff 0px,
    #ffffff 10px,
    #d9d9d9 0px,
    #d9d9d9 20px
  );
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  .frosted-glass {
    position: absolute;
    top: -1px;
    right: -1px;
    left: -1px;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    text-align: center;
    background: rgba(180, 180, 180, 0.5);
    border-radius: 2px;
    backdrop-filter: blur(1px);
  }
}
</style>
