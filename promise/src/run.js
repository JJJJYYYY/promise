import { resolve, reject } from './then'

export function runPromise (promise, handle) {
  try {
    handle(function _resolve (value) {
      resolve(promise, value)
    }, function _reject (reason) {
      reject(promise, reason)
    })
  } catch (e) {
    reject(promise, e)
  }
}
