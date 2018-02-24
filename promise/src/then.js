import { isFunction, isObjectOrFunction, noop, CONFIG } from './utils'

function getThen (promise, x) {
  try {
    return x.then
  } catch (e) {
    reject(promise, e)
  }
}

function fulfill (promise, value) {
  if (promise._status === CONFIG.PENDING) {
    promise._sequence.forEach((q, i) => {
      if ((i + 3) % 3 === CONFIG.FULFILLED && q) {
        q(value)
      }
    })

    promise._status = CONFIG.FULFILLED
  }
}

export function resolve (promise, x) {
  if (promise === x) { // x 与 promise 相等
    reject(promise, new TypeError('x 不能与 promise 相等'))
  } else if (isFunction(x.then)) { // x 为 Promise，这个判断方法应该不正确
    x.then(value => {
      fulfill(promise, value)
    }, reason => {
      reject(promise, reason)
    })
  } else if (isObjectOrFunction(x)) {
    let then = getThen(promise, x)
    if (isFunction(then)) {
      then.call(x, function resolvePromise (y) {
        resolve(promise, y)
      }, function rejectPromise (r) {
        reject(promise, r)
      })
    } else {
      fulfill(promise, x)
    }
  } else {
    fulfill(promise, x)
  }
}

export function reject (promise, reason) {

}

// 这才是 then 开始
export function then (promise, onFulfilled, onRejected) {
  let sequence = promise._sequence
  let length = sequence.length
  sequence[length] = promise
  sequence[length + CONFIG.FULFILLED] = isFunction(onFulfilled) ? onFulfilled : null
  sequence[length + CONFIG.REJECTED] = isFunction(onRejected) ? onRejected : null

  return new promise.constructor(noop)
}
