// @flow

import { isFunc, isObjectOrFunc, CONFIG, noop, identify } from './utils'
import triggerTick from './tick'

const fulfilledDefaultFun = identify
const rejectedDefaultFun: RejectedHandle = reason => { throw reason }

function getThen <T> (promise: IFPromise<T>, x: any) {
  try {
    return x.then
  } catch (e) {
    reject(promise, e)
  }
}

function addNextTick <T> (promise: IFPromise<T>, result: any) {
  triggerTick(() => {
    let i = 0
    const sequence = promise._sequence
    while (sequence[i]) {
      try {
        // $FlowFixMe
        resolve(sequence[i], (1 && sequence[i + promise._status])(result))
      } catch (e) {
        reject(sequence[i], e)
      }

      i += 3
    }

    promise._sequence = []
  })
}

function fulfill <T> (promise: IFPromise<T>, value: T) {
  if (promise._status === CONFIG.PENDING) {
    addNextTick(promise, value)

    promise._result = value
    promise._status = CONFIG.FULFILLED
  }
}

function readyTick <T> (promise: IFPromise<T>) {
  if (promise._status !== CONFIG.PENDING) addNextTick(promise, promise._result)
}

export function resolve <T> (promise: IFPromise<T>, x: any) {
  if (promise === x) { // x 与 promise 相等
    reject(promise, new TypeError(`参数 [${x}] 不能与 promise 相等`))
  } else if (isObjectOrFunc(x)) {
    const then = getThen(promise, x) // 存储then，以保证 then 单次访问
    if (isFunc(then)) {
      let _alive = true
      try {
        // $FlowFixMe
        then.call(x, function resolvePromise (y) {
          _alive && resolve(promise, y)
          _alive = false
        }, function rejectPromise (r) {
          _alive && reject(promise, r)
          _alive = false
        })
      } catch (e) {
        _alive && reject(promise, e) // then 执行过程出错,若未执行 resolve/reject 则以 reject 处理该 promise
      }
    } else {
      fulfill(promise, x)
    }
  } else {
    fulfill(promise, x)
  }
}

export function reject <T> (promise: IFPromise<T>, reason: any) {
  if (promise._status === CONFIG.PENDING) {
    addNextTick(promise, reason)

    promise._result = reason
    promise._status = CONFIG.REJECTED
  }
}

// 这才是 then 开始
export function then <T> (
  promise: IFPromise<T>,
  onFulfilled: FulfilledHandle<T> = fulfilledDefaultFun,
  onRejected: RejectedHandle = rejectedDefaultFun
): IFPromise<T> {
  const sequence = promise._sequence
  const length = sequence.length
  sequence[length] = new promise.constructor(noop)
  sequence[length + CONFIG.FULFILLED] = isFunc(onFulfilled) ? onFulfilled : fulfilledDefaultFun
  sequence[length + CONFIG.REJECTED] = isFunc(onRejected) ? onRejected : rejectedDefaultFun
  readyTick(promise) // 对于已解决的 promise 需要将结果，在下次 tick 中返回给then

  return sequence[length]
}
