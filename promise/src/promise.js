import { CONFIG, noop } from './utils'
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

  catch () {
    return new this.constructor(noop)
  }
}
