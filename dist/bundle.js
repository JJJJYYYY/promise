(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Promise = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var CONFIG = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2
};

var noop = function noop() {};

function isFunction(x) {
  return typeof x === 'function';
}

function isObjectOrFunction(x) {
  return x !== null && 'object,function'.includes(typeof x === 'undefined' ? 'undefined' : _typeof(x));
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

browserGlobal = null;

var triggerTick = void 0;


if (isNode) {
  triggerTick = function triggerTick(cb) {
    process.nextTick(function () {
      cb();
    });
  };
} else if (BrowserMutationObserver) {
  var iterations = 0;
  var node = document.createTextNode('');
  var callback = null;
  var observer = new BrowserMutationObserver(function () {
    callback();
  });
  observer.observer(node, { characterData: true });

  triggerTick = function triggerTick(cb) {
    callback = cb;
    node.data = iterations = ++iterations % 2;
  };
} else if (isWorker) {
  var _callback = null;
  var channel = new MessageChannel();
  channel.port1.onmessage = function () {
    _callback();
  };
  triggerTick = function triggerTick() {
    return channel.port2.postMessage(0);
  };
} else {
  triggerTick = function triggerTick(callback) {
    return setTimeout(callback, 0);
  };
}

var triggerTick$1 = triggerTick;

var fulfilledDefaultFun = function fulfilledDefaultFun(value) {
  return value;
};
var rejectedDefaultFun = function rejectedDefaultFun(reason) {
  throw reason;
};

function getThen(promise, x) {
  try {
    return x.then;
  } catch (e) {
    reject(promise, e);
  }
}

function addNextTick(promise, result) {
  triggerTick$1(function () {
    var i = 0;
    var quence = promise._sequence;
    while (quence[i]) {
      try {
        resolve(quence[i], (true && quence[i + promise._status])(result));
      } catch (e) {
        reject(quence[i], e);
      }

      i += 3;
    }

    promise._sequence = [];
  });
}

function fulfill(promise, value) {
  if (promise._status === CONFIG.PENDING) {
    addNextTick(promise, value);

    promise._result = value;
    promise._status = CONFIG.FULFILLED;
  }
}

function readyTick(promise) {
  if (promise._status !== CONFIG.PENDING) addNextTick(promise, promise._result);
}

function resolve(promise, x) {
  if (promise === x) {
    // x 与 promise 相等
    reject(promise, new TypeError('x 不能与 promise 相等'));
  } else if (isObjectOrFunction(x)) {
    var _then = getThen(promise, x); // 存储then，以保证 then 单次访问
    if (isFunction(_then)) {
      var alive = true;
      try {
        _then.call(x, function resolvePromise(y) {
          if (alive) resolve(promise, y);
          alive = false;
        }, function rejectPromise(r) {
          if (alive) reject(promise, r);
          alive = false;
        });
      } catch (e) {
        if (alive) reject(promise, e); // then 执行过程出错,若未执行resolve/reject则以reject处理该promise
      }
    } else {
      fulfill(promise, x);
    }
  } else {
    fulfill(promise, x);
  }
}

function reject(promise, reason) {
  if (promise._status === CONFIG.PENDING) {
    addNextTick(promise, reason);

    promise._result = reason;
    promise._status = CONFIG.REJECTED;
  }
}

// 这才是 then 开始
function then(promise, onFulfilled, onRejected) {
  var sequence = promise._sequence;
  var length = sequence.length;
  sequence[length] = new promise.constructor(noop);
  sequence[length + CONFIG.FULFILLED] = isFunction(onFulfilled) ? onFulfilled : fulfilledDefaultFun;
  sequence[length + CONFIG.REJECTED] = isFunction(onRejected) ? onRejected : rejectedDefaultFun;
  readyTick(promise); // 对于已解决的 promise 需要将结果，在下次 tick 中返回给then

  return sequence[length];
}

function runPromise(promise, handle) {
  try {
    handle(function _resolve(value) {
      resolve(promise, value);
    }, function _reject(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var Promise$1 = function () {
  function Promise(handle) {
    classCallCheck(this, Promise);

    this._status = CONFIG.PENDING;

    this._sequence = [];

    runPromise(this, handle);
  }

  createClass(Promise, [{
    key: 'then',
    value: function then$$1(onFulfilled, onRejected) {
      return then(this, onFulfilled, onRejected);
    }
  }, {
    key: 'catch',
    value: function _catch(onRejected) {
      return then(this, null, onRejected);
    }
  }], [{
    key: 'resolve',
    value: function resolve$$1(data) {
      return new Promise(function (resolve$$1) {
        return resolve$$1(data);
      });
    }
  }, {
    key: 'reject',
    value: function reject$$1(reason) {
      return new Promise(function (resolve$$1, reject$$1) {
        return reject$$1(reason);
      });
    }
  }]);
  return Promise;
}();

return Promise$1;

})));
