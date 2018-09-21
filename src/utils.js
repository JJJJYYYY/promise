// @flow

export const CONFIG = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2
}

export const noop = function () {}

export const identify = (_: any) => _

export function isDef (x: any) {
  return x !== null && x !== undefined
}

const _toString = Object.prototype.toString
export function isError (x: any) {
  return _toString.call(x) === '[object Error]'
}

export function isProcess (x: any) {
  return _toString.call(x) === '[object process]'
}

export function isFunc (x: any) {
  return typeof x === 'function'
}

export function isObjectOrFunc (x: any) {
  return x !== null && 'object,function'.includes(typeof x)
}

export function isThenable (x: any) {
  return isObjectOrFunc(x) && isFunc(x.then)
}
