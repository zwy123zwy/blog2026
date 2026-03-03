---
title: HTML
published: 2026-03-01
description: 'HTML 文档结构、语义化、src/href、script 加载、meta、表单、存储、Canvas/SVG、面试考点'
image: ''
tags: [HTML, 前端基础, 语义化, 可访问性, SEO]
category: '前端'
draft: false
lang: 'zh-cn'
---

# HTML

HTML（HyperText Markup Language）是用于描述网页**结构**的标记语言，由标签、属性与内容组成，由浏览器解析并配合 CSS/JS 呈现页面。

---

## 一、文档结构与 DOCTYPE

### 1. 标准文档结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>页面标题</title>
</head>
<body>
  <!-- 页面可见内容 -->
</body>
</html>
```

- **html**：根元素，`lang` 有利于可访问性与 SEO。
- **head**：元信息与资源引用，不直接显示。
- **body**：页面可见内容所在区域。

### 2. DOCTYPE（文档类型）的作用

DOCTYPE 告诉**浏览器（解析器）**应按何种文档类型定义（如 HTML 或 XHTML）来解析文档，会影响对 CSS 甚至 JavaScript 的解析，**必须写在文档第一行**。

- **<!DOCTYPE html>**：按 HTML5 标准解析，使浏览器进入**标准模式**。
- 若不写或格式错误，浏览器可能进入**混杂模式**，表现不一致。

**两种渲染模式**（可通过 `document.compatMode` 获取）：

| 值 | 模式 | 说明 |
|----|------|------|
| **CSS1Compat** | 标准模式（Strict mode） | 按 W3C 标准解析渲染，浏览器以其支持的最高标准呈现页面。 |
| **BackCompat** | 混杂模式（Quirks mode） | 浏览器以向后兼容的方式解析，行为因浏览器而异。 |

**严格模式与混杂模式的区分与意义**：

- **严格模式**：按 W3C 标准解析；**混杂模式**：浏览器自有方式解析，常模拟老版本行为。
- 若文档包含**严格 DTD** 或**带 URI 的过渡 DTD**，一般以严格模式呈现；**无 URI 的过渡 DTD** 或 **DTD 缺失/错误** 会导致混杂模式。
- HTML5 没有 DTD，`<!DOCTYPE html>` 即表示“用标准方式解析”；严格模式统一规范，混杂模式保证旧站能跑。

### 3. head 标签的作用与必备内容

`<head>` 是**所有头部元素的容器**，可引用脚本、样式、提供元信息等；其中的内容多数不会直接显示给读者。

可用标签：`<base>`、`<link>`、`<meta>`、`<script>`、`<style>`、`<title>`。  
其中 **`<title>` 是 head 里唯一必需的元素**，定义文档标题。

---

## 二、src 与 href 的区别

| 对比项 | src | href |
|--------|-----|------|
| **含义** | source，指向要**嵌入**当前页面的资源 | Hypertext Reference，建立**链接**关系 |
| **行为** | 将指向的资源**下载并应用**到文档内（如脚本执行、图片显示） | 建立当前文档/元素与目标资源之间的关联，**不替换**当前内容 |
| **典型用法** | `<script src="...">`、`<img src="...">`、`<iframe src="...">` | `<a href="...">`、`<link href="...">` |

**（1）src**

- 解析到该元素时，会**暂停**其他资源下载和处理，直到该资源加载、编译、执行完毕（脚本、图片、iframe 等均会阻塞）。
- 因此**建议把 JS 脚本放在 body 底部**，减少对首屏的阻塞。

**（2）href**

- 例如 `<link href="common.css" rel="stylesheet"/>`：浏览器识别为 CSS，会**并行下载**且不阻塞文档解析。
- 因此**推荐用 `<link>` 加载 CSS**，而不是用 `@import`（后者会阻塞）。

---

## 三、script 的 defer 与 async

无 `defer`/`async` 时：浏览器读到 script 会**立即加载并执行**，阻塞后续文档解析。

| 属性 | 加载 | 执行 | 顺序 |
|------|------|------|------|
| **无** | 立即，阻塞解析 | 立即 | 按出现顺序 |
| **defer** | 异步加载，不阻塞解析 | 等**文档解析完成**后、DOMContentLoaded 前按**书写顺序**执行 | 多个 defer 按顺序执行 |
| **async** | 异步加载，不阻塞解析 | 加载完**立即执行**，可能乱序 | 多个 async 不保证顺序 |

- **defer**：适合依赖 DOM 或按顺序执行的脚本。
- **async**：适合独立脚本（如统计），不依赖其他脚本与 DOM 顺序。

---

## 四、常用 meta 标签

meta 用 **name + content**（或 **http-equiv + content**）描述网页属性，便于 SEO、移动端与刷新等。

| 用途 | 示例 |
|------|------|
| **编码** | `<meta charset="UTF-8">` |
| **关键词** | `<meta name="keywords" content="关键词" />` |
| **描述** | `<meta name="description" content="页面描述" />` |
| **刷新/重定向** | `<meta http-equiv="refresh" content="0;url=..." />` |
| **视口（移动端）** | `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />` |
| **搜索引擎索引** | `<meta name="robots" content="index,follow" />` |

**viewport 的 content 常用项**：width、height、initial-scale、maximum-scale、minimum-scale、user-scalable。  
**robots 的 content**：all、none、index、follow、noindex、nofollow 等组合。

---

## 五、语义化标签

### 1. 对 HTML 语义化的理解

语义化指**根据内容结构选用合适标签**——用正确的标签做正确的事。

**优点**：

- **对机器友好**：便于爬虫抓取、SEO；读屏软件可依据结构生成目录。
- **对开发者友好**：结构清晰、可读性强，便于协作与维护。

**常见语义化标签**：`<header>` 头部、`<nav>` 导航、`<main>` 主区域、`<article>` 文章/独立内容、`<section>` 区块、`<aside>` 侧边栏、`<footer>` 页脚。

```html
<header><nav>...</nav></header>
<main>
  <article><h1>标题</h1><section>...</section></article>
  <aside>...</aside>
</main>
<footer>...</footer>
```

### 2. title 与 h1、b 与 strong、i 与 em 的区别

- **title 与 h1**：title 是文档标题，无层级含义；h1 是页面主标题，层级明确，对 SEO 和结构影响大。
- **b 与 strong**：b 仅视觉加粗；strong 表示**强调**，有语义，搜索引擎更侧重 strong。
- **i 与 em**：i 仅视觉斜体；em 表示**强调**，有语义。

---

## 六、行内元素、块级元素与空元素

- **行内元素**：a、b、span、img、input、select、strong 等，在行内排列。
- **块级元素**：div、ul、ol、li、dl、dt、dd、h1～h6、p 等，独占一行（在默认样式下）。
- **空元素（void）**：无内容、在开始标签中关闭，无闭合标签。常见：`<br>`、`<hr>`、`<img>`、`<input>`、`<link>`、`<meta>`；还有 `<area>`、`<base>`、`<col>`、`<embed>`、`<source>`、`<track>` 等。

---

## 七、img 的 srcset 与 sizes

**srcset**：根据**屏幕密度**或**宽度**提供多张图，让浏览器选择合适的一张。

```html
<!-- 按密度：1x 用 128 图，2x 用 256 图 -->
<img src="image-128.png" srcset="image-256.png 2x" />
```

```html
<!-- 按宽度 w + sizes 控制在不同视口下使用的宽度 -->
<img src="image-128.png"
     srcset="image-128.png 128w, image-256.png 256w, image-512.png 512w"
     sizes="(max-width: 360px) 340px, 128px" />
```

- **srcset** 的 `w` 表示图片“宽度”（可理解为质量），浏览器会选**不小于当前需要尺寸**的最小图。
- **sizes** 语法：`[媒体查询] [长度], ...`，表示在不同条件下该图片的显示宽度。

---

## 八、表单、label 与 HTML5 表单增强

### 1. label 的作用与用法

**作用**：建立**标签文本与表单控件**的关联，点击 label 时焦点会跳到对应控件，提升可访问性与点击区域。

**用法一**：`for` 与控件 `id` 对应。

```html
<label for="mobile">号码：</label>
<input type="text" id="mobile" />
```

**用法二**：label 包裹控件。

```html
<label>日期：<input type="text" /></label>
```

### 2. HTML5 表单类型与属性（简述）

**input 类型**：email、url、number、search、range、color、time、date、datetime-local、week、month 等。  
**表单属性**：placeholder、autofocus、autocomplete、required、pattern、multiple、form（关联表单 id）。  
**表单事件**：oninput（内容变化）、oninvalid（验证不通过时）。

---

## 九、HTML5 更新总览

**新增**：语义化标签（nav、header、footer、aside、section、article）；媒体标签 audio、video、source；本地存储 localStorage、sessionStorage；canvas、SVG；地理定位；History API（go、forward、back、pushState）；拖放（draggable、Drag API）；进度与度量（progress、meter）等。

**移除**：纯表现元素（basefont、big、center、font、s、strike、tt、u）；对可用性不利的 frame、frameset、noframes。

---

## 十、Web 存储与离线存储

### 1. localStorage、sessionStorage、cookie

三者都是浏览器端存储，但**容量、生命周期、是否随请求发送、API** 不同，面试常考对比与选型。

#### （1）Cookie

- **含义**：由服务端通过 `Set-Cookie` 或前端 `document.cookie` 读写的小型文本，**每次请求会随 HTTP 头自动携带**（同源或符合 path/domain 时）。
- **属性**：`name=value`、`expires`/`max-age`（过期时间）、`path`、`domain`、`secure`（仅 HTTPS）、`httpOnly`（禁止 JS 读，防 XSS）、`sameSite`（防 CSRF）。
- **容量**：约 **4KB** 单条，同源下条数与总大小受浏览器限制（通常几十条级别）。
- **状态**：可设过期时间；关闭浏览器后是否保留由 `expires`/`max-age` 决定；**每次请求都会带上**，易增加流量且需注意安全。

#### （2）localStorage

- **含义**：HTML5 提供的**持久化键值存储**，仅同源可访问，**不会随请求发送**。
- **属性/API**：`localStorage.setItem(key, value)`、`getItem(key)`、`removeItem(key)`、`clear()`、`key(index)`；键值均为**字符串**，存对象需 `JSON.stringify/parse`。
- **容量**：一般 **5～10MB** 级别（因浏览器而异），同源共享。
- **状态**：**长期有效**，关闭浏览器、重启电脑仍保留，除非用户或脚本清除；同一标签页与同源其他标签页、窗口共享。

#### （3）sessionStorage

- **含义**：与 localStorage 同源、API 一致，但**生命周期仅当前会话**。
- **属性/API**：`sessionStorage.setItem/getItem/removeItem/clear/key`，用法同 localStorage。
- **容量**：与 localStorage 同量级（约 5～10MB），同源共享。
- **状态**：**仅当前标签页**有效；关闭标签页即清除；新开标签页即使同源也是新的 session，不共享；刷新页面保留。

#### 三者区别速查

| 对比项       | Cookie                    | localStorage           | sessionStorage           |
|-------------|---------------------------|------------------------|--------------------------|
| **容量**    | 约 4KB/条，数量有限       | 约 5～10MB             | 约 5～10MB               |
| **生命周期**| 可设过期，或会话级        | 长期，除非主动清除     | 仅当前标签页会话         |
| **是否随请求发送** | 是（同源/符合 path/domain） | 否                     | 否                       |
| **API**     | `document.cookie` 或 Set-Cookie | setItem/getItem/removeItem 等 | 同 localStorage          |
| **典型用途**| 登录态、会话 ID、少量服务端需读的数据 | 前端持久化配置、缓存   | 单页内临时状态、表单草稿 |
| **同源**    | 受 path、domain 约束      | 同源共享               | 同源但仅当前标签页       |

- **选型**：需要**随请求带给服务端**（如 token、session id）用 **Cookie**；仅前端、长期存用 **localStorage**；仅当前标签页、关页即丢用 **sessionStorage**。

### 2. HTML5 离线存储（Application Cache / manifest）

**用途**：用户**离线**时仍可访问已缓存资源；**在线**时再更新缓存。

**原理**：通过 **.appcache（manifest）** 文件列出要缓存的资源，浏览器按清单缓存；离线时从缓存读取。

**基本用法**：

（1）在页面根元素指定 manifest：

```html
<html lang="en" manifest="index.manifest">
```

（2）manifest 文件示例：

```
CACHE MANIFEST
#v0.11
CACHE:
js/app.js
css/style.css
NETWORK:
resourse/logo.png
FALLBACK:
/ /offline.html
```

- **CACHE**：需离线缓存的资源；含 manifest 的页面会自动缓存。
- **NETWORK**：仅在线访问，不缓存；若同一资源同时在 CACHE 与 NETWORK，以 CACHE 为准。
- **FALLBACK**：前一个资源失败时用后一个替代（如根路径失败则显示 offline.html）。

**更新缓存**：修改 manifest 文件、或通过 JS 操作 `window.applicationCache`、或清除浏览器缓存。  
**注意**：manifest 与所列资源需同源；若 manifest 或清单中某文件无法下载，整个更新会失败。

### 3. 浏览器对离线存储的管理与加载

- **在线**：发现 head 中有 manifest，会请求 manifest；首次访问则按清单下载并缓存；再次访问则用缓存加载页面，并对比新旧 manifest，有变更则重新下载并更新缓存。
- **离线**：直接使用已缓存资源。

---

## 十一、Web Worker

**作用**：在**后台线程**运行 JS，不阻塞主线程，适合复杂计算；通过 **postMessage** 与主线程通信。

**注意**：Worker 内无法操作 DOM；创建与通信需同源。

**基本步骤**：检测支持 → 编写 worker 脚本（含回传逻辑）→ 主线程 `new Worker(url)` 并监听 `onmessage`。

---

## 十二、iframe 的优缺点

**优点**：可加载较慢或第三方内容（如广告）；脚本可并行下载；可实现跨子域通信。

**缺点**：会阻塞主页面 onload；部分搜索引擎对 iframe 内容识别有限；多页面不易管理。

---

## 十三、Canvas 与 SVG 的区别

| 对比项 | Canvas | SVG |
|--------|--------|-----|
| **本质** | 位图，逐像素绘制，用 JS 操作 | 矢量图，XML 描述，DOM 可操作 |
| **分辨率** | 依赖分辨率，放大易糊 | 不依赖分辨率，缩放不失真 |
| **事件** | 不支持直接绑定 DOM 事件 | 可为元素绑定事件 |
| **适用** | 图像密集型、游戏、频繁重绘 | 图标、地图、需要缩放与交互的图形 |
| **文本** | 文本渲染能力较弱 | 文本与图形一致由 DOM 管理 |

---

## 十四、HTML5 Drag API

拖放相关事件（简要）：

- **dragstart**：被拖元素开始被拖时。
- **drag**：被拖元素拖拽过程中。
- **dragenter**：被拖元素进入目标元素时。
- **dragover**：被拖元素在目标元素内移动时。
- **dragleave**：被拖元素离开目标元素时。
- **drop**：目标元素接收放置时。
- **dragend**：拖拽结束时（主体是被拖元素）。

使用方式：给需拖动的元素设置 `draggable="true"`，在目标元素上监听上述事件并调用 `preventDefault()` 等以允许放置。

---

## 十五、浏览器乱码与渐进增强 / 优雅降级

### 1. 浏览器乱码的原因与解决

**原因**：页面声明的编码（如 gbk）与文件实际编码（如 utf-8）不一致；或后端输出编码与页面声明不一致；或浏览器未正确识别编码。

**解决**：统一使用 UTF-8；编辑器保存为 UTF-8；后端输出与 meta charset 一致；必要时在服务端设置 Content-Type；数据库与程序间转码一致。

### 2. 渐进增强与优雅降级

- **渐进增强（Progressive Enhancement）**：先保证**低版本/基础环境**下的可用性，再在高级浏览器上增加效果与功能；**从基础往上加**。
- **优雅降级（Graceful Degradation）**：先按**完整功能、现代浏览器**实现，再为旧浏览器做兼容；**从复杂往下降**。

二者都关注兼容与体验，区别在于**设计起点**：渐进增强从“最小可用”出发；优雅降级从“完整实现”出发再裁剪。

---

## 十六、HTML 解析与页面性能（面试常问）

### 1. HTML 解析过程（简述）

- **流程**：浏览器从网络或缓存拿到 HTML 字节流 → **解码**为字符 → **词法/语法**解析成 DOM 树（遇到 `<script>` 会阻塞解析并执行）；同时解析 CSS 生成 CSSOM；DOM + CSSOM 合成 **渲染树（Render Tree）** → **布局（Layout）** 计算几何信息 → **绘制（Paint）** → **合成（Composite）** 输出到屏幕。
- **关键点**：HTML 解析是**增量式**的，边下载边解析；`<script>` 默认阻塞 DOM 构建，故常把脚本放 body 底或使用 `defer`/`async`；CSS 不阻塞 DOM 解析，但会阻塞渲染（避免 FOUC）。

### 2. 常见性能指标

| 指标 | 含义 | 说明 |
|------|------|------|
| **FP（First Paint）** | 首次绘制 | 第一次有像素绘制，可能仅为背景等。 |
| **FCP（First Contentful Paint）** | 首次内容绘制 | 首次渲染出文本、图片等“内容”的时间。 |
| **LCP（Largest Contentful Paint）** | 最大内容绘制 | 视口内最大块内容绘制完成时间，Core Web Vitals 之一。 |
| **FID / INP（First Input Delay）** | 首次输入延迟 | 用户首次交互到浏览器响应的延迟，反映主线程是否阻塞。 |
| **CLS（Cumulative Layout Shift）** | 累积布局偏移 | 布局稳定性，意外位移越少越好，Core Web Vitals 之一。 |
| **TTI（Time to Interactive）** | 可交互时间 | 页面主要资源加载完成、可稳定响应用户操作的时间。 |
| **DOMContentLoaded** | DOM 解析完成 | HTML 解析完成、DOM 树就绪，脚本可能仍在执行。 |
| **load** | 页面加载完成 | 包括图片等资源加载完成。 |

- **获取方式**：`PerformanceObserver`（如 LCP、FID、CLS）、`performance.getEntriesByType('navigation')`、`performance.timing`（部分已废弃，可用 Navigation Timing API 替代）。

### 3. 实际生产中的常见问题

- **首屏慢**：HTML/JS/CSS 过大、未压缩或未做 CDN；关键 JS 阻塞解析；未做 SSR 或预渲染，首屏依赖大量客户端渲染。
- **解析/渲染阻塞**：大量同步 `<script>`、未使用 defer/async；首屏关键 CSS 未内联或未优先加载，导致 FOUC 或延迟 FCP。
- **布局抖动（CLS 差）**：图片/广告/字体未设尺寸，加载后撑开布局；动态插入内容未预留空间；字体未用 `font-display` 或 `size-adjust` 导致 FOIT/FOUT。
- **交互卡顿（FID/INP 差）**：主线程被长任务占用（大列表渲染、复杂计算）；未做虚拟列表或分片；第三方脚本过多或执行过久。
- **资源与缓存**：未合理设置缓存策略（HTML 协商缓存、静态资源长缓存）；重复请求、未合并/压缩；移动端未考虑弱网与省流。

**面试可答**：先说“从字节流到 DOM → CSSOM → 渲染树 → 布局 → 绘制 → 合成”，再提 script 阻塞、FP/FCP/LCP/FID/CLS 等指标，最后结合“首屏、阻塞、CLS、长任务、缓存”举 1～2 个生产问题与对策。
