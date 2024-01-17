module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off', // Desactivar la regla no-unused-vars
    //estamos indicando a ESLint que permita la declaración de variables dentro de bloques case 
    'no-case-declarations': ['off', { 'ignorePatterns': ['^case\\s+[\\s\\S]+?:'] }],
    'vue/valid-v-slot': ['error', { allowModifiers: true }],//desactivar slot modifier
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
