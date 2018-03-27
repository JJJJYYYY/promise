const browserWindow = (typeof window !== 'undefined') ? window : undefined
let browserGlobal = browserWindow || {}
const BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver
const isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]'

// test for web worker but not in IE10
const isWorker = typeof Uint8ClampedArray !== 'undefined' &&
  typeof importScripts !== 'undefined' &&
  typeof MessageChannel !== 'undefined'

browserGlobal = null

let triggerTick
let queue = []

export function addQueue (callback, arg, promise) {
  queue.push({
    callback: callback,
    arg: arg,
    promise: promise
  })
}

if (isNode) {
  triggerTick = (cb) => {
    process.nextTick(() => {
      cb()
    })
  }
} else if (BrowserMutationObserver) {
  let iterations = 0
  let node = document.createTextNode('')
  let callback = null
  let observer = new BrowserMutationObserver(() => {
    callback()
  })
  observer.observer(node, { characterData: true })

  triggerTick = (cb) => {
    callback = cb
    node.data = (iterations = ++iterations % 2)
  }
} else if (isWorker) {
  let callback = null
  const channel = new MessageChannel()
  channel.port1.onmessage = () => {
    callback()
  }
  triggerTick = () => channel.port2.postMessage(0)
} else {
  triggerTick = callback => setTimeout(callback, 0)
}

export default triggerTick
