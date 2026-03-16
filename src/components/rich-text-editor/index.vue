<template>
  <div class="rick-text-editor">
    <div ref="editorRef" :style="{ height: height + 'px' }"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请输入内容',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  height: {
    type: Number,
    default: 280,
  },
  /* maxHeight: {
    type: Number,
    default: 500,
  },
  minHeight: {
    type: Number,
    default: 200,
  }, */
});

const emit = defineEmits(['update:value']);

let quill = null;

const editorRef = ref<HTMLElement | null>(null);

const defaultToolbar = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'], // remove formatting button

  ['image'], // image upload button
];

const options = () => {
  return {
    modules: {
      toolbar: props.disabled ? false : defaultToolbar,
    },
    placeholder: props.placeholder,
    theme: props.disabled ? 'bubble' : 'snow',
  };
};

onMounted(() => {
  quill = new Quill(editorRef.value, options());
  quill.on('text-change', () => {
    emit('update:value', JSON.stringify(quill.getContents()));
  });

  watch(
    () => props.value,
    newVal => {
      if (newVal && newVal !== JSON.stringify(quill.getContents())) {
        quill.setContents(JSON.parse(newVal));
      } else if (!newVal) {
        quill.setText('');
      }
    },
    {
      immediate: true,
    },
  );

  watch(
    () => props.disabled,
    newVal => {
      quill.enable(!newVal);
    },
    {
      immediate: true,
    },
  );
});

onUnmounted(() => {
  quill = null;
});
</script>

<style lang="less" scoped>
.rick-text-editor {
  :deep(.ql-toolbar) {
    border-color: #d9d9d9 !important;
    // border-bottom: 0;
    border-radius: 6px 6px 0 0;
    transition: border 0.2s, box-shadow 0.2s;

    & + .ql-container {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
  .ql-container {
    border-color: #d9d9d9;
    border-radius: 6px;
    transition: border 0.2s, box-shadow 0.2s;
    overflow-y: auto;
  }
}
</style>
