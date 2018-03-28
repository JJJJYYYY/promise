import { CONFIG, isThenable } from './utils'
import { runPromise } from './run'
import { then } from './then'

export default class Promise {
  constructor (handle) {
    this._status = CONFIG.PENDING

    this._sequence = []

    runPromise(this, handle)
  }

  then (onFulfilled, onRejected) {
    return then(this, onFulfilled, onRejected)
  }

  catch (onRejected) {
    return then(this, null, onRejected)
  }

  finally (onFinally) {
    return then(this, onFinally, onFinally)
  }

  static resolve (data) {
    return new Promise(resolve => resolve(data))
  }

  static reject (reason) {
    return new Promise((resolve, reject) => reject(reason))
  }

  static all (promises) {
    return new Promise((resolve, reject) => {
      let result = []
      function onFulfilled (value) {
        result.push(value)
        if (result.length === promises.length) resolve(result)
      }

      promises.forEach(p => isThenable(p) && p.then(onFulfilled, reject))
    })
  }

  static race (promises) {
    return new Promise((resolve, reject) => {
      promises.forEach(p => isThenable(p) && p.then(resolve, reject))
    })
  }
}
