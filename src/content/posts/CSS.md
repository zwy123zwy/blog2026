---
title: CSS
published: 2026-02-26
description: 'CSS 基础、选择器、盒模型、布局、BFC、Flex/Grid、定位与层叠、响应式、动画与面试考点'
image: ''
tags: [CSS, 前端基础, 布局, Flexbox, Grid, 响应式]
category: ''
draft: false
lang: 'zh-cn'
---

# CSS

CSS（Cascading Style Sheets）层叠样式表，用于描述 HTML 的**表现**：版式、颜色、动画等。以下按**学习与面试复习**组织，含选择器、盒模型、布局、定位浮动、场景应用与考点速查。

---

## 一、CSS 基础

### 1. CSS 选择器及其优先级

| 选择器 | 格式 | 优先级权重 |
|--------|------|------------|
| id 选择器 | `#id` | 100 |
| 类选择器 | `.classname` | 10 |
| 属性选择器 | `a[ref="eee"]` | 10 |
| 伪类选择器 | `li:last-child` | 10 |
| 标签选择器 | `div` | 1 |
| 伪元素选择器 | `li::after` | 1 |
| 相邻兄弟选择器 | `h1+p` | 0 |
| 子选择器 | `ul>li` | 0 |
| 后代选择器 | `li a` | 0 |
| 通配符选择器 | `*` | 0 |

**优先级要点**：标签/伪元素 1；类/伪类/属性 10；id 100；内联样式 1000。`!important` 最高；同优先级后写生效；继承的样式最低。通用选择器（*）、子选择器（>）、相邻同胞（+）权值为 0。样式来源顺序：内联 > 内部 > 外部 > 用户自定义 > 浏览器默认。

### 2. 可继承与不可继承属性

**无继承性**：`display`；文本类如 `vertical-align`、`text-decoration`、`text-shadow`、`white-space`；盒模型 `width/height/margin/border/padding`；背景；定位 `float/position/top/left…`；`content`、`outline`、`z-index` 等。

**有继承性**：字体系列 `font-family/font-weight/font-size/font-style`；文本 `text-indent/text-align/line-height/word-spacing/letter-spacing/text-transform/color`；`visibility`；`list-style`；`cursor`。

### 3. display 的属性值及其作用

| 属性值 | 作用 |
|--------|------|
| none | 不显示，从文档流移除 |
| block | 块级，默认占满父宽，可设宽高，换行 |
| inline | 行内，宽高由内容决定，不可设宽高，同行 |
| inline-block | 内容宽，可设宽高，同行 |
| list-item | 块级 + 列表标记 |
| table | 块级表格 |
| inherit | 继承父元素 display |

### 4. block、inline、inline-block 的区别

- **block**：独占一行，可设 width/height/margin/padding。
- **inline**：不独占一行，width/height 无效；可设水平 margin/padding，垂直方向 padding/margin 表现不一。
- **inline-block**：内容按块渲染，整体作为行内对象排列在同一行。

行内元素：宽高无效，水平 margin/padding 有效、垂直慎用，不自动换行。块级元素：可设宽高，margin/padding 有效，自动换行，默认从上到下排列。

### 5. 隐藏元素的方法

- **display: none**：不在渲染树中，不占位，不响应事件。
- **visibility: hidden**：占位，不响应事件。
- **opacity: 0**：占位，可响应事件。
- **position: absolute** 移出视区、**z-index: 负值** 被遮挡、**clip/clip-path** 裁剪、**transform: scale(0)**：占位，一般不响应事件（视实现而定）。

### 6. link 和 @import 的区别

- link 是 HTML 标签，可加载 CSS、RSS 等；@import 属 CSS，只能加载 CSS。
- link 在页面加载时一起加载；@import 在页面加载完成后才加载。
- link 无兼容问题；@import 为 CSS2.1，低版本不支持。
- link 可用 JS 操作 DOM 改样式；@import 不行。

### 7. transition 和 animation 的区别

- **transition**：过渡，需要**触发**（如 hover、focus）才执行，设开始与结束状态。
- **animation**：动画，可自动执行、循环，用 `@keyframes` 定义多关键帧。

### 8. display:none 与 visibility:hidden 的区别

- 渲染树：`display:none` 元素不占空间；`visibility:hidden` 仍占空间。
- 继承：`display:none` 非继承，子孙一并消失；`visibility:hidden` 可继承，子元素设 `visibility:visible` 可显示。
- 重排/重绘：改 display 易引发重排；改 visibility 一般只重绘。
- 读屏：display:none 不读；visibility:hidden 会读。

### 9. 伪元素和伪类的区别与作用

- **伪元素**：在内容前后插入**不在 DOM 中的**元素/样式，如 `::before`、`::after`、`::first-line`、`::first-letter`。
- **伪类**：为**已有元素**添加状态样式，如 `:hover`、`:first-child`。

```css
p::before { content: "第一章："; }
p::after { content: "Hot!"; }
a:hover { color: #F0F; }
p:first-child { color: red; }
```

### 10. requestAnimationFrame 理解

`window.requestAnimationFrame(callback)` 在**下次重绘前**执行回调，适合做动画。优点：页面不可见时暂停（省 CPU）；高刷下每帧执行一次（节流）；可将一帧内 DOM 操作集中，减少重绘。取消用 `cancelAnimationFrame(id)`。相比 `setTimeout` 做动画：定时不精确、易与刷新不同步导致丢帧。

### 11. 盒模型的理解

盒模型由 margin、border、padding、content 组成。

- **标准盒模型（content-box）**：width/height 只含 content。
- **IE 盒模型（border-box）**：width/height 含 content + padding + border。

通过 `box-sizing: content-box | border-box` 控制；常用全局 `* { box-sizing: border-box; }`。

![标准盒模型与 border-box](image\CSS55Generated_image.png)

### 12. 为什么用 translate 改位置而不是定位？

`translate` 属于 `transform`，只触发**合成**（composite），不触发布局（reflow）和重绘（repaint）；改 `left/top` 会触发布局。translate 更高效，动画更流畅；且元素仍占原位置，绝对定位则脱离文档流。

### 13. li 与 li 之间的空白间隔原因与解决

inline 元素之间的空白符（空格、换行、Tab）会被渲染成一个空格。`<li>` 换行会产生换行符，变成空格占宽。

**解决**：给 `li` 设 `float:left`；或把 `li` 写在同一行；或给 `ul` 设 `font-size:0` 再给 `li` 设回字号；或 `ul { letter-spacing:-8px; }`，`li { letter-spacing:normal; }`。

### 14. CSS3 新特性

新增选择器（如 `:not(.input)`）；圆角 `border-radius`；多列布局；阴影与反射；文字特效 `text-shadow`；渐变 `gradient`；变换 `transform`（旋转、缩放、定位、倾斜）；动画 `animation`；多背景等。

### 15. 替换元素的概念及计算规则

**替换元素**：通过修改某属性即可替换内容的元素（如 img、video、input）。特点：外观不受页面 CSS 完全控制、有固有尺寸、在 vertical-align 等属性上有单独规则、默认为内联水平。

尺寸分三层：**固有尺寸**（资源本身）、**HTML 尺寸**（width/height 等属性）、**CSS 尺寸**（width/height 等）。规则：无 CSS 和 HTML 尺寸时用固有尺寸；无 CSS 时用 HTML 尺寸；有 CSS 时由 CSS 决定；有固有比例且只设宽或高时按比例；否则默认 300×150。

### 16. 常见图片格式及使用场景

- **BMP**：无损、体积大。
- **GIF**：无损、索引色、支持动图与透明，8bit，适合小图、动图。
- **JPEG**：有损、直接色，适合照片，不适合 logo/线框。
- **PNG-8**：无损、索引色，可替代 GIF（除动图），支持透明度。
- **PNG-24**：无损、直接色，体积较大。
- **SVG**：矢量无损，适合 logo、图标。
- **WebP**：支持有损/无损、透明，体积小，兼容性需考虑。

### 17. CSS Sprites（精灵图）

把多张图合成一张大图，用 `background-image` + `background-repeat` + `background-position` 定位。优点：减少 HTTP 请求、总体积可更小。缺点：拼图与维护成本、高分辨率下易断裂。

### 18. 物理像素、逻辑像素、像素密度与 @2x/@3x

**逻辑像素**：CSS 中的 px（如 414×896）。**物理像素**：设备实际像素（如 1242×2688）。**像素密度**：物理像素/逻辑像素（如 3 倍屏）。为保清晰，1 个物理像素至少对应 1 个图片像素，故需提供 @2x、@3x 图；或用媒体查询按 `min-device-pixel-ratio` 选择不同图。

### 19. margin 和 padding 的使用场景

- 需要在 **border 外侧** 留白且不需要背景时用 **margin**。
- 需要在 **border 内侧** 留白且需要背景时用 **padding**。

### 20. line-height 的理解及赋值方式

- 表示一行的高度（含字间距），约等于两行基线距离。
- 无 height 时，元素高度可由 line-height 撑开。
- 单行垂直居中：`line-height` 等于容器 `height`。
- 赋值：**带单位**（如 px、em）；**纯数字**（比例会继承）；**百分比**（计算后继承）。

### 21. CSS 优化与性能

- **加载**：压缩 CSS、少用 @import、多用 link。
- **选择器**：关键选择器在右端、避免通配、减少层级、用 class 代替标签、避免重复指定可继承属性。
- **渲染**：慎用 float/定位、减少重排重绘、属性值为 0 不加单位、空规则删除、雪碧图权衡、少滥用 web 字体。
- **可维护**：抽离公共样式、样式与内容分离。

### 22. CSS 预处理器/后处理器

- **预处理器**（Less、Sass、Stylus）：提供变量、嵌套、mixin、函数等，编译成 CSS。
- **后处理器**（如 PostCSS）：处理已有 CSS，如加前缀、编译新语法。使用原因：结构清晰、易扩展、屏蔽浏览器差异、便于继承与复用。

### 23. ::before 和 :after 单双冒号

- 单冒号 `:` 用于**伪类**（如 `:hover`）；双冒号 `::` 用于**伪元素**（如 `::before`、`::after`）。
- `::before`/`::after` 在主体内容前/后，不在 DOM 中。CSS2.1 曾用单冒号表示伪元素，CSS3 规范改为双冒号。

### 24. display:inline-block 何时会有间隙

- 标签之间有**空格/换行**会产生间隙：去掉空格或设 `font-size:0`、`letter-spacing`、`word-spacing`。
- **margin** 正值会产生间隙：可用负 margin 调整。

### 25. 单行、多行文本溢出隐藏

```css
/* 单行 */
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;

/* 多行（-webkit-） */
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;
```

### 26. Sass、Less 是什么，为什么用

二者都是 **CSS 预处理器**，用一套语法编译成 CSS，支持变量、继承、运算、函数等。作用：结构清晰、易扩展、屏蔽浏览器差异、易继承、兼容现有 CSS。

### 27. 媒体查询的理解

`@media` 可指定媒体类型和条件（如宽度、高度、像素比），只有匹配时其中的样式生效，常用于响应式与多端适配。

```html
<link rel="stylesheet" media="(max-width: 800px)" href="example.css" />
```

```css
@media (max-width: 600px) {
  .facet_sidebar { display: none; }
}
```

### 28. CSS 工程化理解

解决：代码组织与模块拆分、编码质量、构建优化、可维护性。常见实践：**预处理器**（Less/Sass）、**PostCSS**（加前缀、新语法）、**Webpack 等** 通过 css-loader + style-loader 处理 CSS（先 css-loader 编译，再 style-loader 插入）。

### 29. 判断元素是否到达可视区域

```js
// 元素顶部进入视口：元素顶 < 视口底
img.offsetTop < window.innerHeight + (document.body.scrollTop || document.documentElement.scrollTop)
```

### 30. z-index 何时失效

z-index 只对 **position 不为 static** 的元素生效。失效情况：父为 `position:relative` 且子 z-index 在另一层叠上下文中；元素未设 position；同时设了 float（可改为 display:inline-block 等）。

---

## 二、页面布局

### 1. 常见布局单位

- **px**：固定像素；分 CSS 像素与物理像素。
- **%**：相对父元素，常用于响应式。
- **em**：相对当前元素字体大小。
- **rem**：相对根元素（html）字体大小。
- **vw/vh**：视口宽/高；vmin、vmax 取两者较小/较大值。

### 2. px、em、rem 的区别与使用场景

- **px**：固定，不随页面缩放。
- **em**：相对父元素字体，易产生连锁计算。
- **rem**：相对根字体，便于统一控制。

**场景**：只适配少量设备用 px；多端适配用 rem（或 vw）。

### 3. 两栏布局（左固定、右自适应）

**浮动 + margin**：

```css
.left { float: left; width: 200px; }
.right { margin-left: 200px; width: auto; }
```

**浮动 + BFC**：左 float，右 `overflow: hidden`。

**Flex**：

```css
.outer { display: flex; }
.left { width: 200px; }
.right { flex: 1; }
```

**绝对定位**：父 `position: relative`，左 `position: absolute; width: 200px`，右 `margin-left: 200px` 或 `left: 200px; right: 0`。

### 4. 三栏布局（左右固定、中间自适应）

- **绝对定位**：左右 absolute 固定宽，中间用左右 margin 留出空间。
- **Flex**：左右固定宽，中间 `flex: 1`。
- **浮动**：左 float:left、右 float:right，中间放最后并设左右 margin（或圣杯/双飞翼）。

圣杯/双飞翼：中间栏先写、宽度 100%，用负 margin 把三栏拉到一行，再用 padding 或内层 margin 给左右栏留位。

### 5. 水平垂直居中

**定位 + transform**（无需固定宽高）：

```css
.parent { position: relative; }
.child { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
```

**定位 + margin:auto**（有宽高）：

```css
.child { position: absolute; top: 0; right: 0; bottom: 0; left: 0; margin: auto; }
```

**定位 + 负 margin**：已知宽高时 `top:50%; left:50%; margin-top:-height/2; margin-left:-width/2`。

**Flex**：

```css
.parent { display: flex; justify-content: center; align-items: center; }
```

### 6. 移动端适配

- **像素密度**：用媒体查询或 srcset 提供 @2x/@3x 图。
- **屏幕尺寸**：用 rem、em、vw、vh 等按比例还原设计稿；常配合动态设置 html 的 font-size 或 viewport scale。

### 7. Flex 布局理解与使用场景

Flex 为弹性布局，容器 `display: flex`，子项成为 flex 项目。主轴方向 `flex-direction`，换行 `flex-wrap`，主轴对齐 `justify-content`，交叉轴对齐 `align-items`，多行对齐 `align-content`。项目上：`flex-grow/flex-shrink/flex-basis`、简写 `flex`、`align-self`、`order`。适用一维布局（行或列）。

### 8. flex:1 表示什么

`flex: 1` 等价于 `flex: 1 1 0%`：放大比例 1、缩小比例 1、基准 0，即**均分剩余空间**。

### 9. 响应式设计概念与原理

同一套页面兼容多终端。原理：媒体查询 `@media` 检测屏幕尺寸应用不同样式；需设置 viewport meta。

### 10. “品”字布局

上块 `margin: 0 auto` 居中；下两块用 `float: left` 或 `display: inline-block`，左边可用 `margin-left: 50%` 再 `margin-left: -200px` 之类拉回（具体数值按宽度算）。

### 11. 九宫格布局

**Flex**：容器 `display: flex; flex-wrap: wrap`，子项约 33.33% 宽、带 gap 或 margin，最后一列/行去掉多余间距。

**Grid**：

```css
ul { display: grid; grid-template-columns: 30% 30% 30%; grid-template-rows: 30% 30% 30%; gap: 5%; }
```

**float / inline-block**：子项 33.33% 宽并浮动或 inline-block，注意消除间隙（如 `font-size:0`、`letter-spacing`）。

---

## 三、定位与浮动

### 1. 为什么要清除浮动？清除浮动的方式

**原因**：子元素 float 后脱离文档流，父元素高度塌陷，影响布局。

**方式**：父元素设 **height**；在最后一个浮动元素后加**空 div** 并 `clear: both`；父元素 **overflow: hidden/auto**；父元素用 **::after 伪元素** + `clear: both`（可配合 `display: table; height: 0`），IE 可加 `zoom:1`。

```css
.clearfix::after { content: "\200B"; display: table; height: 0; clear: both; }
.clearfix { *zoom: 1; }
```

### 2. clear 属性清除浮动的原理

`clear` 表示**元素边不能与前面的浮动元素相邻**，并非“清除掉”浮动；使该元素换到浮动元素下方。伪元素需设 `display: block`（或 table）才能生效。

### 3. BFC 的理解与创建

**BFC**（块级格式化上下文）：独立渲染区域，内部布局与外部隔离。**创建条件**：根元素、float 非 none、position 为 absolute/fixed、display 为 inline-block/flex/table 等、overflow 非 visible。**作用**：防止 margin 重叠、包含浮动（清高度）、自适应两栏（一侧 float，另一侧 BFC 不重叠）。

### 4. margin 重叠问题与解决

**问题**：两块级元素垂直 margin 会合并（取大或正负相减）。**解决**：兄弟间可设 `display: inline-block`、float、position: absolute/fixed；父子间可父元素 `overflow: hidden`、加 border、子元素设为 inline-block 或浮动/定位。

### 5. 元素的层叠顺序（stacking order）

从下到上：背景和边框 → 负 z-index → 块级盒（文档流）→ 浮动盒 → 行内盒 → z-index:0 → 正 z-index。

![层叠顺序](image\css-Generated_image.png)

### 6. position 的属性与区别

| 值 | 说明 |
|----|------|
| static | 默认，文档流 |
| relative | 相对自身原位置，占位保留 |
| absolute | 相对最近非 static 祖先，脱离文档流 |
| fixed | 相对视口，脱离文档流 |
| sticky | 阈值内 relative，超出 fixed |
| inherit | 继承父元素 |

### 7. display、float、position 的关系

- 若 `display: none`，position/float 不影响表现。
- 若 `position: absolute/fixed`，float 失效，display 按规范转换（如 block）。
- 若 float 非 none，display 按规范转换（如 block）。
- 否则按设定 display 显示。

### 8. absolute 与 fixed 的异同

**同**：脱离文档流、可设 inline-block 表现、覆盖非定位元素。**异**：absolute 相对最近定位祖先（或视口），fixed 相对视口；有滚动时 absolute 随祖先移动，fixed 固定于视口。

### 9. sticky 定位理解

`position: sticky`：在到达指定阈值（top/right/bottom/left）前类似 relative，之后类似 fixed 固定在目标位置，常用于吸顶/吸底。

---

## 四、场景应用

### 1. 用 border 实现三角形

宽高为 0，用 border 的某一边有色、其余 transparent：

```css
div { width: 0; height: 0; border: 100px solid; border-color: orange blue red green; }
/* 向上三角 */
div { border-top: 50px solid red; border-left: 50px solid transparent; border-right: 50px solid transparent; }
```

### 2. 实现扇形

在三角形基础上加 `border-radius`，只保留一边有色：

```css
div { border: 100px solid transparent; width: 0; height: 0; border-radius: 100px; border-top-color: red; }
```

### 3. 圆与半圆

```css
/* 圆 */
div { width: 100px; height: 100px; border-radius: 50%; background: red; }
/* 半圆 */
div { width: 100px; height: 50px; border-radius: 0 0 100px 100px; background: red; }
```

### 4. 宽高自适应的正方形

- 用 **vw**：`width: 10%; height: 10vw;`
- 用 **padding-top 百分比**（相对父 width）：`width: 20%; height: 0; padding-top: 20%;`
- 用 **::after + margin-top: 100%** 撑开高度，父 overflow: hidden。

### 5. 梯形

用 border 组合：例如直角梯形 `border-bottom` 有色，`border-right` 透明；等腰梯形用多边 border 宽度与透明组合。

### 6. 0.5px 的线

- **transform: scale(0.5)** 缩放 1px 线。
- **viewport** 设 `initial-scale=0.5`（仅移动端，整页缩放）。

### 7. 小于 12px 的字体

Chrome 等最小 12px。可选：`-webkit-text-size-adjust: none`（高版本已不支持）；用 **transform: scale(0.75)** 缩小（需设为块级）；或小字号用图片。

### 8. 1px 问题（Retina 下边框过粗）

**原因**：devicePixelRatio=2 时，1 CSS 像素 = 2 物理像素，线变粗。

**思路一**：直接写 `0.5px`（兼容有限）。**思路二**：伪元素放大再缩小——::after 宽高 200%，border 1px，再 `transform: scale(0.5)`，transform-origin 左上。**思路三**：viewport 设 `initial-scale=1/devicePixelRatio`（整页缩放，影响全局）。

```css
#container::after {
  content: ""; position: absolute; top: 0; left: 0;
  width: 200%; height: 200%; border: 1px solid #333;
  transform: scale(0.5); transform-origin: left top;
  box-sizing: border-box;
}
```

---

## 五、面试考点速查

### 选择器与优先级

| 问题 | 简要回答 |
|------|----------|
| 选择器权值？ | 标签/伪元素 1，类/伪类/属性 10，id 100，内联 1000；!important 最高。 |
| 同权值谁生效？ | 后写覆盖先写；继承优先级最低。 |
| 通用/子/相邻选择器权值？ | 均为 0。 |

### 盒模型与布局单位

| 问题 | 简要回答 |
|------|----------|
| content-box 与 border-box？ | content-box：宽高仅内容；border-box：宽高含 padding、border。 |
| rem 与 em？ | rem 相对根字体；em 相对当前元素字体。 |
| vw/vh？ | 相对视口宽/高。 |

### 显示与隐藏

| 问题 | 简要回答 |
|------|----------|
| display:none 与 visibility:hidden？ | none 不占位、不响应事件；hidden 占位、不响应事件。 |
| 用 opacity:0 隐藏？ | 占位，可响应事件。 |

### 链接与动画

| 问题 | 简要回答 |
|------|----------|
| link 与 @import？ | link 并行加载、可配合 JS；@import 延后加载、仅 CSS。 |
| transition 与 animation？ | transition 需触发、两状态；animation 可自动、多关键帧。 |
| 为何用 transform/translate 做动画？ | 只触发合成，不触发布局重绘，性能好。 |

### BFC 与浮动

| 问题 | 简要回答 |
|------|----------|
| 什么是 BFC？ | 块级格式化上下文，独立渲染区域。 |
| 如何触发？ | 根、float、position absolute/fixed、display inline-block/flex、overflow 非 visible。 |
| 用途？ | 清浮动、防 margin 折叠、自适应两栏。 |
| 清除浮动方式？ | 父 height、空 div clear:both、父 overflow:hidden、::after clear:both。 |

### 定位与层叠

| 问题 | 简要回答 |
|------|----------|
| position 各值？ | static/relative/absolute/fixed/sticky。 |
| z-index 何时失效？ | 元素 position 为 static；或受父层叠上下文影响。 |
| 层叠顺序？ | 背景边框 → 负 z-index → 块级 → 浮动 → 行内 → z-index:0 → 正 z-index。 |

### Flex 与布局

| 问题 | 简要回答 |
|------|----------|
| flex:1 含义？ | flex-grow:1、flex-shrink:1、flex-basis:0，均分剩余空间。 |
| 水平垂直居中？ | Flex：justify-content:center; align-items:center；或 定位+transform translate(-50%,-50%)。 |
| 两栏/三栏布局？ | 浮动+margin、Flex、绝对定位、圣杯/双飞翼等。 |

### 响应式与工程化

| 问题 | 简要回答 |
|------|----------|
| 媒体查询？ | @media 按条件应用样式，用于响应式。 |
| 移动端适配？ | rem/vw + 动态根字体或 viewport；@2x/@3x 图。 |
| CSS 工程化？ | 预处理器（Less/Sass）、PostCSS、Webpack css-loader+style-loader。 |

### 文本与细节

| 问题 | 简要回答 |
|------|----------|
| 单行/多行省略？ | 单行：overflow:hidden; text-overflow:ellipsis; white-space:nowrap；多行：-webkit-line-clamp + -webkit-box。 |
| inline-block 间隙？ | 标签间空格/换行导致；font-size:0、去空格、letter-spacing 等。 |
| 1px 问题？ | 设备像素比导致；伪元素 scale(0.5)、0.5px、viewport 缩放等。 |

如需某一块的更多代码或扩展（如 Grid 详解、移动端方案对比），可在此结构上按章节补充。
