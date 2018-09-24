// @flow

import { resolve, reject } from './then'

export function runPromise <T> (promise: IFPromise<T>, handle: Function) {
  try {
    handle(function _resolve (value?: T) {
      resolve(promise, value)
    }, function _reject (reason: any) {
      reject(promise, reason)
    })
  } catch (e) {
    reject(promise, e)
  }
}
