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

  static resolve (data: T): Promise<T> {
    return new Promise(resolve => resolve(data))
  }

  static reject (reason: any): Promise<T> {
    return new Promise((resolve, reject) => reject(reason))
  }

  static all (promises: Array<Thenable<T>>): Promise<T> {
    return new Promise((resolve, reject) => {
      const result: T[] = []
      function onFulfilled (value: T, i) {
        result[i] = value
        // $FlowFixMe
        if (result.length === promises.length) resolve(result)
      }

      promises.forEach((p, i) => isThenable(p) && p.then(value => onFulfilled(value, i), reject))
    })
  }

  static race (promises: Array<Thenable<T>>): Promise<T> {
    return new Promise((resolve, reject) =>
      promises.forEach(p => isThenable(p) && p.then(resolve, reject))
    )
  }
}
