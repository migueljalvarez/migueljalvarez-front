// @ts-nocheck
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

import withNuxt from './.nuxt/eslint.config.mjs'
export default withNuxt([
  {
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      // 🌐 Estilo HTML en componentes Vue
      'vue/html-self-closing': [
        'error',
        {
          html: { normal: 'always', void: 'always', component: 'always' },
          svg: 'always',
          math: 'always'
        }
      ],

      // 🧱 Orden de atributos en los templates
      'vue/attributes-order': [
        'warn',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT'
          ]
        }
      ],

      // 💡 Reglas de buenas prácticas JS/TS
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'off', // se puede desactivar porque TypeScript lo controla

      // 🧪 Buenas prácticas TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // 🧠 Reglas Vue Composition API
      'vue/no-setup-props-destructure': 'off', // desactiva si prefieres destructuring
      'vue/multi-word-component-names': 'off', // permite nombres de un solo palabra (ej: Index.vue)

      // 💅 Estética de código
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'only-multiline'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'object-curly-spacing': ['error', 'always'],

      'prettier/prettier': 'warn'
    }
  },
  prettierConfig
])
