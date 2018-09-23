// @flow

import { noop } from './utils'

let browserGlobal = (typeof window !== 'undefined') ? window : {}
const BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver
const isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]'

// test for web worker but not in IE10
const isWorker = typeof Uint8ClampedArray !== 'undefined' &&
  typeof importScripts !== 'undefined' &&
  typeof MessageChannel !== 'undefined'

let triggerTick

if (isNode) {
  triggerTick = process.nextTick
} else if (BrowserMutationObserver) {
  let iterations = 0
  let callback = noop

  const node = document.createTextNode('')
  let observer = new BrowserMutationObserver(() => callback())
  observer.observer(node, { characterData: true })

  triggerTick = (cb: Function) => {
    callback = cb
    node.data = ++iterations + ''
  }
} else if (isWorker) {
  const channel = new MessageChannel()
  triggerTick = (cb: Function) => {
    channel.port1.onmessage = cb
    channel.port2.postMessage(0)
  }
} else {
  triggerTick = setTimeout
}

export default triggerTick
