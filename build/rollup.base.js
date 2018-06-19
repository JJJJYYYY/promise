const babel = require('rollup-plugin-babel')
const eslint = require('rollup-plugin-eslint')

module.exports = {
  input: 'src/promise.js',
  plugins: [
    eslint({
      include: 'src/**',
      throwOnError: true
    }),
    babel({
      include: 'src/**',
      runtimeHelpers: true,
      plugins: ['external-helpers']
    })
  ],
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    sourcemap: true,
    strict: true,
    name: 'Promise'
  },
  external: ['babel-polyfill']
}
