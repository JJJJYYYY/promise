const babel = require('rollup-plugin-babel')
const { eslint } = require('rollup-plugin-eslint')

module.exports = {
  input: 'src/promise.js',
  plugins: [
    eslint({
      include: 'src/**',
      throwOnError: true
    }),
    babel({
      include: 'src/**',
      runtimeHelpers: true
    })
  ],
  output: {
    file: 'dist/promise.js',
    format: 'umd',
    sourcemap: true,
    strict: true,
    name: 'Promise'
  }
}
