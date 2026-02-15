---
title: React
published: 2026-02-15
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: 'zh-cn'
---

# React

由Meta公司研发，是一个用于 构建Web和原生交互界面的库

*React 是一个用于**构建用户界面的、 声明式、组件化**的 JavaScript 库。*

**主要特点：**

- 组件（Component）
- 声明式界面编程（Declarative UI）
- 响应式 DOM 更新机制（Reactive DOM updates）

## HelloWorld

React的常规开发方式并不是通过浏览器引入外部js脚本来使用，但在入门阶段我们暂且先使用这种方式来简单体会一下React。

使用React开发Web项目，我们需要引入两个js脚本：**react 18**

```
react.development.js
```

- react 是react核心库，只要使用react就必须要引入

```
react-dom.development.js
```

- react-dom 是react的dom包，使用react开发web应用时必须引入

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>Hello React</title>
    <script src="script/react.development.js"></script>
    <script src="script/react-dom.development.js"></script>
</head>
<body>
    <div id="root"></div>
    <script>
      const button = React.createElement('button', {
         onClick: (e) => {
            alert('你点了按钮！');
            e.stopPropagation();
         }
      }, '我是一个按钮');

      const box = React.createElement('div', {
          onClick: (e) => {
          alert('你点了div！');
           console.log(e);
       }
    }, '我是一个div', button);

    const root = ReactDOM.createRoot(document.querySelector('#root'));

    root.render(box);

    </script>
</body>
</html>
```

**三者的区别**

- react：包含react所必须的核心代码
- react-dom：react渲染在不同平台所需要的核心代码
- babel：将jsx转换成React代码的工具 

## 三个API

- ```
  React.createElement()
  ```

  - `React.createElement(type, [props], [...children])`

  - 参数：

    type：表示要渲染的**元素类型**。这里可以传入一个元素 Tag 名称，也可以传入一个组件（如div span 等，也可以是是函数组件和类组件）

    props：**创建React元素所需要的props**。

    childrens（可选参数）：要渲染元素的子元素，这里可以向后传入n个参数。可以为文本字符串，也可以为数组

    用来创建React元素

  - React元素无法修改   返回的是虚拟dom对象

  ```javascript
  console.log(
    React.createElement(
      'h1',
      {
        className: 'title',
      },
      'Hello React'
    )
  )
  ```

  ![img](./img/3058803936-1121353711213220_fix732.png)
  返回的这个对象就是虚拟 DOM 了。

  我们来分析它返回的对象参数，首先第一个是

  - **`$$typeof: REACT_ELEMENT_TYPE`**

  这个是 React 元素对象的标识属性

  REACT_ELEMENT_TYPE 的值是一个 Symbol 类型，代表了一个独一无二的值。如果浏览器不支持 Symbol类型，值就是一个二进制值。

  > 为什么是 Symbol？主要防止 XSS 攻击伪造一个假的 React 组件。**因为 JSON 中是不会存在 Symbol 类型的。**

  - key：这个比如循环中会用到这个key值
  - props：传入的属性值，比如 id, className, style, children 等
  - ref： DOM 的引用

- ```js
  ReactDOM.createRoot()
  ```

  - `createRoot(container[, options])`
  - 用来创建React的根容器，容器用来放置React元素

  **`createRoot(domNode, options?)`** 

  调用 `createRoot` 以在浏览器 DOM 元素中创建根节点显示内容。

  ```js
  import { createRoot } from 'react-dom/client';
  const domNode = document.getElementById('root');
  const root = createRoot(domNode);
  ```

  React 将会为 `domNode` 创建一个根节点，并控制其中的 DOM。在已经创建根节点之后，需要调用 [`root.render`](https://zh-hans.react.dev/reference/react-dom/client/createRoot#root-render) 来显示 React 组件：

  ```js
  root.render(<App />);
  ```

  对于一个完全用 React 构建的应用程序，通常会调用一个 `createRoot` 来创建它的根节点。而对于一个使用了“少量” React 来创建部分内容的应用程序，则要按具体需求来确定根节点的数量。

  **参数** 

  - `domNode`：一个 [DOM 元素](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)。React 将为这个 DOM 元素创建一个根节点然后允许你在这个根节点上调用函数，比如 `render` 来显示渲染的 React 内容。
  - **可选** `options`：用于配置这个 React 根节点的对象。
    - **可选** `onRecoverableError`：回调函数，在 React 从异常错误中恢复时自动调用。
    - **可选** `identifierPrefix`：一个 React 用来配合 [`useId`](https://zh-hans.react.dev/reference/react/useId) 生成 id 的字符串前缀。在同一个页面上使用多个根节点的场景下，这将能有效避免冲突。

  **返回值** 

  `createRoot` 返回一个带有两个方法的的对象，这两个方法是：[`render`](https://zh-hans.react.dev/reference/react-dom/client/createRoot#root-render) 和 [`unmount`](https://zh-hans.react.dev/reference/react-dom/client/createRoot#root-unmount)。

  **注意** 

  - 如果应用程序是服务端渲染的，那么不能使用 `createRoot()`。请使用 [`hydrateRoot()`](https://zh-hans.react.dev/reference/react-dom/client/hydrateRoot) 替代它。
  - 在你的应用程序中，可能只调用了一次 `createRoot`。但如果你使用了框架，它可能已经自动帮你完成了这次调用。
  - 当你想要渲染一段 JSX，但是它存在于 DOM 树的其他位置，并非当前组件的子组件  时（比如，一个弹窗或者提示框），使用 [`createPortal`](https://zh-hans.react.dev/reference/react-dom/createPortal) 替代 `createRoot`。

- ```js
  root.render()
  ```

  - `root.render(element)`
  - 当首次调用时，容器节点里的所有 DOM 元素都会被替换，后续的调用则会使用 React 的 DOM 差分算法（DOM diffing algorithm）进行高效的更新。
  - 不会修改容器节点（只会修改容器的子节点）。可以在不覆盖现有子节点的情况下，将组件插入已有的 DOM 节点中。

  **`root.render(reactNode)`** 

  调用 `root.render` 以将一段 [JSX](https://zh-hans.react.dev/learn/writing-markup-with-jsx)（“React 节点”）在 React 的根节点中渲染为 DOM 节点并显示。

  ```
  root.render(<App />);
  ```

  React 将会在 `根节点` 中显示 `<App />` 组件，并且控制组件中的 DOM。

  **参数** 

  - `reactNode`：一个你想要显示的 **React 节点**。它总是一段 JSX，就像 `<App />`，但是你也总是可以传递一个 [`createElement()`](https://zh-hans.react.dev/reference/react/createElement) 构造的 React 元素、一个字符串、一个数字、`null` 或者 `undefined`。

  **返回值** 

  `root.render` 返回 `undefined`。

  **注意** 

  - 首次调用 `root.render` 时，React 会先清空根节点中所有已经存在的 HTML，然后才会渲染 React 组件。
  - 如果你的根节点包含了由 React 在构建期间通过服务端渲染生成的 HTML 内容，请使用 [`hydrateRoot()`](https://zh-hans.react.dev/reference/react-dom/client/hydrateRoot) 替代这个方法，这样才能把事件处理程序和现有的 HTML 绑定。

  如果你在一个根节点上多次调用了 `render`，React 仍然会更新 DOM，这样才能保证显示的内容是最新的。React 将会筛选出可复用的部分和需要更新的部分，对于需要更新的部分，是 React 通过与之前渲染的树进行 [“比较”](https://zh-hans.react.dev/learn/preserving-and-resetting-state) 得到的。在同一个根节点上再次调用 `render` 就和在根节点上调用 [`set` 函数](https://zh-hans.react.dev/reference/react/useState#setstate) 类似：React 会避免没必要的 DOM 更新。

  ------

  **`root.unmount()`** 

  调用 `root.unmount` 以销毁 React 根节点中的一个已经渲染的树。

  ```
  root.unmount();
  ```

  通常情况下，一个完全由 React 构建的应用程序不会调用 `root.unmount`。

  此方法适用的场景是，React 根节点中的 DOM 节点（或者它的任何一个父级节点）被除了这个方法以外的代码移除了。举个例子，试想在一个 jQuery 选项卡面板中，非活跃状态的选项卡的 DOM 结构将被移除。一个标签页被移除时，它内部的所有内容（包括 React 根节点）也将会从 DOM 树移除。在这种情况下，你才需要调用 `root.unmount` 来通知 React “停止”控制已经被移除的根节点的内容。否则，被移除的根节点的内部组件就不能及时释放消息订阅等资源。

  调用 `root.unmout` 将卸载根节点内的所有组件，该根节点上的 React 将被剥离，即所有事件处理程序以及组件树上的状态将被移除。

  **参数** 

  `root.unmount` 不接收任何参数。

  **返回值** 

  `root.unmount` 返回 `undefined`。

  **注意事项** 

  - 调用 `root.unmout` 将卸载根节点内的所有组件，该根节点上的 React 将被剥离，即所有事件处理程序以及组件树上的状态将被移除。
  - 一旦调用 `root.unmout`，就不能在该根节点上调用 `root.render`。在一个已经卸载的根节点上尝试调用 `root.render` 将会抛出异常错误信息“无法更新一个未挂载的根节点（Cannot update an unmouted root）”。不过，你可以在卸载一个根节点后又重新创建它



#  React 、 Vue 异同

**相似之处：**

- 都将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库
- 都有自己的构建工具，能让你得到一个根据最佳实践设置的项目模板。
- 都使用了Virtual DOM（虚拟DOM）提高重绘性能
- 都有props的概念，允许组件间的数据传递
- 都鼓励组件化应用，将应用分拆成一个个功能明确的模块，提高复用性



**不同之处：** 

**1）数据流**

Vue默认支持数据双向绑定，而React一直提倡单向数据流 

**2）虚拟DOM**

Vue2.x开始引入"Virtual DOM"，消除了和React在这方面的差异，但是在具体的细节还是有各自的特点。 

- Vue宣称可以更快地计算出Virtual DOM的差异，这是由于它在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。
- 对于React而言，每当应用的状态被改变时，全部子组件都会重新渲染。当然，这可以通过 PureComponent/shouldComponentUpdate这个生命周期方法来进行控制，但Vue将此视为默认的优化。

**3）组件化**

React与Vue最大的不同是模板的编写。

- Vue鼓励写近似常规HTML的模板。写起来很接近标准 HTML元素，只是多了一些属性。
- React推荐你所有的模板通用JavaScript的语法扩展——JSX书写。



具体来讲：React中render函数是支持闭包特性的，所以我们import的组件在render中可以直接调用。但是在Vue中，由于模板中使用的数据都必须挂在 this 上进行一次中转，所以 import 完组件之后，还需要在 components 中再声明下。

**4）监听数据变化的实现原理不同**

- Vue 通过 getter/setter 以及一些函数的劫持，能精确知道数据变化，不需要特别的优化就能达到很好的性能
- React 默认是通过比较引用的方式进行的，如果不优化（PureComponent/shouldComponentUpdate）可能导致大量不必要的vDOM的重新渲染。这是因为 Vue 使用的是可变数据，而React更强调数据的不可变。

**5）高阶组件**

react可以通过高阶组件（Higher Order Components-- HOC）来扩展，而vue需要通过mixins来扩展。



原因高阶组件就是高阶函数，而React的组件本身就是纯粹的函数，所以高阶函数对React来说易如反掌。相反Vue.js使用HTML模板创建视图组件，这时模板无法有效的编译，因此Vue不采用HOC来实现。

**6）构建工具**

两者都有自己的构建工具

- React ==> Create React APP
- Vue ==> vue-cli

**7）跨平台**

- React ==> React Native
- Vue ==> Weex



# React 渲染

##  哪些方法会触发 React 重新渲染？重新渲染 render 会做些什么？

**（1）哪些方法会触发 react 重新渲染?** 

- **setState（）方法被调用**

setState 是 React 中最常用的命令，通常情况下，执行 setState 会触发 render。但是这里有个点值得关注，执行 setState 的时候不一定会重新渲染。当 setState 传入 null 时，并不会触发 render。

```javascript
class App extends React.Component {
  state = {
    a: 1
  };

  render() {
    console.log("render");
    return (
      <React.Fragement>
        <p>{this.state.a}</p>
        <button
          onClick={() => {
            this.setState({ a: 1 }); // 这里并没有改变 a 的值
          }}
        >
          Click me
        </button>
        <button onClick={() => this.setState(null)}>setState null</button>
        <Child />
      </React.Fragement>
    );
  }
}
```

- **父组件重新渲染**

只要父组件重新渲染了，即使传入子组件的 props 未发生变化，那么子组件也会重新渲染，进而触发 render



**（2）重新渲染 render 会做些什么?**

- 会对新旧 VNode 进行对比，也就是我们所说的Diff算法。
- 对新旧两棵树进行一个深度优先遍历，这样每一个节点都会一个标记，在到深度遍历的时候，每遍历到一和个节点，就把该节点和新的节点树进行对比，如果有差异就放到一个对象里面
- 遍历差异对象，根据差异的类型，根据对应对规则更新VNode



React 的处理 render 的基本思维模式是每次一有变动就会去重新渲染整个应用。在 Virtual DOM 没有出现之前，最简单的方法就是直接调用 innerHTML。Virtual DOM厉害的地方并不是说它比直接操作 DOM 快，而是说不管数据怎么变，都会尽量以最小的代价去更新 DOM。React 将 render 函数返回的虚拟 DOM 树与老的进行比较，从而确定 DOM 要不要更新、怎么更新。当 DOM 树很大时，遍历两棵树进行各种比对还是相当耗性能的，特别是在顶层 setState 一个微小的修改，默认会去遍历整棵树。尽管 React 使用高度优化的 Diff 算法，但是这个过程仍然会损耗性能.

## React如何判断什么时候重新渲染组件？

组件状态的改变可以因为`props`的改变，或者直接通过`setState`方法改变。组件获得新的状态，然后React决定是否应该重新渲染组件。只要组件的state发生变化，React就会对组件进行重新渲染。这是因为React中的`shouldComponentUpdate`方法默认返回`true`，这就是导致每次更新都重新渲染的原因。



当React将要渲染组件时会执行`shouldComponentUpdate`方法来看它是否返回`true`（组件应该更新，也就是重新渲染）。所以需要重写`shouldComponentUpdate`方法让它根据情况返回`true`或者`false`来告诉React什么时候重新渲染什么时候跳过重新渲染。

## React setState 调用的原理

![img](./img/image.png)

具体的执行过程如下（源码级解析）：

- 首先调用了`setState` 入口函数，入口函数在这里就是充当一个分发器的角色，根据入参的不同，将其分发到不同的功能函数中去；

```javascript
ReactComponent.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};
```

- `enqueueSetState` 方法将新的 `state` 放进组件的状态队列里，并调用 `enqueueUpdate` 来处理将要更新的实例对象；

```javascript
enqueueSetState: function (publicInstance, partialState) {
  // 根据 this 拿到对应的组件实例
  var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');
  // 这个 queue 对应的就是一个组件实例的 state 数组
  var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
  queue.push(partialState);
  //  enqueueUpdate 用来处理当前的组件实例
  enqueueUpdate(internalInstance);
}
```

-  在 `enqueueUpdate` 方法中引出了一个关键的对象——`batchingStrategy`，该对象所具备的`isBatchingUpdates` 属性直接决定了当下是要走更新流程，还是应该排队等待；如果轮到执行，就调用 `batchedUpdates` 方法来直接发起更新流程。由此可以推测，`batchingStrategy` 或许正是 React 内部专门用于管控批量更新的对象。

```javascript
function enqueueUpdate(component) {
  ensureInjected();
  // 注意这一句是问题的关键，isBatchingUpdates标识着当前是否处于批量创建/更新组件的阶段
  if (!batchingStrategy.isBatchingUpdates) {
    // 若当前没有处于批量创建/更新组件的阶段，则立即更新组件
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }
  // 否则，先把组件塞入 dirtyComponents 队列里，让它“再等等”
  dirtyComponents.push(component);
  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}
```

**注意：**`batchingStrategy` 对象可以理解为“锁管理器”。这里的“锁”，是指 React 全局唯一的 `isBatchingUpdates` 变量，`isBatchingUpdates` 的初始值是 `false`，意味着“当前并未进行任何批量更新操作”。每当 React 调用 `batchedUpdate` 去执行更新动作时，会先把这个锁给“锁上”（置为 `true`），表明“现在正处于批量更新过程中”。当锁被“锁上”的时候，任何需要更新的组件都只能暂时进入 `dirtyComponents` 里排队等候下一次的批量更新，而不能随意“插队”。此处体现的“任务锁”的思想，是 React 面对大量状态仍然能够实现有序分批处理的基石。

![](./img/v2-9fcf2cfa698301ce7bc78bc3857904ed_1440w.png)

## requestIdleCallback、requestAnimationFrame

浏览器用于优化任务调度的两个关键API，其核心区别在于**执行时机、优先级和适用场景**。以下是详细对比：

------

### **1. 执行时机**

- **`requestAnimationFrame`（rAF）**
  - **触发时机**：在浏览器每一帧渲染前执行（约16.6ms/次，与屏幕刷新率同步）356。
  - **设计目标**：处理与渲染相关的任务（如动画、UI更新），确保任务在布局和绘制前完成。
  - **特点**：
    - 高优先级，每帧必定执行；
    - 页面隐藏时自动暂停，节省资源27。
- **`requestIdleCallback`（rIC）**
  - **触发时机**：在浏览器空闲时段执行（即一帧内主线程任务完成后，剩余时间超过16ms时）158。
  - **设计目标**：处理低优先级、非紧急任务（如日志上报、数据预加载）。
  - **特点**：
    - 低优先级，可能因浏览器繁忙而跳过执行；
    - 需通过`timeout`参数强制超时执行（可能引起卡顿）12。

------

###  **2. 优先级与性能影响**

| **特性**           | **rAF**              | **rIC**             |
| :----------------- | :------------------- | :------------------ |
| **优先级**         | 高（渲染关键路径）   | 低（空闲时段）      |
| **阻塞主线程风险** | 可能（若任务过重）   | 极低（任务可拆分）  |
| **影响FPS**        | 是（若超时导致丢帧） | 否（除非强制超时）2 |
| **执行可靠性**     | 高（每帧必执行）     | 低（依赖空闲状态）8 |

------

### 3. 适用场景

##### **`requestAnimationFrame`（rAF）**

- **动画**：CSS变换、Canvas动画36。
- **实时UI更新**：滚动效果、WebSocket数据实时渲染38。
- **高频交互**：确保流畅性，避免`setTimeout`丢帧56。

##### **`requestIdleCallback`（rIC）**

- **非关键任务**：日志上报、性能监控数据批量发送27。
- **后台计算**：AI推理、大数据处理38。
- **资源预加载**：非首屏图片或数据35。

> 💡 **关键区别**：
>
> - rAF 用于**视觉相关**任务，确保流畅渲染；
> - rIC 用于**非视觉相关**任务，避免抢占主线程36。

------

### **4. 使用注意事项**

##### **rAF 的陷阱**

- **避免重任务**：复杂计算会阻塞渲染，导致卡顿（需拆分任务）8。
- **隐藏页面暂停**：后台标签页中动画自动停止27。

##### **rIC 的陷阱**

- **禁止DOM操作**：
  空闲时段布局已确定，修改DOM会触发强制重排，严重损害性能15。
- **慎用Promise**：
  Promise回调可能在空闲结束后立即执行，拉长帧耗时1。
- **超时风险**：
  设置`timeout`可能强制执行，引发卡顿（超时任务需极轻量）18。

------

####  **5. 最佳实践**

1. **混合使用**：
   - 视觉动画用 **rAF**（如元素移动）6；
   - 非紧急任务用 **rIC**（如埋点上报）27。
2. **任务拆分**：
   - 在rIC回调中用`deadline.timeRemaining()`检查剩余时间，分段执行任务58。
3. **兼容性处理**：
   - rIC兼容性较差（不支持IE），可用`setTimeout(fn, 0)`降级8。

```js
// 示例：rIC 分段任务
function processTasks(deadline) {
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    executeTask(tasks.shift());
  }
  if (tasks.length > 0) {
    requestIdleCallback(processTasks, { timeout: 1000 });
  }
}
requestIdleCallback(processTasks);
```

------

###  **总结：核心区别**

| **维度**     | **requestAnimationFrame** | **requestIdleCallback** |
| :----------- | :------------------------ | :---------------------- |
| **本质**     | 渲染流水线的一部分        | 空闲时段的任务调度      |
| **优先级**   | 高（影响用户体验）        | 低（可被跳过）          |
| **执行保证** | 每帧必执行                | 依赖空闲时间            |
| **典型场景** | 动画、实时UI              | 日志、预加载、后台计算  |
| **风险操作** | 避免重计算                | 禁止DOM修改/Promise回调 |





## Fiber 

### **数据结构**

```js
{
  ...
  // 跟当前Fiber相关本地状态（比如浏览器环境就是DOM节点）
  stateNode: any,
    
    // 单链表树结构
  return: Fiber | null,// 指向他在Fiber节点树中的`parent`，用来在处理完这个节点之后向上返回
  child: Fiber | null,// 指向自己的第一个子节点
  sibling: Fiber | null,  // 指向自己的兄弟结构，兄弟节点的return指向同一个父节点

  // 更新相关
  pendingProps: any,  // 新的变动带来的新的props
  memoizedProps: any,  // 上一次渲染完成之后的props
  updateQueue: UpdateQueue<any> | null,  // 该Fiber对应的组件产生的Update会存放在这个队列里面
  memoizedState: any, // 上一次渲染的时候的state
    
  // Scheduler 相关
  expirationTime: ExpirationTime,  // 代表任务在未来的哪个时间点应该被完成，不包括他的子树产生的任务
  // 快速确定子树中是否有不在等待的变化
  childExpirationTime: ExpirationTime,
    
 // 在Fiber树更新的过程中，每个Fiber都会有一个跟其对应的Fiber
  // 我们称他为`current <==> workInProgress`
  // 在渲染完成之后他们会交换位置
  alternate: Fiber | null,

  // Effect 相关的
  effectTag: SideEffectTag, // 用来记录Side Effect
  nextEffect: Fiber | null, // 单链表用来快速查找下一个side effect
  firstEffect: Fiber | null,  // 子树中第一个side effect
  lastEffect: Fiber | null, // 子树中最后一个side effect
  ....
};
```


![](./img/v2-cfaea6c0e9362b3701b1cf342ed4588b_1440w.png)

### **构建流程**

1. **根节点启动**：

   - 从根 Fiber 节点开始
   - 创建对应的 WIP 节点（`workInProgressRoot`）

2. **节点克隆/创建**：

   - 检查当前节点是否有对应的 `alternate`（上次渲染的 Fiber）
   - 有则克隆，无则创建全新 Fiber 节点

3. **属性继承**：

   

   ```javascript
   // 复用状态和属性
   workInProgress.memoizedState = current.memoizedState;
   workInProgress.memoizedProps = current.memoizedProps;
   ```

4. **子节点处理**：

   - 递归处理每个子节点
   - 创建子 Fiber 节点并建立父子关系
   - 设置 `child`、`sibling`、`return` 指针

5. **深度优先遍历**：

   

   ```javascript
   function workLoopSync() {
     while (workInProgress !== null) {
       workInProgress = performUnitOfWork(workInProgress);
     }
   }
   ```

6. **完成节点**：

   - 当节点没有子节点时，调用 `completeUnitOfWork`
   - 处理兄弟节点或回溯到父节点

7. 指针关系示例



```javascript
// 父节点
const parentFiber = {
  child: child1, // 第一个子节点
  // ...
};

// 子节点1
const child1 = {
  sibling: child2, // 下一个兄弟节点
  return: parentFiber, // 指向父节点
  // ...
};

// 子节点2
const child2 = {
  sibling: null, // 最后一个节点
  return: parentFiber,
  // ...
};
```



### Diff 算法核心原则

| 原则         | 描述                  | 优势             |
| :----------- | :-------------------- | :--------------- |
| **同级比较** | 只比较同一层级节点    | O(n) 复杂度      |
| **Key 优化** | 使用 key 匹配相同节点 | 减少不必要的重建 |
| **类型优先** | 不同类型组件直接替换  | 避免无效比较     |
| **组件稳定** | 相同类型组件复用      | 保留状态和 DOM   |

![](./img/v2-8c3b88ee7471ba1303c4460967da36fa_1440w.png)





# **React 组件**

## React 高阶组件是什么，和普通组件有什么区别，适用什么场景

官方解释∶ 

高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

高阶组件（HOC）就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件，它只是一种组件的设计模式，这种设计模式是由react自身的组合性质必然产生的。我们将它们称为纯组件，因为它们可以接受任何动态提供的子组件，但它们不会修改或复制其输入组件中的任何行为。

```javascript
// hoc的定义
function withSubscription(WrappedComponent, selectData) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: selectData(DataSource, props)
      };
    }
    // 一些通用的逻辑处理
    render() {
      // ... 并使用新数据渲染被包装的组件!
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };

// 使用
const BlogPostWithSubscription = withSubscription(BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id));
```

**1）HOC的优缺点**

- 优点∶ 逻辑服用、不影响被包裹组件的内部逻辑。
- 缺点∶hoc传递给被包裹组件的props容易和被包裹后的组件重名，进而被覆盖



**2）适用场景**

- 代码复用，逻辑抽象 
- 渲染劫持 
- State 抽象和更改 
- Props 更改 



**3）具体应用例子** 

- **权限控制：**利用高阶组件的 **条件渲染** 特性可以对页面进行权限控制，权限控制一般分为两个维度：页面级别和 页面元素级别

```javascript
// HOC.js
function withAdminAuth(WrappedComponent) {
    return class extends React.Component {
        state = {
            isAdmin: false,
        }
        async UNSAFE_componentWillMount() {
            const currentRole = await getCurrentUserRole();
            this.setState({
                isAdmin: currentRole === 'Admin',
            });
        }
        render() {
            if (this.state.isAdmin) {
                return <WrappedComponent {...this.props} />;
            } else {
                return (<div>您没有权限查看该页面，请联系管理员！</div>);
            }
        }
    };
}

// pages/page-a.js
class PageA extends React.Component {
    constructor(props) {
        super(props);
        // something here...
    }
    UNSAFE_componentWillMount() {
        // fetching data
    }
    render() {
        // render page with data
    }
}
export default withAdminAuth(PageA);


// pages/page-b.js
class PageB extends React.Component {
    constructor(props) {
        super(props);
    // something here...
        }
    UNSAFE_componentWillMount() {
    // fetching data
    }
    render() {
    // render page with data
    }
}
export default withAdminAuth(PageB);
```

- **组件渲染性能追踪：**借助父组件子组件生命周期规则捕获子组件的生命周期，可以方便的对某个组件的渲染时间进行记录∶

```javascript
class Home extends React.Component {
        render() {
            return (<h1>Hello World.</h1>);
        }
    }
    function withTiming(WrappedComponent) {
        return class extends WrappedComponent {
            constructor(props) {
                super(props);
                this.start = 0;
                this.end = 0;
            }
            UNSAFE_componentWillMount() {
                super.componentWillMount && super.componentWillMount();
                this.start = Date.now();
            }
            componentDidMount() {
                super.componentDidMount && super.componentDidMount();
                this.end = Date.now();
                console.log(`${WrappedComponent.name} 组件渲染时间为 ${this.end - this.start} ms`);
            }
            render() {
                return super.render();
            }
        };
    }

    export default withTiming(Home);   
```

注意：withTiming 是利用 反向继承 实现的一个高阶组件，功能是计算被包裹组件（这里是 Home 组件）的渲染时间。

- **页面复用**

```javascript
const withFetching = fetching => WrappedComponent => {
    return class extends React.Component {
        state = {
            data: [],
        }
        async UNSAFE_componentWillMount() {
            const data = await fetching();
            this.setState({
                data,
            });
        }
        render() {
            return <WrappedComponent data={this.state.data} {...this.props} />;
        }
    }
}

// pages/page-a.js
export default withFetching(fetching('science-fiction'))(MovieList);
// pages/page-b.js
export default withFetching(fetching('action'))(MovieList);
// pages/page-other.js
export default withFetching(fetching('some-other-type'))(MovieList);
```





## 类组件与函数组件有什么异同

**相同点：**

**组件是 React 可复用的最小代码片段**，它们会返回要在页面中渲染的 React 元素。也正因为组件是 React 的最小编码单位，所以无论是函数组件还是类组件，在使用方式和最终呈现效果上都是完全一致的。



我们甚至可以将一个类组件改写成函数组件，或者把函数组件改写成一个类组件（虽然并不推荐这种重构行为）。从使用者的角度而言，很难从使用体验上区分两者，而且在现代浏览器中，闭包和类的性能只在极端场景下才会有明显的差别。所以，基本可认为两者作为组件是完全一致的。



**不同点：**

- 它们在开发时的心智模型上却存在巨大的差异。**类组件是基于面向对象编程的**，它主打的是继承、生命周期等核心概念；而**函数组件内核是函数式编程**，主打的是 immutable、没有副作用、引用透明等特点。
- 之前，在使用场景上，如果存在需要使用生命周期的组件，那么主推类组件；设计模式上，如果需要使用继承，那么主推类组件。但现在由于 React Hooks 的推出，生命周期概念的淡出，函数组件可以完全取代类组件。其次继承并不是组件最佳的设计模式，官方更推崇“组合优于继承”的设计概念，所以类组件在这方面的优势也在淡出。
- 性能优化上，**类组件主要依靠 shouldComponentUpdate 阻断渲染来提升性能**，
      而**函数组件依靠 React.memo 缓存渲染结果来提升性能**。
- 从上手程度而言，类组件更容易上手，从未来趋势上看，由于React Hooks 的推出，函数组件成了社区未来主推的方案。
- 类组件在未来时间切片与并发模式中，由于生命周期带来的复杂度，并不易于优化。而函数组件本身轻量简单，且**在 Hooks 的基础上提供了比原先更细粒度的逻辑组织与复用**，更能适应 React 的未来发展。





## 组件通信

- **⽗组件向⼦组件通讯**: ⽗组件可以向⼦组件通过传 props 的⽅式，向⼦组件进⾏通讯 
- **⼦组件向⽗组件通讯**: props+回调的⽅式，⽗组件向⼦组件传递props进⾏通讯，此props为作⽤域为⽗组件⾃身的函 数，⼦组件调⽤该函数，将⼦组件想要传递的信息，作为参数，传递到⽗组件的作⽤域中 
- **兄弟组件通信**: 找到这两个兄弟节点共同的⽗节点,结合上⾯两种⽅式由⽗节点转发信息进⾏通信 
- **跨层级通信**: Context 设计⽬的是为了共享那些对于⼀个组件树⽽⾔是“全局”的数据，例如当前认证的⽤户、主题或⾸选语⾔，对于跨越多层的全局数据通过 Context 通信再适合不过 
- **发布订阅模式**: 发布者发布事件，订阅者监听事件并做出反应,我们可以通过引⼊event模块进⾏通信 
- **全局状态管理⼯具**: 借助Redux或者Mobx等全局状态管理⼯具进⾏通信,这种⼯具会维护⼀个全局状态中⼼Store,并根据不同的事件产⽣新的状态





# 事件机制

一个事件触发后，会在子元素和父元素之间传播（propagation）。这种传播分成三个阶段

![img](./img/2019011111581623.jpg)

如上图所示，事件传播分成三个阶段：

捕获阶段：从window对象传导到目标节点（上层传到底层）称为“捕获阶段”（capture phase），捕获阶段不会响应任何事件；
目标阶段：在目标节点上触发，称为“目标阶段”
冒泡阶段：从目标节点传导回window对象（从底层传回上层），称为“冒泡阶段”（bubbling phase）。事件代理即是利用事件冒泡的机制把里层所需要响应的事件绑定到外层；
**事件代理**

事件代理（Event Delegation），又称之为事件委托。是JavaScript中常用绑定事件的常用技巧。顾名思义，“事件代理”即是把原本需要绑定在子元素的响应事件（click、keydown......）委托给父元素，让父元素担当事件监听的职务。事件代理的原理是DOM元素的事件冒泡在React中事件需要通过元素的属性来设置，

### React 事件机制

```javascript
<div onClick={this.handleClick.bind(this)}>点我</div>
```

React并不是将click事件绑定到了div的真实DOM上，而是**在document处监听了所有的事件，当事件发生并且<font color="red">冒泡</font>到document处的时候，React将事件内容封装并交由真正的处理函数运行**。这样的方式不仅仅减少了内存的消耗，还能在组件挂在销毁时统一订阅和移除事件。

React **基于 Virtual DOM 实现了一个SyntheticEvent（合成事件）层，我们所定义的事件处理器会接收到一个SyntheticEvent对象的实例**。与原生事件直接在元素上注册的方式不同的是，react的合成事件不会直接绑定到目标dom节点上，用事件委托机制，以队列的方式，从触发事件的组件向父组件回溯直到document节点，因此**React组件上声明的事件最终绑定到了document 上**。用一个统一的监听器去监听，这个监听器上保存着目标节点与事件对象的映射，当组件挂载或卸载时，只是在这个统一的事件监听器上插入或删除一些对象；当事件发生时，首先被这个统一的事件监听器处理，然后在映射里找到真正的事件处理函数并调用





除此之外，冒泡到document上的事件也不是原生的浏览器事件，而是由react自己实现的合成事件（SyntheticEvent）。因此如果不想要是事件冒泡的话应该调用**event.preventDefault()方法**，而不是调用event.stopProppagation()方法。

![img](./img/77fa6b2a59c92e160bc171f9c80783e7.jpg)

**JSX 上写的事件并没有绑定在对应的真实 DOM 上，而是通过事件代理的方式，将所有的事件都统一绑定在了 `document` 上。这样的方式不仅减少了内存消耗，还能在组件挂载销毁时统一订阅和移除事件。**



另外冒泡到 `document` 上的事件也不是原生浏览器事件，而是 React 自己实现的合成事件（SyntheticEvent）。因此我们如果不想要事件冒泡的话，调用 `event.stopPropagation` 是无效的，而应该调用 `event.preventDefault`。



实现合成事件的目的如下：

- 合成事件首先抹平了浏览器之间的兼容问题，另外这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力；
- 对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题。但是对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象。

### React的事件和普通的HTML事件有什么不同？

区别：

- 对于事件名称命名方式，原生事件为全小写，**react 事件采用小驼峰**；

- 对于事件函数处理语法，原生事件为字符串，**react 事件为函数**； 

  和原生JS不同，在React中事件的属性需要使用驼峰命名法：

  onclick -> onClick

  onchange -> onChange

  属性值不能直接执行代码，而是需要一个回调函数：

  onclick="alert(123)"
  onClick={()=>{alert(123)}}
  onClick={handler}

- react 事件不能采用 return false 的方式来阻止浏览器的默认行为，而必须要地明确地调用`preventDefault()`来阻止默认行为。



合成事件是 react 模拟原生 DOM 事件所有能力的一个事件对象，其优点如下：

- 兼容所有浏览器，更好的跨平台；
- 将事件统一存放在一个数组，避免频繁的新增与删除（垃圾回收）。
- 方便 react 统一管理和事务机制。

事件的执行顺序为**原生事件先执行，合成事件后执行**，**合成事件会冒泡绑定到 document 上**，所以尽量避免原生事件与合成事件混用，如果**原生事件阻止冒泡，可能会导致合成事件不执行**，因为需要冒泡到document 上合成事件才会执行。



# 生命周期

![image-20240225161622185](./img/image-20240225161622185.png)

**新的生命周期**

![image-20240225160610933](./img/image-20240225160610933.png)

## React的生命周期有哪些？

 React 通常将组件生命周期分为三个阶段：

- 装载阶段（Mount），组件第一次在DOM树中被渲染的过程；
- 更新过程（Update），组件状态发生变化，重新更新渲染的过程；
- 卸载过程（Unmount），组件从DOM树中被移除的过程；

![img](./img/image1111111.png)

### 1）组件挂载阶段

挂载阶段组件被创建，然后组件实例插入到 DOM 中，完成组件的第一次渲染，该过程只会发生一次，在此阶段会依次调用以下这些方法：

- constructor
- getDerivedStateFromProps
- render
- componentDidMount

#### （1）constructor

组件的构造函数，第一个被执行，若没有显式定义它，会有一个默认的构造函数，但是若显式定义了构造函数，我们必须在构造函数中执行 `super(props)`，否则无法在构造函数中拿到this。



如果不初始化 state 或不进行方法绑定，则不需要为 React 组件实现构造函数**Constructor**。



constructor中通常只做两件事： 

- 初始化组件的 state
- 给事件处理方法绑定 this

```javascript
constructor(props) {
  super(props);
  // 不要在构造函数中调用 setState，可以直接给 state 设置初始值
  this.state = { counter: 0 }
  this.handleClick = this.handleClick.bind(this)
}
```

#### （2）getDerivedStateFromProps

```javascript
static getDerivedStateFromProps(props, state)
```

这是个静态方法，所以不能在这个函数里使用 `this`，有两个参数 `props` 和 `state`，分别指接收到的新参数和当前组件的 `state` 对象，这个函数会返回一个对象用来更新当前的 `state` 对象，如果不需要更新可以返回 `null`。



该函数会在装载时，接收到新的 `props` 或者调用了 `setState` 和 `forceUpdate` 时被调用。如当接收到新的属性想修改 `state` ，就可以使用。

```javascript
// 当 props.counter 变化时，赋值给 state 
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 0
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (props.counter !== state.counter) {
      return {
        counter: props.counter
      }
    }
    return null
  }
  
  handleClick = () => {
    this.setState({
      counter: this.state.counter + 1
    })
  }
  render() {
    return (
      <div>
        <h1 onClick={this.handleClick}>Hello, world!{this.state.counter}</h1>
      </div>
    )
  }
}
```

现在可以显式传入 `counter` ，但是这里有个问题，如果想要通过点击实现 `state.counter` 的增加，但这时会发现值不会发生任何变化，一直保持 `props` 传进来的值。这是由于在 React 16.4^ 的版本中 `setState` 和 `forceUpdate` 也会触发这个生命周期，所以当组件内部 `state` 变化后，就会重新走这个方法，同时会把 `state` 值赋值为 `props` 的值。因此需要多加一个字段来记录之前的 `props` 值，这样就会解决上述问题。具体如下：

```javascript
// 这里只列出需要变化的地方
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 增加一个 preCounter 来记录之前的 props 传来的值
      preCounter: 0,
      counter: 0
    }
  }
  static getDerivedStateFromProps(props, state) {
    // 跟 state.preCounter 进行比较
    if (props.counter !== state.preCounter) {
      return {
        counter: props.counter,
        preCounter: props.counter
      }
    }
    return null
  }
  handleClick = () => {
    this.setState({
      counter: this.state.counter + 1
    })
  }
  render() {
    return (
      <div>
        <h1 onClick={this.handleClick}>Hello, world!{this.state.counter}</h1>
      </div>
    )
  }
}
```

#### （3）render

render是React 中最核心的方法，一个组件中必须要有这个方法，它会根据状态 `state` 和属性 `props` 渲染组件。这个函数只做一件事，就是返回需要渲染的内容，所以不要在这个函数内做其他业务逻辑，通常调用该方法会返回以下类型中一个：

- **React 元素**：这里包括原生的 DOM 以及 React 组件；
- **数组和 Fragment（片段）**：可以返回多个元素；
- **Portals（插槽）**：可以将子元素渲染到不同的 DOM 子树种；
- **字符串和数字**：被渲染成 DOM 中的 text 节点；
- **布尔值或 null**：不渲染任何内容。

#### （4）componentDidMount() 

componentDidMount()会在组件挂载后（插入 DOM 树中）立即调。该阶段通常进行以下操作：

- 执行依赖于DOM的操作；
- 发送网络请求；（官方建议）
- 添加订阅消息（会在componentWillUnmount取消订阅）；



如果在 `componentDidMount` 中调用 `setState` ，就会触发一次额外的渲染，多调用了一次 `render` 函数，由于它是在浏览器刷新屏幕前执行的，所以用户对此是没有感知的，但是我应当避免这样使用，这样会带来一定的性能问题，尽量是在 `constructor` 中初始化 `state` 对象。



在组件装载之后，将计数数字变为1：

```javascript
class App extends React.Component  {
  constructor(props) {
    super(props)
    this.state = {
      counter: 0
    }
  }
  componentDidMount () {
    this.setState({
      counter: 1
    })
  }
  render ()  {
    return (
      <div className="counter">
        counter值: { this.state.counter }
      </div>
    )
  }
}
```

### 2）组件更新阶段

当组件的 `props` 改变了，或组件内部调用了 `setState/forceUpdate`，会触发更新重新渲染，这个过程可能会发生多次。这个阶段会依次调用下面这些方法：

- getDerivedStateFromProps
- shouldComponentUpdate
- render
- getSnapshotBeforeUpdate
- componentDidUpdate

#### （1）shouldComponentUpdate

```javascript
shouldComponentUpdate(nextProps, nextState)
```

在说这个生命周期函数之前，来看两个问题：

- **setState 函数在任何情况下都会导致组件重新渲染吗？例如下面这种情况：**

```javascript
this.setState({number: this.state.number})
```

- **如果没有调用 setState，props 值也没有变化，是不是组件就不会重新渲染？**



第一个问题答案是 **会** ，第二个问题如果是父组件重新渲染时，不管传入的 props 有没有变化，都会引起子组件的重新渲染。



那么有没有什么方法解决在这两个场景下不让组件重新渲染进而提升性能呢？这个时候 `shouldComponentUpdate` 登场了，这个生命周期函数是用来提升速度的，它是在重新渲染组件开始前触发的，默认返回 `true`，可以比较 `this.props` 和 `nextProps` ，`this.state` 和 `nextState` 值是否变化，来确认返回 true 或者 `false`。当返回 `false` 时，组件的更新过程停止，后续的 `render`、`componentDidUpdate` 也不会被调用。



**注意：**添加 `shouldComponentUpdate` 方法时，不建议使用深度相等检查（如使用 `JSON.stringify()`），因为深比较效率很低，可能会比重新渲染组件效率还低。而且该方法维护比较困难，建议使用该方法会产生明显的性能提升时使用。

#### （2）getSnapshotBeforeUpdate

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

这个方法在 `render` 之后，`componentDidUpdate` 之前调用，有两个参数 `prevProps` 和 `prevState`，表示更新之前的 `props` 和 `state`，这个函数必须要和 `componentDidUpdate` 一起使用，并且要有一个返回值，默认是 `null`，这个返回值作为第三个参数传给 `componentDidUpdate`。

#### （3）componentDidUpdate

componentDidUpdate() 会在更新后会被立即调用，首次渲染不会执行此方法。 该阶段通常进行以下操作：

- 当组件更新后，对 DOM 进行操作； 
- 如果你对更新前后的 props 进行了比较，也可以选择在此处进行网络请求；（例如，当 props 未发生变化时，则不会执行网络请求）。 

```javascript
componentDidUpdate(prevProps, prevState, snapshot){}
```

该方法有三个参数：

- prevProps: 更新前的props
- prevState: 更新前的state
- snapshot: getSnapshotBeforeUpdate()生命周期的返回值

### 3）组件卸载阶段

卸载阶段只有一个生命周期函数，componentWillUnmount() 会在组件卸载及销毁之前直接调用。在此方法中执行必要的清理操作：

- 清除 timer，取消网络请求或清除
- 取消在 componentDidMount() 中创建的订阅等；

这个生命周期在一个组件被卸载和销毁之前被调用，因此你不应该再这个方法中使用 `setState`，因为组件一旦被卸载，就不会再装载，也就不会重新渲染。

### 4）错误处理阶段

componentDidCatch(error, info)，此生命周期在后代组件抛出错误后被调用。 它接收两个参数∶

- error：抛出的错误。
- info：带有 componentStack key 的对象，其中包含有关组件引发错误的栈信息



React常见的生命周期如下：

![img](./img/image222222.png)

**React常见生命周期的过程大致如下：**

- 挂载阶段，首先执行constructor构造方法，来创建组件
- 创建完成之后，就会执行render方法，该方法会返回需要渲染的内容
- 随后，React会将需要渲染的内容挂载到DOM树上
- **挂载完成之后就会执行****componentDidMount生命周期函数**
- 如果我们给组件创建一个props（用于组件通信）、调用setState（更改state中的数据）、调用forceUpdate（强制更新组件）时，都会重新调用render函数
- render函数重新执行之后，就会重新进行DOM树的挂载
- **挂载完成之后就会执行****componentDidUpdate生命周期函数**
- **当移除组件时，就会执行****componentWillUnmount生命周期函数**



**React主要生命周期总结：**

1. **getDefaultProps**：这个函数会在组件创建之前被调用一次（有且仅有一次），它被用来初始化组件的 Props；
2. **getInitialState**：用于初始化组件的 state 值；
3. **componentWillMount**：在组件创建后、render 之前，会走到 componentWillMount 阶段。这个阶段我个人一直没用过、非常鸡肋。后来React 官方已经不推荐大家在 componentWillMount 里做任何事情、到现在 **React16 直接废弃了这个生命周期**，足见其鸡肋程度了；
4. **render**：这是所有生命周期中唯一一个你必须要实现的方法。一般来说需要返回一个 jsx 元素，这时 React 会根据 props 和 state 来把组件渲染到界面上；不过有时，你可能不想渲染任何东西，这种情况下让它返回 null 或者 false 即可；
5. **componentDidMount**：会在组件挂载后（插入 DOM 树中后）立即调用，标志着组件挂载完成。一些操作如果依赖获取到 DOM 节点信息，我们就会放在这个阶段来做。此外，这还是 React 官方推荐的发起 ajax 请求的时机。该方法和 componentWillMount 一样，有且仅有一次调用。

# Redux

## 基本原理

![image-20240225215635333](./img/image-20240225215635333.png)

## 如何使用

### createStore

`createStore` 函数通常是用于创建 Redux store 的函数。Redux 是一个用于管理 JavaScript 应用程序状态的流行库。让我们来解析 `createStore` 函数的一般结构和作用：

```javascript
function createStore(reducer, preloadedState, enhancer) {
  // 内部状态 state
  let currentState = preloadedState;
  // 内部订阅者列表
  let currentListeners = [];
  
  // 获取当前状态
  function getState() {
    return currentState;
  }

  // 修改状态的唯一方式，通过派发 action
  function dispatch(action) {
    // 调用 reducer 来获取新的状态
    currentState = reducer(currentState, action);
    // 触发所有订阅者
    currentListeners.forEach(listener => listener());
    return action;
  }

  // 订阅状态的变化，每当状态变化时执行回调函数
  function subscribe(listener) {
    // 将传入的回调函数加入到订阅者列表中
    currentListeners.push(listener);
    // 返回一个取消订阅的函数
    return function unsubscribe() {
      // 将该回调函数从订阅者列表中移除
      const index = currentListeners.indexOf(listener);
      currentListeners.splice(index, 1);
    };
  }

  // 替换 reducer 的函数，用于动态地改变 reducer
  function replaceReducer(nextReducer) {
    reducer = nextReducer;
    // 调用 dispatch 一个内置的动作，以便更新状态
    dispatch({ type: '@@redux/INIT' });
  }

  // 初始化 store，调用 reducer 以获取初始状态，并返回一个 store 对象
  dispatch({ type: '@@redux/INIT' });

  // 返回 store 对象，包含 getState、dispatch、subscribe 和 replaceReducer 方法
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  };
}
```

现在让我来解释一下 `createStore` 函数的各个部分：

1. **参数**：

   ​    在 `createStore` 函数中涉及到的核心数据类型主要有以下几种：

   1. **reducer**：`reducer` 是一个函数，接收当前状态 (`state`) 和一个动作 (`action`)，并返回一个新的状态。它是一个纯函数，通常是通过 `switch` 语句来根据不同的动作类型进行状态更新的。动作类型通常是一个字符串，表示对状态进行何种操作，例如 `'INCREMENT'`、`'DECREMENT'` 等。
   2. **preloadedState**：`preloadedState` 是一个 JavaScript 对象，表示应用程序的初始状态。它是可选的，如果不提供则状态将被初始化为 `undefined`，然后在调用 `reducer` 时被设置为 `reducer` 函数的默认值。
   3. **currentState**：`currentState` 是一个变量，用于存储当前的应用程序状态。它会随着动作的派发而改变，通过调用 `reducer` 函数计算出新的状态。
   4. **currentListeners**：`currentListeners` 是一个数组，用于存储所有订阅状态变化的回调函数。每当状态发生变化时，这些回调函数将会被依次调用。
   5. **action**：`action` 是一个普通的 JavaScript 对象，必须包含一个 `type` 字段，表示动作的类型。除了 `type` 字段之外，`action` 对象可以包含其他字段，用于传递数据给 `reducer` 函数。
   6. **store**：`store` 是一个对象，包含了 `dispatch`、`subscribe`、`getState` 和 `replaceReducer` 方法。它是整个 Redux 应用程序的核心，用于管理状态的变化和订阅状态变化。

   ​    7.`enhancer` (可选): 一个函数，用于增强 `store` 的功能，例如中间件等。

2. **内部变量**：

   - `currentState`: 存储当前状态的变量。
   - `currentListeners`: 一个数组，包含当前订阅状态变化的所有回调函数。

3. **方法**：

   - `getState()`: 返回当前存储的状态。
   - `dispatch(action)`: 接收一个动作并触发状态变化。它通过调用 reducer 函数来计算新的状态，并通知所有的订阅者。
   - `subscribe(listener)`: 接收一个回调函数作为参数，每当状态发生变化时就会调用该回调函数。
   - `replaceReducer(nextReducer)`: 用于动态替换 reducer 函数。

4. **初始化**：

   - 在初始化过程中，会调用 `dispatch({ type: '@@redux/INIT' })` 来获取初始状态。

5. **返回值**：

   - 返回一个包含 `dispatch`、`subscribe`、`getState` 和 `replaceReducer` 方法的对象，也就是 Redux 的 `store`。

PS:`redux` 发布 `4.2.0` 版本，该版本将原始 `createStore API` 标记为 `@deprecated`(废弃)，并且添加了一个全新的 `legacy_createStore API`，但是并没有添加弃用警告。



### 对 Redux 的理解，主要解决什么问题

React是视图层框架。Redux是一个用来管理数据状态和UI状态的JavaScript应用工具。随着JavaScript单页应用（SPA）开发日趋复杂， JavaScript需要管理比任何时候都要多的state（状态）， Redux就是降低管理难度的。（Redux支持React、Angular、jQuery甚至纯JavaScript）。



在 React 中，UI 以组件的形式来搭建，组件之间可以嵌套组合。但 React 中组件间通信的数据流是单向的，顶层组件可以通过 props 属性向下层组件传递数据，而下层组件不能向上层组件传递数据，兄弟组件之间同样不能。这样简单的单向数据流支撑起了 React 中的数据可控性。



当项目越来越大的时候，管理数据的事件或回调函数将越来越多，也将越来越不好管理。管理不断变化的 state 非常困难。如果一个 model 的变化会引起另一个 model 变化，那么当 view 变化时，就可能引起对应 model 以及另一个 model 的变化，依次地，可能会引起另一个 view 的变化。直至你搞不清楚到底发生了什么。state 在什么时候，由于什么原因，如何变化已然不受控制。 当系统变得错综复杂的时候，想重现问题或者添加新功能就会变得举步维艰。如果这还不够糟糕，考虑一些来自前端开发领域的新需求，如更新调优、服务端渲染、路由跳转前请求数据等。state 的管理在大项目中相当复杂。



Redux 提供了一个叫 store 的统一仓储库，组件通过 dispatch 将 state 直接传入store，不用通过其他的组件。并且组件通过 subscribe 从 store获取到 state 的改变。使用了 Redux，所有的组件都可以从 store 中获取到所需的 state，他们也能从store 获取到 state 的改变。这比组件之间互相传递数据清晰明朗的多。



**主要解决的问题：**

单纯的Redux只是一个状态机，是没有UI呈现的，react- redux作用是将Redux的状态机和React的UI呈现绑定在一起，当你dispatch action改变state的时候，会自动更新页面。

### 2. Redux 原理及工作流程

**（1）原理**

Redux源码主要分为以下几个模块文件

- compose.js 提供从右到左进行函数式编程
- createStore.js 提供作为生成唯一store的函数
- combineReducers.js 提供合并多个reducer的函数，保证store的唯一性
- bindActionCreators.js 可以让开发者在不直接接触dispacth的前提下进行更改state的操作
- applyMiddleware.js 这个方法通过中间件来增强dispatch的功能

```javascript
const actionTypes = {
    ADD: 'ADD',
    CHANGEINFO: 'CHANGEINFO',
}

const initState = {
    info: '初始化',
}

export default function initReducer(state=initState, action) {
    switch(action.type) {
        case actionTypes.CHANGEINFO:
            return {
                ...state,
                info: action.preload.info || '',
            }
        default:
            return { ...state };
    }
}

export default function createStore(reducer, initialState, middleFunc) {

    if (initialState && typeof initialState === 'function') {
        middleFunc = initialState;
        initialState = undefined;
    }

    let currentState = initialState;

    const listeners = [];

    if (middleFunc && typeof middleFunc === 'function') {
        // 封装dispatch 
        return middleFunc(createStore)(reducer, initialState);
    }

    const getState = () => {
        return currentState;
    }

    const dispatch = (action) => {
        currentState = reducer(currentState, action);

        listeners.forEach(listener => {
            listener();
        })
    }

    const subscribe = (listener) => {
        listeners.push(listener);
    }

    return {
        getState,
        dispatch,
        subscribe
    }
}
```

**（2）工作流程**

- const store= createStore（fn）生成数据; 
- action: {type: Symble('action01), payload:'payload' }定义行为; 
- dispatch发起action：store.dispatch(doSomething('action001')); 
- reducer：处理action，返回新的state;



通俗点解释：

- 首先，用户（通过View）发出Action，发出方式就用到了dispatch方法
- 然后，Store自动调用Reducer，并且传入两个参数：当前State和收到的Action，Reducer会返回新的State
- State—旦有变化，Store就会调用监听函数，来更新View



以 store 为核心，可以把它看成数据存储中心，但是他要更改数据的时候不能直接修改，数据修改更新的角色由Reducers来担任，store只做存储，中间人，当Reducers的更新完成以后会通过store的订阅来通知react component，组件把新的状态重新获取渲染，组件中也能主动发送action，创建action后这个动作是不会执行的，所以要dispatch这个action，让store通过reducers去做更新React Component 就是react的每个组件。

### 3. Redux 中异步的请求怎么处理

可以在 componentDidmount 中直接进⾏请求⽆须借助redux。但是在⼀定规模的项⽬中,上述⽅法很难进⾏异步流的管理,通常情况下我们会借助redux的异步中间件进⾏异步处理。redux异步流中间件其实有很多，当下主流的异步中间件有两种redux-thunk、redux-saga。

**（1）使用react-thunk中间件**

**redux-thunk**优点**:** 

- 体积⼩: redux-thunk的实现⽅式很简单,只有不到20⾏代码 
- 使⽤简单: redux-thunk没有引⼊像redux-saga或者redux-observable额外的范式,上⼿简单 

**redux-thunk**缺陷**:** 

- 样板代码过多: 与redux本身⼀样,通常⼀个请求需要⼤量的代码,⽽且很多都是重复性质的 
- 耦合严重: 异步操作与redux的action偶合在⼀起,不⽅便管理 
- 功能孱弱: 有⼀些实际开发中常⽤的功能需要⾃⼰进⾏封装 



使用步骤：

- 配置中间件，在store的创建中配置

```javascript
import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducer';
import thunk from 'redux-thunk'

// 设置调试工具
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
// 设置中间件
const enhancer = composeEnhancers(
  applyMiddleware(thunk)
);

const store = createStore(reducer, enhancer);

export default store;
```

- 添加一个返回函数的actionCreator，将异步请求逻辑放在里面

```javascript
/**
  发送get请求，并生成相应action，更新store的函数
  @param url {string} 请求地址
  @param func {function} 真正需要生成的action对应的actionCreator
  @return {function} 
*/
// dispatch为自动接收的store.dispatch函数 
export const getHttpAction = (url, func) => (dispatch) => {
    axios.get(url).then(function(res){
        const action = func(res.data)
        dispatch(action)
    })
}
```

- 生成action，并发送action

```javascript
componentDidMount(){
    var action = getHttpAction('/getData', getInitTodoItemAction)
    // 发送函数类型的action时，该action的函数体会自动执行
    store.dispatch(action)
}
```

**（2）使用redux-saga中间件**

**redux-saga**优点**:** 

- 异步解耦: 异步操作被被转移到单独 saga.js 中，不再是掺杂在 action.js 或 component.js 中 
- action摆脱thunk function: dispatch 的参数依然是⼀个纯粹的 action (FSA)，⽽不是充满 “⿊魔法” thunk function 
- 异常处理: 受益于 generator function 的 saga 实现，代码异常/请求失败 都可以直接通过 try/catch 语法直接捕获处理
- 功能强⼤: redux-saga提供了⼤量的Saga 辅助函数和Effect 创建器供开发者使⽤,开发者⽆须封装或者简单封装即可使⽤ 
- 灵活: redux-saga可以将多个Saga可以串⾏/并⾏组合起来,形成⼀个⾮常实⽤的异步flow 
- 易测试，提供了各种case的测试⽅案，包括mock task，分⽀覆盖等等 



**redux-saga**缺陷**:** 

- 额外的学习成本: redux-saga不仅在使⽤难以理解的 generator function,⽽且有数⼗个API,学习成本远超redux-thunk,最重要的是你的额外学习成本是只服务于这个库的,与redux-observable不同,redux-observable虽然也有额外学习成本但是背后是rxjs和⼀整套思想 
- 体积庞⼤: 体积略⼤,代码近2000⾏，min版25KB左右 
- 功能过剩: 实际上并发控制等功能很难⽤到,但是我们依然需要引⼊这些代码 
- ts⽀持不友好: yield⽆法返回TS类型 



redux-saga可以捕获action，然后执行一个函数，那么可以把异步代码放在这个函数中，使用步骤如下：

- 配置中间件

```javascript
import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducer';
import createSagaMiddleware from 'redux-saga'
import TodoListSaga from './sagas'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const sagaMiddleware = createSagaMiddleware()

const enhancer = composeEnhancers(
  applyMiddleware(sagaMiddleware)
);

const store = createStore(reducer, enhancer);
sagaMiddleware.run(TodoListSaga)

export default store;
```

- 将异步请求放在sagas.js中

```javascript
import {takeEvery, put} from 'redux-saga/effects'
import {initTodoList} from './actionCreator'
import {GET_INIT_ITEM} from './actionTypes'
import axios from 'axios'

function* func(){
    try{
        // 可以获取异步返回数据
        const res = yield axios.get('/getData')
        const action = initTodoList(res.data)
        // 将action发送到reducer
        yield put(action)
    }catch(e){
        console.log('网络请求失败')
    }
}

function* mySaga(){
    // 自动捕获GET_INIT_ITEM类型的action，并执行func
    yield takeEvery(GET_INIT_ITEM, func)
}

export default mySaga
```

- 发送action

```javascript
componentDidMount(){
  const action = getInitTodoItemAction()
  store.dispatch(action)
}
```

### 4. Redux 怎么实现属性传递，介绍下原理

react-redux 数据传输∶ view-->action-->reducer-->store-->view。看下点击事件的数据是如何通过redux传到view上：

- view 上的AddClick 事件通过mapDispatchToProps 把数据传到action ---> click:()=>dispatch(ADD)
- action 的ADD 传到reducer上
- reducer传到store上 const store = createStore(reducer);
- store再通过 mapStateToProps 映射穿到view上text:State.text



代码示例∶

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
class App extends React.Component{
    render(){
        let { text, click, clickR } = this.props;
        return(
            <div>
                <div>数据:已有人{text}</div>
                <div onClick={click}>加人</div>
                <div onClick={clickR}>减人</div>
            </div>
        )
    }
}
const initialState = {
    text:5
}
const reducer = function(state,action){
    switch(action.type){
        case 'ADD':
            return {text:state.text+1}
        case 'REMOVE':
            return {text:state.text-1}
        default:
            return initialState;
    }
}

let ADD = {
    type:'ADD'
}
let Remove = {
    type:'REMOVE'
}

const store = createStore(reducer);

let mapStateToProps = function (state){
    return{
        text:state.text
    }
}

let mapDispatchToProps = function(dispatch){
    return{
        click:()=>dispatch(ADD),
        clickR:()=>dispatch(Remove)
    }
}

const App1 = connect(mapStateToProps,mapDispatchToProps)(App);

ReactDOM.render(
    <Provider store = {store}>
        <App1></App1>
    </Provider>,document.getElementById('root')
)
```

### 5. Redux 中间件是什么？接受几个参数？柯里化函数两端的参数具体是什么？

Redux 的中间件提供的是位于 action 被发起之后，到达 reducer 之前的扩展点，换而言之，原本 view -→> action -> reducer -> store 的数据流加上中间件后变成了 view -> action -> middleware -> reducer -> store ，在这一环节可以做一些"副作用"的操作，如异步请求、打印日志等。



applyMiddleware源码：

```javascript
export default function applyMiddleware(...middlewares) {
    return createStore => (...args) => {
        // 利用传入的createStore和reducer和创建一个store
        const store = createStore(...args)
        let dispatch = () => {
            throw new Error()
        }
        const middlewareAPI = {
            getState: store.getState,
            dispatch: (...args) => dispatch(...args)
        }
        // 让每个 middleware 带着 middlewareAPI 这个参数分别执行一遍
        const chain = middlewares.map(middleware => middleware(middlewareAPI))
        // 接着 compose 将 chain 中的所有匿名函数，组装成一个新的函数，即新的 dispatch
        dispatch = compose(...chain)(store.dispatch)
        return {
            ...store,
            dispatch
        }
    }
}
```

从applyMiddleware中可以看出∶

- redux中间件接受一个对象作为参数，对象的参数上有两个字段 dispatch 和 getState，分别代表着 Redux Store 上的两个同名函数。
- 柯里化函数两端一个是 middewares，一个是store.dispatch

### 6. Redux 请求中间件如何处理并发

**使用redux-Saga**

redux-saga是一个管理redux应用异步操作的中间件，用于代替 redux-thunk 的。它通过创建 Sagas 将所有异步操作逻辑存放在一个地方进行集中处理，以此将react中的同步操作与异步操作区分开来，以便于后期的管理与维护。 redux-saga如何处理并发：

- **takeEvery**

可以让多个 saga 任务并行被 fork 执行。

```javascript
import {
    fork,
    take
} from "redux-saga/effects"

const takeEvery = (pattern, saga, ...args) => fork(function*() {
    while (true) {
        const action = yield take(pattern)
        yield fork(saga, ...args.concat(action))
    }
})
```

- **takeLatest**

takeLatest 不允许多个 saga 任务并行地执行。一旦接收到新的发起的 action，它就会取消前面所有 fork 过的任务（如果这些任务还在执行的话）。

在处理 AJAX 请求的时候，如果只希望获取最后那个请求的响应， takeLatest 就会非常有用。

```javascript
import {
    cancel,
    fork,
    take
} from "redux-saga/effects"

const takeLatest = (pattern, saga, ...args) => fork(function*() {
    let lastTask
    while (true) {
        const action = yield take(pattern)
        if (lastTask) {
            yield cancel(lastTask) // 如果任务已经结束，则 cancel 为空操作
        }
        lastTask = yield fork(saga, ...args.concat(action))
    }
})
```

### 7. Redux 状态管理器和变量挂载到 window 中有什么区别

两者都是存储数据以供后期使用。但是Redux状态更改可回溯——Time travel，数据多了的时候可以很清晰的知道改动在哪里发生，完整的提供了一套状态管理模式。



随着 JavaScript 单页应用开发日趋复杂，JavaScript 需要管理比任何时候都要多的 state （状态）。 这些 state 可能包括服务器响应、缓存数据、本地生成尚未持久化到服务器的数据，也包括 UI状态，如激活的路由，被选中的标签，是否显示加载动效或者分页器等等。



管理不断变化的 state 非常困难。如果一个 model 的变化会引起另一个 model 变化，那么当 view 变化时，就可能引起对应 model 以及另一个model 的变化，依次地，可能会引起另一个 view 的变化。直至你搞不清楚到底发生了什么。state 在什么时候，由于什么原因，如何变化已然不受控制。 当系统变得错综复杂的时候，想重现问题或者添加新功能就会变得举步维艰。

如果这还不够糟糕，考虑一些来自前端开发领域的新需求，如更新调优、服务端渲染、路由跳转前请求数据等等。前端开发者正在经受前所未有的复杂性，难道就这么放弃了吗?当然不是。



这里的复杂性很大程度上来自于：我们总是将两个难以理清的概念混淆在一起：变化和异步。 可以称它们为曼妥思和可乐。如果把二者分开，能做的很好，但混到一起，就变得一团糟。一些库如 React 视图在视图层禁止异步和直接操作 DOM来解决这个问题。美中不足的是，React 依旧把处理 state 中数据的问题留给了你。Redux就是为了帮你解决这个问题。

### 8. mobox 和 redux 有什么区别？

**（1）共同点**

- 为了解决状态管理混乱，无法有效同步的问题统一维护管理应用状态;
- 某一状态只有一个可信数据来源（通常命名为store，指状态容器）;
- 操作更新状态方式统一，并且可控（通常以action方式提供更新状态的途径）;
- 支持将store与React组件连接，如react-redux，mobx- react;

**（2）区别**

Redux更多的是遵循Flux模式的一种实现，是一个 JavaScript库，它关注点主要是以下几方面∶ 

- Action∶ 一个JavaScript对象，描述动作相关信息，主要包含type属性和payload属性∶ 

​         o type∶ action 类型; 

​         o payload∶ 负载数据;

- Reducer∶ 定义应用状态如何响应不同动作（action），如何更新状态;
- Store∶ 管理action和reducer及其关系的对象，主要提供以下功能∶ 

​         o 维护应用状态并支持访问状态(getState());

​         o 支持监听action的分发，更新状态(dispatch(action)); 

​         o 支持订阅store的变更(subscribe(listener));

- 异步流∶ 由于Redux所有对store状态的变更，都应该通过action触发，异步任务（通常都是业务或获取数据任务）也不例外，而为了不将业务或数据相关的任务混入React组件中，就需要使用其他框架配合管理异步任务流程，如redux-thunk，redux-saga等; 



Mobx是一个透明函数响应式编程的状态管理库，它使得状态管理简单可伸缩∶

-  Action∶定义改变状态的动作函数，包括如何变更状态;
-  Store∶ 集中管理模块状态（State）和动作(action)
-  Derivation（衍生）∶ 从应用状态中派生而出，且没有任何其他影响的数据



**对比总结：**

- redux将数据保存在单一的store中，mobx将数据保存在分散的多个store中
- redux使用plain object保存数据，需要手动处理变化后的操作;mobx适用observable保存数据，数据变化后自动处理响应的操作
- redux使用不可变状态，这意味着状态是只读的，不能直接去修改它，而是应该返回一个新的状态，同时使用纯函数;mobx中的状态是可变的，可以直接对其进行修改
- mobx相对来说比较简单，在其中有很多的抽象，mobx更多的使用面向对象的编程思维;redux会比较复杂，因为其中的函数式编程思想掌握起来不是那么容易，同时需要借助一系列的中间件来处理异步和副作用
- mobx中有更多的抽象和封装，调试会比较困难，同时结果也难以预测;而redux提供能够进行时间回溯的开发工具，同时其纯函数以及更少的抽象，让调试变得更加的容易

### 9. Redux 和 Vuex 有什么区别，它们的共同思想

**（1）Redux 和 Vuex区别**

- Vuex改进了Redux中的Action和Reducer函数，以mutations变化函数取代Reducer，无需switch，只需在对应的mutation函数里改变state值即可
- Vuex由于Vue自动重新渲染的特性，无需订阅重新渲染函数，只要生成新的State即可
- Vuex数据流的顺序是∶View调用store.commit提交对应的请求到Store中对应的mutation函数->store改变（vue检测到数据变化自动渲染）



通俗点理解就是，vuex 弱化 dispatch，通过commit进行 store状态的一次更变；取消了action概念，不必传入特定的 action形式进行指定变更；弱化reducer，基于commit参数直接对数据进行转变，使得框架更加简易; 



**（2）共同思想**

- 单—的数据源 
- 变化可以预测



本质上∶ redux与vuex都是对mvvm思想的服务，将数据从视图中抽离的一种方案。

### 10. Redux 中间件是怎么拿到store 和 action? 然后怎么处理?

redux中间件本质就是一个函数柯里化。redux applyMiddleware Api 源码中每个middleware 接受2个参数， Store 的getState 函数和dispatch 函数，分别获得store和action，最终返回一个函数。该函数会被传入 next 的下一个 middleware 的 dispatch 方法，并返回一个接收 action 的新函数，这个函数可以直接调用 next（action），或者在其他需要的时刻调用，甚至根本不去调用它。调用链中最后一个 middleware 会接受真实的 store的 dispatch 方法作为 next 参数，并借此结束调用链。所以，middleware 的函数签名是（{ getState，dispatch })=> next => action。

### 11. Redux中的connect有什么作用

connect负责连接React和Redux

**（1）获取state**

connect 通过 context获取 Provider 中的 store，通过` store.getState()` 获取整个store tree 上所有state 

**（2）包装原组件**

将state和action通过props的方式传入到原组件内部 wrapWithConnect 返回—个 ReactComponent 对 象 Connect，Connect 重 新 render 外部传入的原组件 WrappedComponent ，并把 connect 中传入的 mapStateToProps，mapDispatchToProps与组件上原有的 props合并后，通过属性的方式传给WrappedComponent 

**（3）监听store tree变化**

connect缓存了store tree中state的状态，通过当前state状态 和变更前 state 状态进行比较，从而确定是否调用 `this.setState()`方法触发Connect及其子组件的重新渲染





# React Hooks 



React Hooks 主要解决了以下问题：

**（1）在组件之间复用状态逻辑很难**

React 没有提供将可复用性行为“附加”到组件的途径（例如，把组件连接到 store）解决此类问题可以使用 render props 和 高阶组件。但是这类方案需要重新组织组件结构，这可能会很麻烦，并且会使代码难以理解。由 providers，consumers，高阶组件，render props 等其他抽象层组成的组件会形成“嵌套地狱”。尽管可以在 DevTools 过滤掉它们，但这说明了一个更深层次的问题：React 需要为共享状态逻辑提供更好的原生途径。



可以使用 Hook 从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。Hook 使我们在无需修改组件结构的情况下复用状态逻辑。 这使得在组件间或社区内共享 Hook 变得更便捷。

**（2）复杂组件变得难以理解**

在组件中，每个生命周期常常包含一些不相关的逻辑。例如，组件常常在 componentDidMount 和 componentDidUpdate 中获取数据。但是，同一个 componentDidMount 中可能也包含很多其它的逻辑，如设置事件监听，而之后需在 componentWillUnmount 中清除。相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 bug，并且导致逻辑不一致。



在多数情况下，不可能将组件拆分为更小的粒度，因为状态逻辑无处不在。这也给测试带来了一定挑战。同时，这也是很多人将 React 与状态管理库结合使用的原因之一。但是，这往往会引入了很多抽象概念，需要你在不同的文件之间来回切换，使得复用变得更加困难。



为了解决这个问题，Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据），而并非强制按照生命周期划分。你还可以使用 reducer 来管理组件的内部状态，使其更加可预测。

**（3）难以理解的 class**

除了代码复用和代码管理会遇到困难外，class 是学习 React 的一大屏障。我们必须去理解 JavaScript 中 this 的工作方式，这与其他语言存在巨大差异。还不能忘记绑定事件处理器。没有稳定的语法提案，这些代码非常冗余。大家可以很好地理解 props，state 和自顶向下的数据流，但对 class 却一筹莫展。即便在有经验的 React 开发者之间，对于函数组件与 class 组件的差异也存在分歧，甚至还要区分两种组件的使用场景。



为了解决这些问题，Hook 使你在非 class 的情况下可以使用更多的 React 特性。 从概念上讲，React 组件一直更像是函数。而 Hook 则拥抱了函数，同时也没有牺牲 React 的精神原则。Hook 提供了问题的解决方案，无需学习复杂的函数式或响应式编程技术

## React Hook 的使用限制

React Hooks 的限制主要有两条：

- 不要在循环、条件或嵌套函数中调用 Hook；
- 在 React 的函数组件中调用 Hook。



那为什么会有这样的限制呢？Hooks 的设计初衷是为了改进 React 组件的开发模式。在旧有的开发模式下遇到了三个问题。

- 组件之间难以复用状态逻辑。过去常见的解决方案是高阶组件、render props 及状态管理框架。
- 复杂的组件变得难以理解。生命周期函数与业务逻辑耦合太深，导致关联部分难以拆分。
- 人和机器都很容易混淆类。常见的有 this 的问题，但在 React 团队中还有类难以优化的问题，希望在编译优化层面做出一些改进。



这三个问题在一定程度上阻碍了 React 的后续发展，所以为了解决这三个问题，Hooks **基于函数组件**开始设计。然而第三个问题决定了 Hooks 只支持函数组件。



那为什么不要在循环、条件或嵌套函数中调用 Hook 呢？因为 Hooks 的设计是基于数组实现。在调用时按顺序加入数组中，如果使用循环、条件或嵌套函数很有可能导致数组取值错位，执行错误的 Hook。当然，实质上 React 的源码里不是数组，是链表。



这些限制会在编码上造成一定程度的心智负担，新手可能会写错，为了避免这样的情况，可以引入 ESLint 的 Hooks 检查插件进行预防。

## useEffect 与 useLayoutEffect 的区别

**（1）共同点**

- **运用效果：**useEffect 与 useLayoutEffect 两者都是用于处理副作用，这些副作用包括改变 DOM、设置订阅、操作定时器等。在函数组件内部操作副作用是不被允许的，所以需要使用这两个函数去处理。
- **使用方式：**useEffect 与 useLayoutEffect 两者底层的函数签名是完全一致的，都是调用的 mountEffectImpl方法，在使用上也没什么差异，基本可以直接替换。



**（2）不同点**

- **使用场景****：**useEffect 在 React 的渲染过程中是被异步调用的，用于绝大多数场景；而 useLayoutEffect 会在所有的 DOM 变更之后同步调用，主要用于处理 DOM 操作、调整样式、避免页面闪烁等问题。也正因为是同步处理，所以需要避免在 useLayoutEffect 做计算量较大的耗时任务从而造成阻塞。
- **使用效果：**useEffect是按照顺序执行代码的，改变屏幕像素之后执行（先渲染，后改变DOM），当改变屏幕内容时可能会产生闪烁；useLayoutEffect是改变屏幕像素之前就执行了（会推迟页面显示的事件，先改变DOM后渲染），不会产生闪烁。**useLayoutEffect总是比useEffect先执行。**



在未来的趋势上，两个 API 是会长期共存的，暂时没有删减合并的计划，需要开发者根据场景去自行选择。React 团队的建议非常实用，如果实在分不清，先用 useEffect，一般问题不大；如果页面有异常，再直接替换为 useLayoutEffect 即可。

## React Hooks在平时开发中需要注意的问题和原因

（1）**不要在循环，条件或嵌套函数中调用Hook，必须始终在 React函数的顶层使用Hook**

这是因为React需要利用调用顺序来正确更新相应的状态，以及调用相应的钩子函数。一旦在循环或条件分支语句中调用Hook，就容易导致调用顺序的不一致性，从而产生难以预料到的后果。

**（2）****使用useState时候，使用push，pop，splice等直接更改数组****对象的坑**

使用push直接更改数组无法获取到新值，应该采用析构方式，但是在class里面不会有这个问题。代码示例：

```javascript
function Indicatorfilter() {
  let [num,setNums] = useState([0,1,2,3])
  const test = () => {
    // 这里坑是直接采用push去更新num
    // setNums(num)是无法更新num的
    // 必须使用num = [...num ,1]
    num.push(1)
    // num = [...num ,1]
    setNums(num)
  }
return (
    <div className='filter'>
      <div onClick={test}>测试</div>
        <div>
          {num.map((item,index) => (
              <div key={index}>{item}</div>
          ))}
      </div>
    </div>
  )
}

class Indicatorfilter extends React.Component<any,any>{
  constructor(props:any){
      super(props)
      this.state = {
          nums:[1,2,3]
      }
      this.test = this.test.bind(this)
  }

  test(){
      // class采用同样的方式是没有问题的
      this.state.nums.push(1)
      this.setState({
          nums: this.state.nums
      })
  }

  render(){
      let {nums} = this.state
      return(
          <div>
              <div onClick={this.test}>测试</div>
                  <div>
                      {nums.map((item:any,index:number) => (
                          <div key={index}>{item}</div>
                      ))}
                  </div>
          </div>

      )
  }
}
```

（3）**useState设置状态的时候，只有第一次生效，后期需要更新状态，必须通过useEffect**

TableDeail是一个公共组件，在调用它的父组件里面，我们通过set改变columns的值，以为传递给TableDeail 的 columns是最新的值，所以tabColumn每次也是最新的值，但是实际tabColumn是最开始的值，不会随着columns的更新而更新：

```javascript
const TableDeail = ({
    columns,
}:TableData) => {
    const [tabColumn, setTabColumn] = useState(columns) 
}

// 正确的做法是通过useEffect改变这个值
const TableDeail = ({
    columns,
}:TableData) => {
    const [tabColumn, setTabColumn] = useState(columns) 
    useEffect(() =>{setTabColumn(columns)},[columns])
}
```

**（4）善用useCallback**

父组件传递给子组件事件句柄时，如果我们没有任何参数变动可能会选用useMemo。但是每一次父组件渲染子组件即使没变化也会跟着渲染一次。 

**（5）不要滥用useContext**

可以使用基于 useContext 封装的状态管理工具。



# React-Router

## 实现原理

客户端路由实现的思想：

- 基于 hash 的路由：通过监听`hashchange`事件，感知 hash 的变化

- - 改变 hash 可以直接通过 location.hash=xxx

- 基于 H5 history 路由：

- - 改变 url 可以通过 history.pushState 和 resplaceState 等，会将URL压入堆栈，同时能够应用 `history.go()` 等 API
  - 监听 url 的变化可以通过自定义事件触发实现



**react-router 实现的思想：**

- 基于 `history` 库来实现上述不同的客户端路由实现思想，并且能够保存历史记录等，磨平浏览器差异，上层无感知
- 通过维护的列表，在每次 URL 发生变化的回收，通过配置的 路由路径，匹配到对应的 Component，并且 render
