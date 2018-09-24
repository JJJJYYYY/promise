// @flow

import { CONFIG, isThenable, identify } from './utils'
import { runPromise } from './run'
import { then } from './then'

export default class Promise<T> implements IFPromise<T> {
  _status: number
  _sequence: Sequence<T> = []

  constructor (handle: PromiseHandle<T>) {
    this._status = CONFIG.PENDING

    runPromise(this, handle)
  }

  then (onFulfilled: FulfilledHandle<T>, onRejected: RejectedHandle): IFPromise<T> {
    return then(this, onFulfilled, onRejected)
  }

  catch (onRejected: RejectedHandle): IFPromise<T> {
    return then(this, identify, onRejected)
  }

  finally (onFinally: FulfilledHandle<T> | RejectedHandle): IFPromise<T> {
    return then(this, onFinally, onFinally)
  }

  static resolve (data?: T): Promise<T> {
    return new Promise(resolve => resolve(data))
  }

  static reject (reason: any): Promise<T> {
    return new Promise((resolve, reject) => reject(reason))
  }

  static all (promises: Array<T | Thenable<T>>): Promise<T> {
    return new Promise((resolve, reject) => {
      const result: T[] = []
      let num = 0
      function onFulfilled (value: T, i) {
        result[i] = value
        num++
        // $FlowFixMe
        if (num === promises.length) resolve(result)
      }

      // $FlowFixMe
      promises.forEach((p, i) => isThenable(p) ? p.then(value => onFulfilled(value, i), reject) : onFulfilled(p, i))
    })
  }

  static race (promises: Array<T | Thenable<T>>): Promise<T> {
    return new Promise((resolve, reject) =>
      // $FlowFixMe
      promises.forEach(p => isThenable(p) ? p.then(resolve, reject) : resolve(p))
    )
  }
}
