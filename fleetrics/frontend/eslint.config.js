import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // Ignore build output
  { ignores: ['dist'] },

  // Frontend (React) config
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // Backend (Node.js) config for src/services
  {
    files: ['src/services/**/*.js', 'server.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node, // Enable Node.js globals like process
      },
      sourceType: 'module',
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
]
