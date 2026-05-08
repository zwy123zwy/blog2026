---
title: Node.js 面试题
published: 2026-05-08
description: 'Node.js 面试题大全，侧重后端应用与 Node 核心理解：ES6、JS 高级、事件/流/文件/网络、异步与部署、Async/Express、MongoDB/Redis 等'
image: ''
tags: [Node.js, 面试, 后端, EventEmitter, Stream, Express]
category: '前端'
draft: false
lang: 'zh-cn'
---

# Node.js 面试题

本文整理自 [jimuyouyou/node-interview-questions](https://github.com/jimuyouyou/node-interview-questions)，侧重**后端应用与对 Node 核心的理解**，而非纯前端视角。目标：理论+实战兼顾、参考答案简洁、用代码讲清区别，便于快速建立对 Node 的完整认识。

---

## 一、内容大纲

- [ES6 新特性](#二es6-新特性)
- [JavaScript 高级话题（面向对象、作用域、闭包、设计模式等）](#三javascript-高级话题)
- [Node 核心内置类库（事件、流、文件、网络等）](#四node-核心内置类库)
- [Node 高级话题（异步、部署、性能调优、异常调试等）](#五node-高级话题)
- [常用知名第三方类库（Async、Express 等）](#六常用知名第三方类库)
- [其它相关后端常用技术（MongoDB、Redis、Apache、Nginx 等）](#七其它相关后端常用技术)
- [常用前端技术（Html5、CSS3、jQuery 等）](#八常用前端技术)

---

## 二、ES6 新特性

### 1. ES6 有哪些新特性？

**参考答案**：类的支持、模块化、箭头操作符、let/const 块作用域、字符串模板、解构、参数默认值/不定参数/拓展参数、for-of 遍历、Generator、Map/Set、Promise。

### 2. 你对 ES6 的个人看法？

**参考答案**：ES6 从软件工程角度让 JS 适合做大型应用，相当于当年的 Java5，是历史性发展。各大主流浏览器已支持大部分新特性，Node.js 可直接使用绝大多数 ES6 语法。推荐：[阮一峰 ECMAScript 6 入门](http://es6.ruanyifeng.com/)。

---

## 三、JavaScript 高级话题

### 1. 常用 JS 类定义的方法有哪些？

**参考答案**：主要有**构造函数+原型**和**对象创建（Object.create）**两种。原型法是通用做法，对象创建是 ES5 推荐方式，目前原型法更普遍。

**构造函数+原型：**

```javascript
function Person() {
  this.name = 'michaelqin';
}
Person.prototype.sayName = function () {
  alert(this.name);
};
var person = new Person();
person.sayName();
```

**对象创建：**

```javascript
var Person = {
  name: 'michaelqin',
  sayName: function () {
    alert(this.name);
  },
};
var person = Object.create(Person);
person.sayName();
```

### 2. JS 类继承的方法有哪些？

**参考答案**：原型链法、属性复制法、构造器应用法（如 `Animal.call(this)`）。对象也可作为“类”被继承。

- **原型链法**：`Person.prototype = Animal.prototype` 等，注意修正 `constructor`。
- **属性复制法**：`for (prop in Animal.prototype) { Person.prototype[prop] = Animal.prototype[prop]; }`。
- **构造器应用法**：在子类构造函数中 `Animal.call(this)` 或 `apply`/`bind`。

### 3. JS 类多重继承的实现方法？

**参考答案**：用属性复制法，把多个父类的 prototype 属性复制到子类，子类即拥有多父类的行为与属性。

### 4. JS 里的作用域是什么样子的？

**参考答案**：JS 是**函数作用域**，不是块作用域。变量在声明所在的整个函数内有效；若在函数内重定义同名变量，则函数内从“声明提升”起就使用该局部变量（未赋值前为 undefined）。

```javascript
var globalVar = 'global var';
function test() {
  alert(globalVar); // undefined，因下面有 var globalVar，提升导致此处用局部
  var globalVar = 'overrided var';
  alert(globalVar); // overrided var
}
alert(globalVar); // global var
```

### 5. JS 里的 this 指的是什么？

**参考答案**：this 指向**调用时的对象**（运行上下文），而不是构造函数本身。例如实例调用方法时，this 指向该实例。

### 6. apply、call 和 bind 有什么区别？

**参考答案**：三者都能把函数应用到“其他对象”上。apply、call 会**立即执行**，apply 传参为数组，call 为逗号分隔的多个参数；bind 只**绑定 this 与部分参数**，返回新函数，需再调用才执行。

```javascript
Person.prototype.sayName.apply(obj, [p1, p2, p3]);
Person.prototype.sayName.call(obj, p1, p2, p3);
var fn = Person.prototype.sayName.bind(obj);
fn(p1, p2, p3);
```

### 7. caller、callee 和 arguments 分别是什么？

**参考答案**：caller 是“谁调用了当前函数”，callee 是“当前正在执行的函数”的引用；二者都是函数对象。arguments 是函数**参数列表**的类数组对象。

### 8. 什么是闭包，闭包有哪些用处？

**参考答案**：闭包本质是**函数与其词法作用域**的引用关系；内嵌函数引用外部函数变量，形成作用域链。用途：数据私有、柯里化、模块化、回调等。注意不用时解除引用，避免内存泄漏。

### 9. defineProperty、hasOwnProperty、propertyIsEnumerable 都是做什么用的？

**参考答案**：`Object.defineProperty(obj, prop, descriptor)` 用于定义/修改属性（value、writable、configurable、enumerable、get/set）。`hasOwnProperty` 判断属性是否在**对象自身**（不含原型链）。`propertyIsEnumerable` 判断属性是否可被 `for..in` 枚举。

### 10. JS 常用设计模式的实现思路（单例、工厂、代理、装饰、观察者）

**参考答案**：

- **单例**：模块导出单一对象或 class 内静态 getInstance + 私有构造。
- **工厂**：同一套参数返回不同类实例，如根据 type 或类名 new 不同子类。
- **代理**：新类持有原类实例，对外包一层，在调用前后加逻辑（如日志、权限）。
- **观察者**：发布者维护订阅者列表，状态变化时 notify；订阅者实现 update/process。类似事件模式（如 onclick）。

### 11. 列举数组相关的常用方法

**参考答案**：push/pop、shift/unshift、split/join、slice/splice/concat、sort/reverse、map/reduce、forEach、filter。

### 12. 列举字符串相关的常用方法

**参考答案**：indexOf/lastIndexOf/charAt、split/match/test、slice/substring/substr、toLowerCase/toUpperCase。

---

## 四、Node 核心内置类库

### 4.1 Node 概览

**1. 为什么要用 Node？**

- **Node 的定义**：Node.js 是一个基于 **Chrome V8 引擎** 的 JavaScript 运行时，让 JS 脱离浏览器在服务端运行，提供文件、网络、进程等系统能力。本质是“JS + 事件驱动 + 非阻塞 I/O”的服务端平台。
- **为什么是单线程？**：JS 引擎（V8）执行 JS 时是单线程的，避免多线程下的锁、竞态与上下文切换；Node 把耗时 I/O 交给底层（libuv）与系统完成，主线程只负责执行 JS 和调度回调，用**事件循环**协调任务，因此“单线程”指的是 JS 执行模型，不是整台机器只有一线程。
- **怎么支持高并发？**：依靠 **事件循环 + 非阻塞 I/O**。主线程不阻塞等待 I/O，而是注册回调后继续处理其他请求；当 I/O 完成（如网络响应、文件读完），由 libuv 将回调放入任务队列，主线程在下一轮循环中执行。这样单进程就能同时处理大量连接（高并发），典型场景如 HTTP 服务、WebSocket。
- **什么叫非阻塞 I/O？**：发起 I/O 操作（读文件、发请求、查数据库）时，**不等待**操作完成就立即返回，把“完成后的处理”通过回调或 Promise 注册；等系统 I/O 完成后，再在事件循环中执行回调。与之相对的是“阻塞 I/O”：调用会一直等到数据就绪才返回，期间线程被占住，无法处理其他请求。

在此基础上，用 Node 的理由可概括为：简单（JS/JSON）、强大（非阻塞 I/O、高并发）、轻量（前后端统一语言）、可扩展（多实例、多机、丰富第三方库）。

**2. Node 的架构是什么样子的？**  

三层：**应用层 >> V8 + Node 内置架构 >> 操作系统**。Node 内置又分：核心模块（JS 实现）>> C++ 绑定 >> libuv + Crypto + http 等。

- **用法详解**：应用层即我们写的 JS 和第三方包；V8 负责执行 JS；核心模块（如 fs、http）由 Node 用 JS 封装，底层通过 C++ 绑定调用 libuv（事件循环、文件/网络 I/O）和 OpenSSL 等。写代码时只需 `require('fs')`、`require('http')`，不直接碰 C++。
- **架构示意**：可参考 [node-interview-questions](https://github.com/jimuyouyou/node-interview-questions) 仓库中的 `node_skillset.jpg`。

**3. Node 有哪些核心模块？**

EventEmitter、Stream、FS、Net、全局对象（process、console、Buffer）等。

- **用法详解**：通过 `require('模块名')` 使用；事件用 `require('events')`，流用 `require('stream')`，文件用 `require('fs')`，网络用 `require('http')`/`require('https')`/`require('net')`，process/console/Buffer 为全局无需 require。
- **示例**：`const fs = require('fs'); fs.readFile('a.txt', (err, data) => {});`、`const { EventEmitter } = require('events');`。

### 4.2 全局对象

**1. Node 有哪些全局对象？**  
process、console、Buffer。

**2. process 有哪些常用方法？**  
process.stdin/stdout/stderr、process.on、process.env、process.argv、process.arch、process.platform、process.exit。

**3. console 有哪些常用方法？**  
console.log/console.info、console.error/console.warning、console.time/console.timeEnd、console.trace、console.table。

**4. Node 有哪些定时功能？**  
setTimeout/clearTimeout、setInterval/clearInterval、setImmediate/clearImmediate、process.nextTick。

**5. Node 中的事件循环是什么样子的？**  
总体顺序：**process.nextTick >> setImmediate >> setTimeout/setInterval**。详见 [Node 官方 Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)。

**6. Buffer 如何应用？**  
处理二进制数据（图片、音频、数据库文件等）；支持编码解码、二进制与字符串互转。

**用法详解与代码示例：**

```javascript
// process：环境与进程
console.log(process.env.NODE_ENV);      // 环境变量
console.log(process.argv);              // 命令行参数 ['node', 'script.js', 'a', 'b']
process.on('exit', (code) => { /* 进程退出 */ });

// console：计时与表格
console.time('label');
// ... 某段逻辑
console.timeEnd('label');               // 输出耗时
console.table([{ a: 1, b: 2 }, { a: 3, b: 4 }]);

// Buffer：二进制与编码
const buf = Buffer.from('hello', 'utf8');
console.log(buf.toString('base64'));    // aGVsbG8=
const buf2 = Buffer.alloc(10);          // 分配 10 字节
```

### 4.3 EventEmitter

**1. 什么是 EventEmitter？**  
Node 中实现**观察者模式**的类，用于监听与发射消息，处理多模块交互。

**2. 如何实现一个 EventEmitter？**  
定义子类 → 构造函数内 `EventEmitter.call(this)` → `util.inherits(MyEmitter, EventEmitter)`，然后 on/emit。

```javascript
const util = require('util');
const EventEmitter = require('events').EventEmitter;

function MyEmitter() {
  EventEmitter.call(this);
}
util.inherits(MyEmitter, EventEmitter);

const em = new MyEmitter();
em.on('hello', (data) => console.log('收到:', data));
em.emit('hello', 'EventEmitter 传递消息真方便!');
```

**3. EventEmitter 有哪些典型应用？**  
模块间通信、回调内外传参、流（Stream 基于 EventEmitter）、任何观察者/事件场景。

**4. 怎么捕获 EventEmitter 的错误事件？**  
监听 `error` 事件。多实例可用 domain 统一处理（注意 domain 已废弃，可用 Promise/async 或上层 try-catch 替代）。

**5. newListener 事件有什么用处？**  
在添加任何 on 监听时都会先触发 `newListener`，可用于反射、事件管理、自定义逻辑（如限流、日志）。

### 4.4 Stream

**1. 什么是 Stream？**  
基于 EventEmitter 的数据管理方式，分可读、可写、双工（Duplex）、转换（Transform）等类型。

**2. Stream 有什么好处？**  
非阻塞、分片处理省内存、管道式组合易扩展。

**3. Stream 有哪些典型应用？**  
文件、网络、数据转换、音视频处理。

**4. 怎么捕获 Stream 的错误事件？**  
监听流的 `error` 事件，同 EventEmitter。

**5. 有哪些常用 Stream，分别什么时候使用？**  
Readable（输入数据源）、Writable（输出）、Duplex（可读可写，需实现 _read 与 _write）、Transform（双工但只需实现 _transform）。

**6. 实现一个 Writable Stream？**  
继承 `stream.Writable`，实现 `_write(chunk, encoding, callback)`，在 callback 中继续拉取或结束。

**用法详解与代码示例：**

- **读文件流 + 管道**：大文件用流可分段读，不占满内存；`readStream.pipe(writeStream)` 自动背压。
- **事件循环与流**：可参考 [node-interview-questions](https://github.com/jimuyouyou/node-interview-questions) 仓库中的 `event_loop.jpg`。

```javascript
const fs = require('fs');
const { Writable } = require('stream');

// 读文件流
const readStream = fs.createReadStream('input.txt');
readStream.on('data', (chunk) => console.log(chunk.length));
readStream.on('end', () => console.log('done'));

// 实现 Writable Stream
function MyWritable(options) {
  Writable.call(this, options);
}
require('util').inherits(MyWritable, Writable);
MyWritable.prototype._write = function (chunk, encoding, callback) {
  console.log('写入:', chunk.toString());
  callback();
};
process.stdin.pipe(new MyWritable());
```

### 4.5 文件系统

**1. fs 模块架构是什么样子的？**  

POSIX 风格底层 API、流式 createReadStream/createWriteStream、同步 readFileSync/writeFileSync、异步 readFile/writeFile。

**2. 读写文件有多少种方法？**  
四种：POSIX 式、流式、同步、异步。

**3. 怎么读取 JSON 配置文件？**  
① `require('data.json')` 得到对象（有缓存，多模块共享同一对象）；② `fs.readFile` + `JSON.parse` 得到独立对象，各模块互不影响。

**4. fs.watch 和 fs.watchFile 有什么区别？**  
fs.watch 基于系统原生机制，可能不适用网络文件系统；fs.watchFile 轮询检查，适用网络盘但非实时、较耗资源。

**用法详解与代码示例：**

```javascript
const fs = require('fs');

// 异步读文件
fs.readFile('config.json', 'utf8', (err, data) => {
  if (err) throw err;
  const obj = JSON.parse(data);
});

// 同步读（启动时加载配置常用）
const data = fs.readFileSync('config.json', 'utf8');
const config = JSON.parse(data);

// 流式读大文件
const r = fs.createReadStream('big.log');
const w = fs.createWriteStream('copy.log');
r.pipe(w);

// 读 JSON 两种方式：require 有缓存；readFile 每次独立
const cfg1 = require('./config.json');  // 多模块共享同一对象
const cfg2 = JSON.parse(fs.readFileSync('./config.json', 'utf8'));  // 独立对象
```

### 4.6 网络

**1. Node 的网络模块架构？**  
全面支持 TCP、HTTP/HTTPS、UDP、DNS、TLS/SSL 等服务器与客户端。

**2. 怎样支持 HTTPS/TLS？**  
OpenSSL 生成公私钥/证书，服务器或客户端使用 https 模块并加载证书。

**3. 实现一个简单的 HTTP 服务器？**  
`http.createServer((req, res) => { ... }).listen(port)`，在回调里写状态码、头、body，最后 res.end()。

**用法详解与代码示例：**

- **HTTP**：`http.createServer` 接收请求回调，req 可读流、res 可写流；HTTPS 需在 `https.createServer` 时传入 `key`、`cert`（证书与私钥，通常由 OpenSSL 或 Let's Encrypt 生成）。

```javascript
const http = require('http');

http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hello Node</h1>');
    res.end();
  })
  .listen(3000, () => console.log('http://localhost:3000'));

// HTTPS 示例思路：const https = require('https'); const opts = { key, cert }; https.createServer(opts, (req,res)=>{}).listen(443);
```

### 4.7 child_process

**1. 为什么需要 child_process？**  
与 shell 交互、执行可执行文件、做阻塞或高 CPU 计算，由子进程承担，不阻塞主进程。

**2. exec、execFile、spawn、fork 分别做什么用？**  
exec：执行 shell 命令（可管道）；execFile：执行可执行文件；spawn：流式与系统交互；fork：专门 fork Node 脚本，父子通过 message/send 通信。

**3. 两个 Node 程序怎样交互？**  
父进程 `child_process.fork(script)`，子进程 `process.on('message')` / `process.send()`，父进程 `child.on('message')` / `child.send()`。

**4. 怎样让一个 JS 文件像 Linux 命令一样可执行？**  
文件头加 `#!/usr/bin/env node`，chmod +x，即可直接执行该文件。

**5. child 的 stdin/stdout 和 process 的一样吗？**  
概念相同（标准输入、输出、错误），都是流。在父进程看来，子进程的 stdout 是父进程的输入流，子进程的 stdin 是父进程的输出流。

---

## 五、Node 高级话题

**1. 异步和同步怎么理解？**  
Node 单线程，异步靠事件循环；同步会阻塞，高并发下影响大，一般只在启动时加载配置等少量场景用同步。

**2. 有哪些方法可以进行异步流程控制？**  
多层回调、拆成命名函数再回调、async 库、Promise、async/await。

### 一、并发模型详解

#### 1. 概念：为什么 Node 是单线程？

Node 采用**单线程 + 事件循环 + 非阻塞 I/O** 的并发模型，而非多线程。设计初衷是：

- **避免锁与竞争**：多线程需要加锁、处理竞态，复杂度高；单线程同一时刻只执行一段 JS，无数据竞争。
- **I/O 才是瓶颈**：Web 服务多数时间在等磁盘、网络，CPU 空闲；若用阻塞 I/O，线程会空转；非阻塞 I/O 把等待交给操作系统，单线程即可在等待期间处理其他请求。
- **简单可预测**：不用考虑线程安全，回调顺序由事件循环保证，逻辑更清晰。

因此 Node 适合 **I/O 密集型** 场景（高并发请求、大量文件/网络操作），对 **CPU 密集型** 则会阻塞主线程，需额外手段处理。

#### 2. 事件循环（Event Loop）概念

事件循环由 **libuv** 实现，负责把“已就绪的任务”放到主线程执行。主线程执行完当前任务后，从事件循环中取下一个回调执行，如此循环。

**核心思路**：主线程不等待 I/O，而是注册回调；当 I/O 完成时，libuv 将回调放入对应队列；事件循环按阶段依次检查这些队列，取出回调交给主线程执行。

**宏任务阶段（简化）**：`timers`（setTimeout/setInterval 到期）→ `pending callbacks`（上一轮延迟的 I/O 回调）→ `idle/prepare`（内部用）→ `poll`（等待 I/O，最耗时）→ `check`（setImmediate）→ `close callbacks`（如 socket.on('close')）。每进入下一阶段前，会清空当前**微任务队列**。

**微任务**：`process.nextTick`、`Promise.then`、`queueMicrotask`。微任务在当前宏任务结束后、下一宏任务前执行；`nextTick` 优先级高于 Promise。

**执行顺序示例**：

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
process.nextTick(() => console.log('4'));
console.log('5');
// 输出：1 5 4 3 2
// 解释：1、5 同步；4 nextTick 微任务；3 Promise 微任务；2 宏任务 setTimeout
```

#### 3. 非阻塞 I/O 与并发 vs 并行

- **非阻塞 I/O**：调用 `fs.readFile`、`http.request` 时，主线程不等待，立即返回；操作系统完成 I/O 后，通过 libuv 将回调放入 poll 队列，事件循环再执行。主线程在等待期间可处理其他请求，实现高并发。
- **并发 vs 并行**：  
  - **并发**：多个任务在时间上重叠，单核上交替执行（如单线程事件循环）。  
  - **并行**：多核同时执行多段代码。  
  Node 单进程是并发，不是并行；要利用多核需 **cluster**（多进程）或 **worker_threads**（多线程）。

---

### 二、怎么处理复杂任务：概念、比较与实现

#### 1. 任务类型与选型

| 类型 | 特点 | 主线程表现 | 推荐做法 |
|------|------|------------|----------|
| **I/O 密集型** | 大量磁盘、网络等待 | 等待期间可处理其他请求 | 非阻塞 I/O + 事件循环，单线程即可 |
| **CPU 密集型** | 大量计算（加密、压缩、解析） | 长时间占用主线程，阻塞所有请求 | offload 到子进程或工作线程 |
| **混合型** | 既有 I/O 又有计算 | 计算段会阻塞 | 计算部分 offload，I/O 保持异步 |

#### 2. 各种方法对比

| 方法 | 粒度 | 进程/线程 | 内存 | 通信 | 适用场景 | 优点 | 缺点 |
|------|------|-----------|------|------|----------|------|------|
| **child_process.fork** | 进程 | 独立进程 | 各自 V8 实例，内存大 | message/send（序列化） | 长时 CPU 任务、需强隔离 | 隔离好、可执行任意脚本 | 启动慢、内存占用高 |
| **worker_threads** | 线程 | 同进程多线程 | 共享进程，可共享 SharedArrayBuffer | postMessage / 共享内存 | CPU 密集、需共享数据 | 比 fork 轻量、启动快 | 需 Node 12+，共享内存要小心 |
| **cluster** | 多进程 | 多进程监听同端口 | 每进程独立 | 无直接通信（各处理请求） | 多核 Web 服务 | 充分利用多核、负载均衡 | 不适合单任务 offload |
| **任务队列（Bull）** | 进程 | 多 Worker 进程 | 独立 | Redis | 可延迟、需重试、解耦 | 持久化、重试、监控 | 依赖 Redis，有延迟 |
| **分片 + setImmediate** | 主线程 | 单线程 | 无额外 | 无 | 大数组/大列表处理 | 无依赖、实现简单 | 仍占用主线程，单核 |
| **Stream** | 主线程 | 单线程 | 分块读，内存小 | 无 | 大文件、大数据流 | 内存友好 | 仅适合流式数据 |

**选型建议**：单次 heavy 计算 → worker_threads 或 fork；多核 Web 服务 → cluster；可延迟任务、需重试 → 队列；大数组遍历 → 分片；大文件 → Stream。

---

#### 3. 实际代码：child_process.fork

**概念**：fork 会启动一个新的 Node 进程，执行指定脚本；父子进程通过 `child.send()` 和 `process.on('message')` 通信，数据会被序列化（structured clone），不能传函数。

```javascript
// ========== main.js：主进程 ==========
const { fork } = require('child_process');
const path = require('path');

// 创建子进程，执行 worker-fork.js
const child = fork(path.join(__dirname, 'worker-fork.js'), [], {
  stdio: ['pipe', 'pipe', 'pipe', 'ipc'],  // 建立 IPC 通道
});

// 发送任务
child.send({ type: 'compute', n: 5000000 });

// 接收结果
child.on('message', (msg) => {
  console.log('主进程收到:', msg);
  if (msg.result !== undefined) {
    console.log('计算结果:', msg.result);
    child.disconnect();  // 结束通信
  }
});

child.on('error', (err) => console.error('子进程错误:', err));
child.on('exit', (code, signal) => console.log('子进程退出:', code, signal));

// ========== worker-fork.js：子进程 ==========
process.on('message', (msg) => {
  if (msg.type === 'compute') {
    let sum = 0;
    for (let i = 0; i < msg.n; i++) sum += i;
    process.send({ result: sum });
  }
});
```

---

#### 4. 实际代码：worker_threads

**概念**：在同一进程内创建新线程，共享部分内存（通过 SharedArrayBuffer）；比 fork 轻量，适合纯 CPU 计算、需要共享大数据的场景。

```javascript
// ========== main-worker.js：主线程 ==========
const { Worker } = require('worker_threads');
const path = require('path');

const worker = new Worker(path.join(__dirname, 'worker-thread.js'), {
  workerData: { n: 5000000 },  // 传入数据，无需序列化复杂对象
});

worker.on('message', (result) => {
  console.log('主线程收到结果:', result);
});

worker.on('error', (err) => {
  console.error('Worker 错误:', err);
});

worker.on('exit', (code) => {
  if (code !== 0) console.error('Worker 退出码:', code);
});

// ========== worker-thread.js：工作线程 ==========
const { parentPort, workerData } = require('worker_threads');

// workerData 即主线程传入的 { n: 5000000 }
let sum = 0;
for (let i = 0; i < workerData.n; i++) {
  sum += i;
}

parentPort.postMessage(sum);
```

**与 fork 对比**：worker 同进程，启动更快、内存占用更小；fork 独立进程， crash 互不影响，适合执行不同脚本或第三方命令。

---

#### 5. 实际代码：cluster 多进程

**概念**：主进程 fork 多个子进程，每个子进程运行同一套服务代码并监听同一端口；由操作系统做负载均衡，适合多核 Web 服务。

```javascript
// ========== cluster-server.js ==========
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
  console.log(`主进程 ${process.pid}，启动 ${numCPUs} 个子进程`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`子进程 ${worker.process.pid} 退出，重启...`);
    cluster.fork();
  });
} else {
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`响应来自进程 ${process.pid}`);
  }).listen(3000);
  console.log(`子进程 ${process.pid} 已监听 3000`);
}
```

---

#### 6. 实际代码：分片 + setImmediate 让出主线程

**概念**：不创建新进程/线程，把大任务拆成小批，每批之间用 `setImmediate` 把控制权交回事件循环，避免长时间阻塞；适合主线程能接受“慢慢算”的场景。

```javascript
/**
 * 分片处理大数组，每处理 chunkSize 个元素后让出主线程
 * @param {Array} arr 待处理数组
 * @param {number} chunkSize 每批数量
 * @param {function} processor 处理函数 (chunk, index) => void
 * @param {function} onDone 全部完成回调
 */
function processInChunks(arr, chunkSize, processor, onDone) {
  let index = 0;

  function next() {
    const end = Math.min(index + chunkSize, arr.length);
    const chunk = arr.slice(index, end);

    for (let i = 0; i < chunk.length; i++) {
      processor(chunk[i], index + i);
    }

    index = end;
    if (index >= arr.length) {
      onDone();
      return;
    }
    // 让出主线程，下一轮事件循环再继续
    setImmediate(next);
  }

  next();
}

// 使用示例：对 100 万元素做“耗时”操作
const big = Array.from({ length: 1e6 }, (_, i) => i);
const results = [];
processInChunks(big, 50000, (val) => {
  results.push(val * 2);
}, () => {
  console.log('处理完成，共', results.length, '项');
});
```

---

#### 7. 实际代码：Stream 流式处理大文件

**概念**：不一次性读入内存，用 `createReadStream` 分块读取，每块通过 `data` 事件处理；适合大文件、日志解析等。

```javascript
const fs = require('fs');

function countLines(filePath, onDone) {
  let count = 0;
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });

  stream.on('data', (chunk) => {
    for (const c of chunk) {
      if (c === '\n') count++;
    }
  });

  stream.on('end', () => {
    onDone(count);
  });

  stream.on('error', (err) => {
    console.error('读取失败:', err);
  });
}

countLines('./large.log', (n) => console.log('行数:', n));
```

**3. 怎样绑定 Node 程序到 80 端口？**  
sudo 运行、或用 Nginx/Apache 反向代理、或 iptables 端口重定向。

**4. 有哪些方法可以让 Node 程序出错后自动重启？**  
runit、forever、pm2、nohup npm start & 等进程管理工具。

**5. 怎样充分利用多 CPU？**  
一个 CPU 跑一个 Node 实例（多进程/集群），或使用 PM2 cluster 模式。

**6. 怎样调节 Node 内存大小？**  
`--max-old-space-size`、`--max-new-space-size` 设置 V8 堆上限。

**7. 程序总是崩溃，怎样排查？**  
node --prof 分析热点；memwatch/heapdump 做内存快照对比，查泄漏。

**8. 有哪些方法可以防止程序崩溃？**  
try-catch、EventEmitter/Stream 的 error 事件、domain（已废弃）、静态检查、单元测试。

**9. 怎样调试 Node 程序？**  
node --inspect 或 node --debug + node-inspector；现代用 Chrome DevTools 连接。

**10. 如何捕获 Node 中的错误，有几种方法？**  
① 监听 error 事件（EventEmitter/Stream）；② Promise.catch；③ try-catch（async/await 或同步运行时异常）。

**用法详解与代码示例：**

- **事件循环顺序**：nextTick 在当前阶段末尾、下次事件循环前执行；setImmediate 在 check 阶段；setTimeout 在 timers 阶段。可参考 [event_loop.jpg](https://github.com/jimuyouyou/node-interview-questions/blob/master/event_loop.jpg)。
- **异步流程控制**：从回调 → Promise → async/await，避免回调地狱。

```javascript
// nextTick 与 setImmediate 顺序
process.nextTick(() => console.log('nextTick'));
setImmediate(() => console.log('setImmediate'));
setTimeout(() => console.log('setTimeout'), 0);
// 典型输出顺序：nextTick → setTimeout → setImmediate（或依环境略有不同）

// async/await 错误捕获
async function run() {
  try {
    const data = await fs.promises.readFile('a.txt', 'utf8');
    return data;
  } catch (err) {
    console.error(err);
  }
}
```

---

## 六、常用知名第三方类库

### Async

**常用方法**：async.parallel（并行）、async.series（串行）、async.waterfall（瀑布，前一步结果作后一步参数）、async.map、async.filter 等，用于回调风格异步流程控制。

### Express

**项目目录**：app.js、package.json、bin/www、public、routes、views 等。

**常用函数**：express.Router、app.get/post、app.configure、app.set、app.use（中间件）。

**获取路由参数**：`/users/:name` 用 `req.params.name`；表单用 `req.body.username`；路由支持 `?`、`+`、`*`、`()` 等。

**response 常用方法**：res.download、res.end、res.json、res.jsonp、res.redirect、res.render、res.send、res.sendFile、res.sendStatus。

---

## 七、其它相关后端常用技术

**MongoDB 优化**：索引、分片等，类似传统库。

**Mongoose**：MongoDB 的 ODM，Schema、Model、Instance；常用 save、update、find、findOne、findById、静态方法等。

**Redis 功能**：set/get、mset、hset/hmset/hmget/hgetall/hkeys、sadd/smembers、publish/subscribe、expire。

**Apache 与 Nginx 区别**：都是代理/Web 服务器；Apache 应用广泛、配置简单；Nginx 在分布式、静态资源、高并发方面更有优势。

---

## 八、常用前端技术

**HTML5 实用新功能**：File API、Canvas/SVG、拖拽、本地存储、表单验证、音视频等。

**CSS3/jQuery 常见选择器**：id、元素、属性、值、父子兄弟、序列等。

**jQuery 经典应用**：DOM 选择与操作、动画、Ajax、JSON、插件扩展。

---

## 参考

- 仓库：[jimuyouyou/node-interview-questions](https://github.com/jimuyouyou/node-interview-questions)  
- [Event Loop, Timers, and process.nextTick](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)

以上按 README 大纲组织，便于按模块复习与面试速查。
