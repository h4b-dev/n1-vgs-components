module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:import/react'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: {
    react: { version: '18.2' },
    'import/resolver': {
      vite: {
        configPath: './vite.config.js',
      },
    },
    'import/ignore': ['~icons/*'],
  },
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': [
      1,
      {
        singleQuote: true,
        semi: false,
        tabWidth: 2,
      	printWidth: 120,
	jsxBracketSameLine: true,
      },
    ],
    'linebreak-style': ['error', 'unix'],
    'arrow-body-style': 0,
    'prefer-arrow-callback': 0,
    'global-require': 0,
    'import/prefer-default-export': 0,
    'no-restricted-exports': [1, { restrictedNamedExports: [''] }],
    'react/function-component-definition': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-props-no-spreading': [
      'error',
      {
        html: 'ignore',
        custom: 'ignore',
        exceptions: [''],
      },
    ],
    'react/prop-types': ['off']
    // 'import/no-unresolved': [2, { ignore: ['~icons/*'] }],
    // 'import/extensions': [0, 'always', { ignorePackages: true }],
  },
}
