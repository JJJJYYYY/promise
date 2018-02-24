import { resolve, reject } from './then'

export function runPromise (promise, handle) {
  handle(function _resolve (value) {
    resolve(promise, value)
  }, function _reject (reason) {
    reject(promise, reason)
  })
}
