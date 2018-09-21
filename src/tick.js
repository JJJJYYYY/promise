// @flow

import { isDef, noop, isProcess } from './utils'

let browserGlobal = isDef(window) ? window : {}
const BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver
const isNode = isDef(self) && isDef(process) && isProcess(process)

// test for web worker but not in IE10
const isWorker = isDef(Uint8ClampedArray) && isDef(importScripts) && isDef(MessageChannel)

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
