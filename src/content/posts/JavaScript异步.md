---
title: JavaScript 异步
published: 2025-02-26
description: 'JavaScript 异步：为什么需要异步、回调地狱、Promise、手写 Promise、Promise A+、async/await、异步场景与策略'
image: ''
tags: [JavaScript, 异步, Promise]
category: ''
draft: false
lang: 'zh-cn'
---

# JavaScript 异步

### 一、为什么需要异步？

- JavaScript 是**单线程**的：同一时刻只能执行一段代码。若所有操作都同步执行，遇到耗时任务（网络请求、定时器、文件 I/O）时，主线程会被阻塞，页面无法响应、无法渲染，用户体验极差。
- **异步**把耗时操作交给浏览器或宿主提供的其他线程（或机制）处理，主线程不等待结果，继续执行后续代码；等耗时操作完成后再通过**回调**、**Promise**、**async/await** 等方式把结果交回主线程处理。这样主线程不会被长时间占用，页面保持流畅。
- **典型异步场景**：`setTimeout` / `setInterval`、Ajax/fetch、DOM 事件、Promise、async/await、Web Worker、Node.js 的 I/O 等。

---

### 二、异步编程概述

- **异步编程**：用非阻塞方式组织“稍后执行”的逻辑，常见形态有：
  - **回调函数（Callback）**：把“完成后要执行的逻辑”以函数形式传入，由异步 API 在适当时机调用。
  - **Promise**：用“ thenable ”链式调用表示“成功/失败”的后续步骤，统一错误与组合。
  - **async/await**：在语法层面用“同步写法”写异步逻辑，基于 Promise。
  - **Generator + co**：用生成器暂停/恢复 + 执行器（如 co）驱动，可写出类似同步的异步代码（现多被 async/await 取代）。

---

### 三、细数异步场景与处理策略

| 场景 | 常见 API / 方式 | 处理策略 |
|------|-----------------|----------|
| 延时执行 | `setTimeout`、`setInterval` | 回调或封装为 Promise（如 `delay(ms)`） |
| 网络请求 | `fetch`、`XMLHttpRequest`、axios | Promise + then/async await，统一错误处理 |
| DOM 事件 | `addEventListener` | 回调；若需“只触发一次”可用 Promise + once 或 `{ once: true }` |
| 文件/读写（Node） | `fs.readFile` 等 | 回调或 `fs.promises` / `util.promises.promisify` |
| 多任务并行 | 多个独立异步 | `Promise.all`；有失败即停用 `Promise.allSettled` |
| 竞速/超时 | 谁先完成用谁 | `Promise.race`、`Promise.any`；超时可用 `AbortController` 或 race(delay) |
| 顺序依赖 | 步骤 A → B → C | 链式 then、async/await 顺序写 |

- **封装延时 Promise 示例**：

```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
delay(1000).then(() => console.log('1s later'));
```

---

### 四、回调与回调地狱

#### 回调函数

异步 API 常接收一个“完成后的回调”，在任务结束时调用并传入结果或错误。

```javascript
setTimeout(() => console.log('done'), 1000);
fs.readFile('a.txt', (err, data) => { /* ... */ });
```

#### 回调地狱（Callback Hell）

当多个异步步骤**顺序依赖**时，若每步都在回调里再发起下一步，会形成层层嵌套，可读性差、错误处理分散、难以维护，俗称“回调地狱”。

```javascript
getData((err, a) => {
  if (err) return handle(err);
  getMore(a, (err, b) => {
    if (err) return handle(err);
    getMore(b, (err, c) => {
      if (err) return handle(err);
      console.log(c);  // 嵌套过深
    });
  });
});
```

#### 解决方向

- 用 **Promise** 链式 then，或 **async/await** 写成线性顺序。
- 抽取命名函数减少嵌套；或用 Promise 化（见下节）把回调 API 转为返回 Promise。

---

### 五、从 Callback 到 Promise

- 将“回调风格”的 API 封装成**返回 Promise** 的形式，便于链式调用和 async/await。
- **自定义实现：promisify**（单次回调、约定 node 风格 (err, result)）：

```javascript
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}
// 使用
const readFileAsync = promisify(fs.readFile);
readFileAsync('a.txt', 'utf-8').then(console.log).catch(console.error);
```

- 实际开发中可使用 `util.promises.promisify`（Node）或库提供的 Promise 版 API。

---

### 六、手写 Promise（精简版与完整版）

#### 精简版（理解主流程）

下面是一个**精简版** Promise 实现，体现“状态、then、异步执行”等核心，用 `setTimeout` 模拟异步，不处理 thenable。

```javascript
function MyPromise(executor) {
  this.state = 'pending';
  this.value = undefined;
  this.reason = undefined;
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  const resolve = (value) => {
    if (this.state !== 'pending') return;
    this.state = 'fulfilled';
    this.value = value;
    this.onFulfilledCallbacks.forEach(fn => fn());
  };
  const reject = (reason) => {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    this.reason = reason;
    this.onRejectedCallbacks.forEach(fn => fn());
  };
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err; };

  const p2 = new MyPromise((resolve, reject) => {
    const run = () => {
      setTimeout(() => {
        try {
          if (this.state === 'fulfilled') {
            const x = onFulfilled(this.value);
            resolve(x);
          } else if (this.state === 'rejected') {
            const x = onRejected(this.reason);
            resolve(x);
          } else {
            this.onFulfilledCallbacks.push(() => run());
            this.onRejectedCallbacks.push(() => run());
          }
        } catch (e) {
          reject(e);
        }
      }, 0);
    };
    run();
  });
  return p2;
};

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};
```

#### 完整实现（含 thenable、微任务、resolvePromise）

以下实现使用**微任务**（`queueMicrotask` 或降级到 `setTimeout`）、**Promise 解决过程**处理 thenable 与链式，并保证值/错误穿透。

```javascript
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function microTask(fn) {
  if (typeof queueMicrotask === 'function') queueMicrotask(fn);
  else setTimeout(fn, 0);
}

function MyPromiseFull(executor) {
  this.state = PENDING;
  this.value = undefined;
  this.reason = undefined;
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  const resolve = (value) => {
    if (this.state !== PENDING) return;
    if (value === this) return reject(new TypeError('Chaining cycle'));
    if (value instanceof MyPromiseFull) {
      value.then(resolve, reject);
      return;
    }
    if (value && typeof value.then === 'function') {
      try {
        value.then(resolve, reject);
      } catch (e) {
        reject(e);
      }
      return;
    }
    this.state = FULFILLED;
    this.value = value;
    this.onFulfilledCallbacks.forEach(fn => microTask(fn));
  };
  const reject = (reason) => {
    if (this.state !== PENDING) return;
    this.state = REJECTED;
    this.reason = reason;
    this.onRejectedCallbacks.forEach(fn => microTask(fn));
  };
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

function resolvePromise(p2, x, resolve, reject) {
  if (p2 === x) return reject(new TypeError('Chaining cycle'));
  if (x instanceof MyPromiseFull) return x.then(resolve, reject);
  if (x && typeof x.then === 'function') {
    let called = false;
    try {
      x.then(
        (y) => { if (!called) { called = true; resolvePromise(p2, y, resolve, reject); } },
        (r) => { if (!called) { called = true; reject(r); } }
      );
    } catch (e) {
      if (!called) reject(e);
    }
    return;
  }
  resolve(x);
}

MyPromiseFull.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
  onRejected = typeof onRejected === 'function' ? onRejected : (err) => { throw err; };
  const self = this;
  const p2 = new MyPromiseFull((resolve, reject) => {
    const runFulfilled = () => {
      try {
        const x = onFulfilled(self.value);
        resolvePromise(p2, x, resolve, reject);
      } catch (e) {
        reject(e);
      }
    };
    const runRejected = () => {
      try {
        const x = onRejected(self.reason);
        resolvePromise(p2, x, resolve, reject);
      } catch (e) {
        reject(e);
      }
    };
    if (self.state === FULFILLED) microTask(runFulfilled);
    else if (self.state === REJECTED) microTask(runRejected);
    else {
      self.onFulfilledCallbacks.push(runFulfilled);
      self.onRejectedCallbacks.push(runRejected);
    }
  });
  return p2;
};

MyPromiseFull.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};
MyPromiseFull.prototype.finally = function (cb) {
  return this.then(
    (v) => MyPromiseFull.resolve(cb()).then(() => v),
    (e) => MyPromiseFull.resolve(cb()).then(() => { throw e; })
  );
};
MyPromiseFull.resolve = function (x) {
  if (x instanceof MyPromiseFull) return x;
  return new MyPromiseFull((resolve, reject) => {
    if (x && typeof x.then === 'function') x.then(resolve, reject);
    else resolve(x);
  });
};
MyPromiseFull.reject = function (reason) {
  return new MyPromiseFull((_, reject) => reject(reason));
};
```

- **要点**：resolve 时若值为 Promise/thenable，则跟随其状态；then 的返回值通过 `resolvePromise` 处理，避免循环引用；回调以微任务执行；finally 与静态 resolve/reject 一并实现。

---

### 七、解读 Promise A+ 规范（要点）

- **状态**：Promise 只有三种状态：pending、fulfilled、rejected；状态一旦变更不可再变。
- **then 方法**：`promise.then(onFulfilled, onRejected)` 必须返回一个新的 Promise（记为 promise2）；onFulfilled/onRejected 的返回值 x 通过 **Promise 解决过程** [[Resolve]](promise2, x) 决定 promise2 的结果（可能是继续 then 链、或解析为普通值、或跟随另一个 Promise）。
- **执行时机**：onFulfilled/onRejected 应在**调用栈清空后**、以**微任务**形式执行（实际可用 queueMicrotask 或 MutationObserver 等模拟）。
- **错误与穿透**：then 中若 onFulfilled/onRejected 不是函数，则发生“值/错误穿透”，即把当前 Promise 的结果原样传给链上的下一个 then。
- **链式**：then 可多次调用，每次返回新 Promise，形成链式调用；链上错误可由后续 catch 或 then 的 onRejected 统一处理。

规范全文可参阅 [Promises/A+](https://promisesaplus.com/)。手写完整实现需严格按规范处理 thenable、循环引用、多次 resolve/reject 等边界。

---

### 八、async 与 await 用法与原理详解

#### 用法

- **async 函数**：声明时在 function 前加 `async`；执行后**必然返回 Promise**：若 return 普通值，则等价于 `Promise.resolve(值)`；若 throw，则等价于 `Promise.reject(错误)`。
- **await**：只能在 async 函数内使用；`await 表达式` 会暂停当前 async 函数执行，等待右侧的 Promise 落定（fulfilled/rejected）；若为 fulfilled 则取到结果继续执行，若为 rejected 则抛出异常，可由 try/catch 或外层 catch 捕获。

```javascript
async function fetchUser() {
  const res = await fetch('/api/user');
  const data = await res.json();
  return data;
}
fetchUser().then(console.log).catch(console.error);
```

#### 错误处理

- await 的 Promise 若 reject，会以**异常**形式抛出，可用 try/catch 包裹，或在外层 .catch()。

```javascript
async function run() {
  try {
    const a = await getA();
    const b = await getB(a);
    return b;
  } catch (e) {
    console.error(e);
  }
}
```

#### 原理（简要）

- async/await 是**语法糖**：底层仍基于 Promise 与**微任务**。编译器（如 Babel）会把 async 函数转成“返回 Promise + 内部用 Generator 或状态机驱动”的形式；await 相当于“暂停 → 对右侧 Promise 调用 then → 在 then 回调里恢复执行并传入结果”。所以 async 函数执行后返回的一定是 Promise，且 await 后的代码相当于在 Promise 的 then 回调中执行。

#### async/await 的实现思路（用 Generator 模拟）

async/await 可被理解为“自动执行的、yield Promise 的 Generator”：每次 yield 一个 Promise，在 Promise 完成后再把结果传回并 next，直到 done。下面用 **Generator + 自动执行器** 模拟“async 函数返回 Promise、await 等待 Promise”的效果。

```javascript
function run(gen) {
  const g = typeof gen === 'function' ? gen() : gen;
  return new Promise((resolve, reject) => {
    function step(val) {
      let next;
      try {
        next = g.next(val);
      } catch (e) {
        return reject(e);
      }
      if (next.done) return resolve(next.value);
      Promise.resolve(next.value).then(step, (err) => {
        try {
          next = g.throw(err);
        } catch (e) {
          return reject(e);
        }
        if (next.done) return resolve(next.value);
        Promise.resolve(next.value).then(step, reject);
      });
    }
    step();
  });
}

// 使用：类似 async/await 的写法
function* fetchUser() {
  const a = yield Promise.resolve(1);
  const b = yield Promise.resolve(2);
  return a + b;
}
run(fetchUser).then(console.log);  // 3
```

---

### 九、Generator 与 co（可选了解）

- **Generator**：`function*` 与 `yield` 可暂停/恢复执行；`.next()` 返回 `{ value, done }`。可把“异步结果”通过 .next(result) 传回生成器，从而用“同步写法”表达异步流程。
- **co**：通过递归或 Promise 链，不断调用 gen.next() 并在 Promise 完成时把结果传回，直到 done 为 true，实现“用 Generator 写异步”的效果。如今更推荐直接使用 **async/await**，语义相同且无需额外库。

```javascript
function* gen() {
  const a = yield Promise.resolve(1);
  const b = yield Promise.resolve(2);
  return a + b;
}
// 需配合 co 或手写 run(gen) 驱动
```

---

### 十、常见 API 与自定义实现

#### Promise 静态方法

| API | 说明 |
|-----|------|
| `Promise.resolve(x)` | 返回一个以 x 为结果的 Promise（若 x 为 thenable 则跟随其状态） |
| `Promise.reject(reason)` | 返回一个已 reject 的 Promise |
| `Promise.all(iterable)` | 全部 fulfilled 才 fulfilled，有一个 reject 即 reject |
| `Promise.allSettled(iterable)` | 等全部落定，返回每个的状态与值/原因 |
| `Promise.race(iterable)` | 取第一个落定的结果 |
| `Promise.any(iterable)` | 取第一个 fulfilled；全部 reject 才 reject |

#### 自定义实现示例：Promise.all

```javascript
function myAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) return reject(new TypeError('not array'));
    const result = [];
    let count = 0;
    const len = promises.length;
    if (len === 0) return resolve(result);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (val) => {
          result[i] = val;
          if (++count === len) resolve(result);
        },
        reject
      );
    });
  });
}
```

#### 自定义实现示例：Promise.race

```javascript
function myRace(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) return reject(new TypeError('not array'));
    promises.forEach((p) => Promise.resolve(p).then(resolve, reject));
  });
}
```

#### 自定义实现：Promise.resolve / Promise.reject

```javascript
function myResolve(x) {
  if (x instanceof Promise) return x;
  return new Promise((resolve, reject) => {
    if (x && typeof x.then === 'function') x.then(resolve, reject);
    else resolve(x);
  });
}
function myReject(reason) {
  return new Promise((_, reject) => reject(reason));
}
```

#### 自定义实现：Promise.allSettled

```javascript
function myAllSettled(promises) {
  return new Promise((resolve) => {
    if (!Array.isArray(promises)) return resolve([]);
    const result = [];
    let count = 0;
    const len = promises.length;
    if (len === 0) return resolve(result);
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(
          (val) => { result[i] = { status: 'fulfilled', value: val }; },
          (reason) => { result[i] = { status: 'rejected', reason }; }
        )
        .finally(() => {
          if (++count === len) resolve(result);
        });
    });
  });
}
```

#### 自定义实现：Promise.any

```javascript
function myAny(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) return reject(new TypeError('not array'));
    const len = promises.length;
    if (len === 0) return reject(new AggregateError([], 'All rejected'));
    const errors = [];
    let rejectedCount = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        resolve,
        (err) => {
          errors[i] = err;
          if (++rejectedCount === len) reject(new AggregateError(errors, 'All rejected'));
        }
      );
    });
  });
}
```

---

### 十一、常见面试代码题

#### 1. 输出顺序（宏任务 / 微任务）

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
```

**答案**：1 → 4 → 3 → 2。  
同步先执行 1、4；微任务（then）在本轮宏任务结束后、下一宏任务前执行，故 3 在 2 前；setTimeout 为宏任务，2 最后。

#### 2. Promise 链与 then 的返回值

```javascript
Promise.resolve(1)
  .then((v) => { console.log(v); return v + 1; })
  .then((v) => { console.log(v); return Promise.resolve(v + 1); })
  .then(console.log);
```

**答案**：依次输出 1、2、3。  
第一个 then 返回 2；第二个 then 返回 Promise.resolve(3)，下一个 then 收到 3。

#### 3. async 函数与 return

```javascript
async function f() { return 1; }
f().then(console.log);  // ?
```

**答案**：输出 1。async 函数 return 非 Promise 时，等价于 return Promise.resolve(1)。

#### 4. await 后面跟非 Promise

```javascript
async function g() {
  const a = await 1;
  const b = await Promise.resolve(2);
  console.log(a, b);
}
g();
```

**答案**：输出 1 2。await 右侧若非 Promise，会包装成 Promise.resolve，再取结果。

#### 5. 错误捕获

```javascript
Promise.reject(1).then(() => {}).catch(console.log).then(() => console.log(2));
```

**答案**：先输出 1，再输出 2。reject 后 then 的 onFulfilled 不执行，catch 捕获并返回 undefined，后续 then 继续执行。

#### 6. 手写：限制并发数量的请求调度

实现 `limitRequest(urls, limit)`，最多同时执行 limit 个请求，完成一个再补下一个。

```javascript
function limitRequest(urls, limit) {
  const run = (url) => fetch(url).finally(() => {
    if (urls.length) run(urls.shift());
  });
  for (let i = 0; i < limit && urls.length; i++) run(urls.shift());
}
```

---

*（以上按“为什么需要异步 → … → 常用 API 与自定义实现 → 面试代码题”的逻辑顺序组织。）*