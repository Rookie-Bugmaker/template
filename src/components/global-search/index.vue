<script lang="ts">
import { defineComponent, ref, unref, h } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { IconMagnifier } from '@/components/yl/icon/index';
import SearchModal from './search-modal.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'GlobalSearch',
  setup() {
    const { t } = useI18n();

    const showModal = ref(false);
    function changeModal(show: boolean) {
      showModal.value = show;
    }

    return () =>
      h(
        'span',
        {
          class: 'ant-pro-dropdown ant-pro-dropdown-action icon',
          onClick: changeModal.bind(null, true),
        },
        [
          h(
            Tooltip,
            {
              title: t('component.globalSearch.search'),
            },
            {
              default: () => h(IconMagnifier),
            },
          ),
          h(SearchModal, {
            open: unref(showModal),
            onClose: changeModal.bind(null, false),
          }),
        ],
      );
  },
});
</script>
