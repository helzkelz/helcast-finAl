const js = require('@eslint/js');// eslint.config.js

const globals = require('globals');const js = require('@eslint/js');

const globals = require('globals');

module.exports = [

  js.configs.recommended,module.exports = [

  {  js({

    files: ['**/*.ts', '**/*.tsx'],    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {    languageOptions: {

      parser: require.resolve('@typescript-eslint/parser'),      globals: {

      parserOptions: {        ...globals.browser,

        ecmaVersion: 'latest',        ...globals.node,

        sourceType: 'module',      },

        ecmaFeatures: { jsx: true },      parserOptions: {

      },        ecmaVersion: 'latest',

      globals: {        sourceType: 'module',

        ...globals.browser,        ecmaFeatures: { jsx: true },

        ...globals.node,      },

      },    },

    },    rules: {

    plugins: {      semi: ['error', 'always'],

      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),      quotes: ['error', 'single'],

      react: require('eslint-plugin-react'),      'no-unused-vars': 'warn',

    },      'react/jsx-uses-react': 'off',

    rules: {      'react/react-in-jsx-scope': 'off',

      semi: ['error', 'always'],    },

      quotes: ['error', 'single'],  }),

      'no-unused-vars': 'warn',];

      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
];
