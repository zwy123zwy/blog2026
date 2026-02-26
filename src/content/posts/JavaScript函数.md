---
title: JavaScript 函数
published: 2026-02-15
description: 'JavaScript 函数：声明与表达式、箭头函数、this 与闭包、参数与返回值'
image: ''
tags: [JavaScript, 函数]
category: ''
draft: false
lang: 'zh-cn'
---

# JavaScript 函数

### 函数声明与函数表达式

- **函数声明**：`function name() {}`，会提升（hoisting），可在声明前调用。
- **函数表达式**：`const fn = function () {}` 或 `const fn = function name() {}`，不会提升，赋值前不可调用。
- **命名函数表达式**：`const f = function inner() {}`，`inner` 仅在函数体内可访问，常用于递归或调试。

---

### 箭头函数

- 语法：`(params) => expression` 或 `(params) => { statements }`。
- 无自己的 `this`：继承定义时的外层 `this`（词法 this）。
- 无 `arguments`，可用剩余参数 `...args`。
- 不能作为构造函数（`new` 会报错），无 `prototype`。
- 适合回调、简短函数；需要动态 `this` 或 `arguments` 时用普通函数。

---

### 参数与返回值

- **形参与实参**：形参可带默认值 `function f(a = 1) {}`，默认值在未传或传 `undefined` 时生效。
- **剩余参数**：`function f(a, ...rest) {}`，`rest` 为剩余实参组成的数组。
- **返回值**：无 `return` 或 `return` 无值则返回 `undefined`；单值可省略 `return` 的块（箭头函数）。

---

### this 绑定

- **默认绑定**：独立调用时 `this` 为全局对象（严格模式下为 `undefined`）。
- **隐式绑定**：`obj.method()` 中 `this` 为 `obj`。
- **显式绑定**：`call(thisArg, ...args)`、`apply(thisArg, args)`、`bind(thisArg)(...args)`。
- **new 绑定**：`new F()` 时 `this` 指向新创建的对象。
- 箭头函数不参与上述规则，始终取定义时的外层 `this`。

---

### 闭包（Closure）

- **定义**：函数能够访问其词法作用域（定义时所在作用域）中的变量，即使在该作用域外执行。
- **常见用途**：数据私有、工厂函数、柯里化、防抖/节流、循环中保留索引等。
- **注意**：闭包会保持对外部变量的引用，不当使用可能造成内存占用或逻辑错误。

---

### 常见面试题（占位）

- 函数声明与函数表达式的区别？
- 箭头函数与普通函数的区别？
- 如何理解与改变 `this`？手写 `bind`？
- 什么是闭包？闭包会导致什么问题？
- 防抖与节流的区别与实现？

---

*（以上为文档骨架，可按需补充示例与详细说明。）*
