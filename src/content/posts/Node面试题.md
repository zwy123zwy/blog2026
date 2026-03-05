---
title: Node.js 面试题
published: 2026-02-26
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
简单（JS/JSON）、强大（非阻塞 I/O、高并发）、轻量（前后端统一语言）、可扩展（多实例、多机、丰富第三方库）。

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
