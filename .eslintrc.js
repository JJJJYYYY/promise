module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    onmessage: true,
    postMessage: true,
    importScripts: true,
    describe: true,
    it: true
  },

  extends: [
    'standard',
    "plugin:flowtype/recommended"
  ],
  // add your custom rules here
  rules: {
    "no-debugger": 0,
    "no-unused-expressions": 0
  },
  plugins: [
    "flowtype"
  ]
}
