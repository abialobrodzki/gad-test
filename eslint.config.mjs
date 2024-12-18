import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['package-lock.json', 'playwright-report/**', 'test-results/**'] },
  { files: ['**/*.ts'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-console': 'error',
    },
  },
  ...tseslint.configs.recommended,
]
