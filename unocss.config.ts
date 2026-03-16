import { defineConfig, presetUno, transformerVariantGroup, transformerDirectives } from 'unocss';

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.vue$/, /\.vue\?vue/, /\.[jt]sx$/, /\.html$/],
    },
  },
  presets: [presetUno()],
  shortcuts: {
    'card-border': ['rounded', 'shadow-sm'],
    'force-break': ['basis-100%', 'max-w-[100%]'],
    'underline-anim': [
      'hover:[&>.text]:bg-left-bottom',
      'hover:[&>.text]:bg-[length:100%_2px]',
      '[&>.text]:bg-gradient-to-r',
      '[&>.text]:from-blue',
      '[&>.text]:to-blue',
      '[&>.text]:bg-no-repeat',
      '[&>.text]:pb-4px',
      '[&>.text]:bg-[length:0_2px]',
      '[&>.text]:bg-right-bottom',
      '[&>.text]:transition-property-[background-size]',
      '[&>.text]:duration-200',
    ],
    'underline-ed': ['!bg-[length:100%_2px]'],
  },
  theme: {
    borderRadius: {
      sm: '4px',
      DEFAULT: '8px',
      md: '12px',
      lg: '16px',
    },
    colors: {
      blue: '#165EFF',
    },
    boxShadow: {
      DEFAULT: '0px 2px 14px 0px rgba(0,0,0,0.08)',
      small: '0px 2px 14px rgba(0,0,0,0.03)',
      card: '0px 0px 7px 0px rgba(0,0,0,0.08)',
    },
    // extend: {},
  },

  rules: [
    ['divider-top', { 'box-shadow': 'inset 0px 1px 0px var(--divider-color)' }],
    [
      'divider-top-bottom',
      {
        'box-shadow':
          'inset 0px 1px 0px var(--divider-color), inset 0px -1px 0px var(--divider-color)',
      },
    ],
    ['divider-bottom', { 'box-shadow': 'inset 0px -1px 0px var(--divider-color)' }],
    ['divider-right', { 'box-shadow': 'inset -1px 0px 0px var(--divider-color)' }],
    ['divider-left', { 'box-shadow': 'inset 1px 0px 0px var(--divider-color)' }],
    ['shadow-right', { 'box-shadow': 'var(--divider-color) -1px 0px inset' }],
    ['shadow-left', { 'box-shadow': 'var(--divider-color) 1px 0px inset' }],
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
});
