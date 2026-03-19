<template>
  <page-container>
    <d-page :config="state.configTrees.find(f => f.uid === state.mainConfigTreeId)" />
  </page-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useParserState } from './hooks/useParserState';
import DPage from './components/page.vue';

export default defineComponent({
  name: '',
  setup() {
    const { state } = useParserState();
    return {
      state,
    };
  },
  components: {
    DPage,
  },
});
</script>

<style lang="less" scoped></style>
