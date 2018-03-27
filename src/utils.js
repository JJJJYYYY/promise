export const CONFIG = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2
}

export const noop = function () {}

export function isFunction (x) {
  return typeof x === 'function'
}

export function isObjectOrFunction (x) {
  return x !== null && 'object,function'.includes(typeof x)
}
