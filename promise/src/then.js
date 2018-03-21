import { isFunction, isObjectOrFunction, CONFIG, noop } from './utils'
import triggerTick from './tick'

function getThen (promise, x) {
  try {
    return x.then
  } catch (e) {
    reject(promise, e)
  }
}

function fulfill (promise, value) {
  if (promise._status === CONFIG.PENDING) {
    triggerTick(() => {
      let i = 0
      let quence = promise._sequence
      while (quence[i]) {
        try {
          resolve(quence[i], (quence[i + CONFIG.FULFILLED] || promise.constructor.resolve)(value))
        } catch (e) {
          reject(quence[i], e)
        }

        i += 3
      }
    })

    promise._status = CONFIG.FULFILLED
  }
}

export function resolve (promise, x) {
  if (promise === x) { // x 与 promise 相等
    reject(promise, new TypeError('x 不能与 promise 相等'))
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
  if (promise._status === CONFIG.PENDING) {
    triggerTick(() => {
      let i = 0
      let quence = promise._sequence
      while (quence[i]) {
        try {
          resolve(quence[i], (quence[i + CONFIG.REJECTED] || promise.constructor.reject)(reason))
        } catch (e) {
          reject(quence[i], e)
        }

        i += 3
      }
    })

    promise._status = CONFIG.REJECTED
  }
}

// 这才是 then 开始
export function then (promise, onFulfilled, onRejected) {
  let sequence = promise._sequence
  let length = sequence.length
  sequence[length] = new promise.constructor(noop)
  sequence[length + CONFIG.FULFILLED] = isFunction(onFulfilled) ? onFulfilled : null
  sequence[length + CONFIG.REJECTED] = isFunction(onRejected) ? onRejected : null

  return sequence[length]
}
