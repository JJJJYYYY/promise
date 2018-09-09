import { isFunction, isObjectOrFunction, CONFIG, noop } from './utils'
import triggerTick from './tick'

const fulfilledDefaultFun = value => value
const rejectedDefaultFun = reason => { throw reason }

function getThen (promise, x) {
  try {
    return x.then
  } catch (e) {
    reject(promise, e)
  }
}

function addNextTick (promise, result) {
  triggerTick(() => {
    let i = 0
    let quence = promise._sequence
    while (quence[i]) {
      try {
        resolve(quence[i], (true && quence[i + promise._status])(result))
      } catch (e) {
        reject(quence[i], e)
      }

      i += 3
    }

    promise._sequence = []
  })
}

function fulfill (promise, value) {
  if (promise._status === CONFIG.PENDING) {
    addNextTick(promise, value)

    promise._result = value
    promise._status = CONFIG.FULFILLED
  }
}

function readyTick (promise) {
  if (promise._status !== CONFIG.PENDING) addNextTick(promise, promise._result)
}

export function resolve (promise, x) {
  if (promise === x) { // x 与 promise 相等
    reject(promise, new TypeError('x 不能与 promise 相等'))
  } else if (isObjectOrFunction(x)) {
    let then = getThen(promise, x) // 存储then，以保证 then 单次访问
    if (isFunction(then)) {
      let alive = true
      try {
        then.call(x, function resolvePromise (y) {
          alive && resolve(promise, y)
          alive = false
        }, function rejectPromise (r) {
          alive && reject(promise, r)
          alive = false
        })
      } catch (e) {
        alive && reject(promise, e) // then 执行过程出错,若未执行resolve/reject则以reject处理该promise
      }
    } else {
      fulfill(promise, x)
    }
  } else {
    fulfill(promise, x)
  }
}

export function reject (promise, reason) {
  if (promise._status === CONFIG.PENDING) {
    addNextTick(promise, reason)

    promise._result = reason
    promise._status = CONFIG.REJECTED
  }
}

// 这才是 then 开始
export function then (promise, onFulfilled, onRejected) {
  let sequence = promise._sequence
  let length = sequence.length
  sequence[length] = new promise.constructor(noop)
  sequence[length + CONFIG.FULFILLED] = isFunction(onFulfilled) ? onFulfilled : fulfilledDefaultFun
  sequence[length + CONFIG.REJECTED] = isFunction(onRejected) ? onRejected : rejectedDefaultFun
  readyTick(promise) // 对于已解决的 promise 需要将结果，在下次 tick 中返回给then

  return sequence[length]
}
