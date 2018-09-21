const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const rollup = require('rollup')
const uglify = require('uglify-js')
const rollupConfig = require('./rollup.base')

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

build(rollupConfig)

function build (config) {
  const output = config.output
  const { file, banner } = output
  rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then(({ code }) => {
      write(file, code)

      const miniFile = file.replace(/\.js$/, '.min.js')

      var minified = (banner ? banner + '\n' : '') + uglify.minify(code, {
        output: {
          ascii_only: true
        }
      }).code

      write(miniFile, minified, true)
    })
}

function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(chalk.blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      report()
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}
