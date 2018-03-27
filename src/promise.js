import { CONFIG } from './utils'
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

  static resolve (data) {
    return new Promise(resolve => resolve(data))
  }

  static reject (reason) {
    return new Promise((resolve, reject) => reject(reason))
  }
}
