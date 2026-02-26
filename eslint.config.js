// ESLint 10 flat config
// Migrated from the previous .eslintrc.js setup

const js = require('@eslint/js')
const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const vuePlugin = require('eslint-plugin-vue')
const vueParser = require('vue-eslint-parser')
const noOnlyTests = require('eslint-plugin-no-only-tests')
const cypressPlugin = require('eslint-plugin-cypress')

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  // Base JS rules
  js.configs.recommended,

  // Ignore build / server output
  {
    ignores: ['dist/*', 'server/*'],
  },

  // App + tests (TS + Vue)
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      vue: vuePlugin,
      'no-only-tests': noOnlyTests,
      cypress: cypressPlugin,
    },
    rules: {
      // Bring in the recommended rule sets similar to the old .eslintrc.js
      ...(tsPlugin.configs.recommended?.rules || {}),
      ...(vuePlugin.configs['vue3-recommended']?.rules || {}),

      // Project-specific overrides (from the old config)
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-ignore': 'allow-with-description',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-namespace': 'off',
      'no-only-tests/no-only-tests': 'error',
    },
  },

  // Node-style config / tooling files
  {
    files: ['**/*.config.{js,cjs,mjs}'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
      },
    },
  },
]

