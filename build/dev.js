const chalk = require('chalk')
const rollup = require('rollup')
const rollupConfig = require('./rollup.base')

const watcher = rollup.watch(rollupConfig)

watcher.on('event', event => {
  switch (event.code) {
    case 'START':
      console.log('> Build start')
      break
    case 'BUNDLE_START':
      console.log(chalk.cyan('> Build...'))
      break
    case 'BUNDLE_END':
      console.log(chalk.green('> Build success'))
      break
    case 'END':
      console.log(chalk.gray(new Date().toLocaleString()))
      console.log(chalk.gray('-'.repeat(50)))
      break
    default:
      console.log(chalk.red('> Build fail'))
      console.log(event)
      console.log(chalk.gray(new Date().toLocaleString()))
      console.log(chalk.gray('-'.repeat(50)))
  }
})
