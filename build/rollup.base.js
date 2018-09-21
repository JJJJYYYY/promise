const babel = require('rollup-plugin-babel')
const flow = require('rollup-plugin-flow')
const { eslint } = require('rollup-plugin-eslint')
const config = require('../package.json')

const banner =
  '/**\n' +
  ' * ' + config.name + ' v' + config.version + '\n' +
  ' * author: ' + config.author + '\n' +
  ' */'

module.exports = {
  input: 'src/promise.js',
  plugins: [
    eslint({
      include: 'src/**',
      throwOnError: true
    }),
    flow(),
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
    name: 'Promise',
    banner
  }
}
