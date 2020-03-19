module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": ["error", {
      "endOfLine": "auto"
    }], // caso o prettier achar um erro o eslint manda um erro
    "class-methods-use-this": "off",
    "no-param-reassign": "off", // fazer alterações em um parametro
  },
};
