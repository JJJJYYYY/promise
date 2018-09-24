import tests from 'promises-aplus-tests'
import Promise from '../dist/promise'

const adapter = {
  deferred () {
    let _resolve, _reject
    const promise = new Promise((resolve, reject) => {
      _resolve = resolve
      _reject = reject
    })
    return {
      promise,
      resolve: _resolve,
      reject: _reject
    }
  },
  resolve: Promise.resolve,
  reject: Promise.reject
}

tests.mocha(adapter)
