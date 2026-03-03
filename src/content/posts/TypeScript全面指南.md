---
title: TypeScript 全面指南
published: 2026-02-26
description: 'TypeScript vs JavaScript vs Flow、基础语法与进阶、泛型与类型体操、注解与反射、实战与面试题'
image: ''
tags: [TypeScript, JavaScript, 泛型, 类型体操]
category: ''
draft: false
lang: 'zh-cn'
---

# TypeScript 全面指南

### Typescript vs JavaScript vs Flow

- **TypeScript**：微软推出的 JavaScript 超集，在 JS 基础上增加**静态类型系统**，编译为 JavaScript 后运行。提供类型检查、更好的 IDE 支持、接口与泛型等特性，适合中大型项目。
- **JavaScript**：ECMAScript 标准实现，动态类型，无需编译（或仅做转译）。灵活但大型项目中类型错误易在运行时暴露。
- **Flow**：Facebook 推出的 JavaScript 类型检查器，通过注释式类型（或 `.flow` 文件）为 JS 添加类型，不改变语法形态，可与现有 JS 项目渐进集成。

| 对比项 | TypeScript | JavaScript | Flow |
|--------|------------|------------|------|
| 类型方式 | 语言级语法（`: Type`） | 无 | 注释 / 独立类型文件 |
| 编译/检查 | 需 tsc 编译，类型即约束 | 无强制类型 | 需 flow 检查，不参与运行 |
| 生态与工具 | 官方维护，VS Code 深度集成 | 标准语言 | Facebook 维护，与 React 结合多 |
| 学习成本 | 中等，需学类型系统 | 低 | 中等，类型写法略不同 |

- **选型建议**：新项目或希望类型与代码一体、长期维护，优先 **TypeScript**；纯 JS 小项目可不引入类型；已有 React 且只想加类型检查可考虑 **Flow**，但 TS 生态更主流。

---

### Typescript 基础语法与进阶，常见面试题

#### 基础语法

- **类型注解**：变量、参数、返回值均可标注类型。
- **基础类型**：`string`、`number`、`boolean`、`null`、`undefined`、`symbol`、`bigint`。
- **对象与数组**：`{ key: string }`、`string[]` 或 `Array<string>`。
- **联合类型**：`string | number`。
- **类型别名**：`type Id = string | number`。
- **接口**：`interface User { name: string; age?: number }`。
- **枚举**：`enum Color { Red, Green }`（数字/字符串枚举）。

```typescript
// 基础示例
let name: string = 'ts';
function greet(msg: string): string {
  return `Hello, ${msg}`;
}
interface User {
  id: number;
  name: string;
}
const u: User = { id: 1, name: 'Tom' };
```

#### 进阶要点

- **类型断言**：`value as Type` 或 `<Type>value`，告诉编译器“我比编译器更清楚类型”。
- **字面量类型**：`type Dir = 'up' | 'down'`，配合联合类型做收窄。
- **never / unknown**：`never` 表示永不存在的类型；`unknown` 比 `any` 更安全，使用前需收窄。
- **类型守卫**：`typeof`、`instanceof`、`in`、自定义 `is Type` 函数，用于条件分支内收窄类型。
- **交叉类型**：`A & B`，合并多个类型；常用于 mixin、扩展对象形状。
- **索引签名**：`[key: string]: number`，描述“任意字符串键对应数字”的对象。

#### 常见面试题（基础与进阶）

1. **TypeScript 和 JavaScript 的本质区别？编译后类型去哪了？**
   - TS 是 JS 的超集，增加**静态类型系统**与**编译期类型检查**，编译后生成纯 JS，类型信息**仅存在于编译阶段**，运行时没有任何类型概念。
   - 因此：类型不能影响运行时逻辑（不能 `if (typeof x === 'string')` 在类型层面做分支）；反射、重载在运行时都退化为 JS 行为；若需要“类型与运行时一致”，需配合 zod、io-ts 等运行时校验。

2. **any、unknown、never 的区别？为什么推荐用 unknown 替代 any？**
   - **any**：关闭类型检查，可赋给任何类型、可从任何类型赋值，容易掩盖错误，仅在迁移旧代码或确实无法建模时使用。
   - **unknown**：顶层类型，“类型未知”，不能直接调用方法、访问属性，必须先**类型收窄**（typeof、instanceof、自定义 type guard）或**断言**后才能使用，保证“用前必验”。
   - **never**：底层类型，表示永不存在的值。常见于：函数抛错无返回、死循环、switch/if 穷举后的分支、泛型约束不可能满足时的推断。
   - 推荐 `unknown`：在接收外部输入（JSON、API、用户输入）时用 `unknown`，收窄后再用，避免把“未验证的数据”当成确定类型导致运行时错误。

3. **interface 和 type 的区别？什么场景必须用 type？**
   - **相同点**：都可描述对象形状，都可 extends（interface 用 extends，type 用交叉 `&`）。
   - **不同点**：
     - **声明合并**：同名 `interface` 会合并，`type` 不可重复定义；为库做扩展时常用 `interface` 让用户声明合并。
     - **表达能力**：`type` 可表达联合 `A | B`、元组 `[string, number]`、字面量联合 `'a' | 'b'`、映射类型、条件类型、从 typeof 推导等；`interface` 只能描述对象形状（及函数调用签名）。
   - **必须用 type 的场景**：联合类型、交叉多个接口以外的复杂类型、需要条件类型/ infer 时、需要从值推导类型时。

   **速查对比**：interface 可合并、仅对象/函数形状；type 不可合并、可表达联合/元组/字面量/条件类型/映射类型。扩展已有类型用 interface 声明合并；需要 `A | B`、`[string, number]`、`keyof T`、条件类型等时用 type。

4. **类型守卫有哪些？自定义类型守卫的签名为什么是 `x is Type`？**
   - 内置：`typeof`（仅限 number/string/boolean/symbol/undefined/function/object）、`instanceof`、`in`。
   - **自定义类型守卫**：函数返回 `arg is Type`，在条件为真时编译器将参数收窄为 `Type`。若写成 `boolean`，编译器不会收窄，仅保留布尔判断。
   ```typescript
   function isString(x: unknown): x is string {
     return typeof x === 'string';
   }
   function f(x: unknown) {
     if (isString(x)) {
       // x 被收窄为 string
       console.log(x.toUpperCase());
     }
   }
   ```

5. **什么是类型兼容性（结构化类型）？和名义类型有什么区别？**
   - **结构化类型（鸭子类型）**：TS 只看“形状”，只要目标类型要求的属性都存在且类型兼容即可赋值，不要求显式 extends。例如 `{ name: string; age: number }` 可以赋给 `{ name: string }`（多属性可赋给少属性）。
   - **名义类型**：如 Java/C#，必须显式继承或实现接口才兼容。TS 不采用名义类型，但可用**品牌类型（Brand）**模拟：`type Brand<T, B> = T & { __brand: B }`，避免两种“结构相同但语义不同”的类型互相赋值。

6. **可辨识联合（Discriminated Union）是什么？解决什么问题？**
   - 多个类型用**相同字面量字段**区分，形成联合类型，在分支里按该字段收窄，使每个分支类型确定。
   - 解决：普通联合 `A | B` 在分支内仍可能混用，难以精确推断；可辨识联合 + switch/if 可穷举且类型安全。
   ```typescript
   type Result = 
     | { kind: 'ok'; data: string }
     | { kind: 'err'; message: string };
   function handle(r: Result) {
     switch (r.kind) {
       case 'ok': return r.data;   // r 收窄为 { kind: 'ok'; data: string }
       case 'err': return r.message;
     }
   }
   ```

7. **类型断言 as 和 非空断言 ! 有什么风险？**
   - **as**：告诉编译器“相信我，这是某类型”，不做运行时检查。若断言错误，运行时可能报错或行为异常。更安全的方式是先用类型守卫收窄，再在收窄分支内使用。
   - **!**：对变量用 `x!` 表示“排除 null/undefined”，同样无运行时保证。滥用会导致在 null/undefined 上访问属性而崩溃。优先用可选链 `?.` 和明确判空。

8. **readonly 和 as const 的区别？**
   - **readonly**：修饰属性/索引，编译期禁止改写；仅对当前类型声明有效，若通过别名或类型断言仍可能被改写（TS 的 readonly 不是深度只读）。
   - **as const**：字面量推断为最窄类型且只读，如 `['a', 'b']` 变为 `readonly ['a', 'b']`，对象属性变为 readonly。适合“固定配置、枚举式对象”等场景。

---

### Typescript 泛型与类型体操

#### 泛型基础

- **泛型**：类型参数化，写一次逻辑，多种类型复用；避免 `any`，保持类型安全。

```typescript
function identity<T>(x: T): T {
  return x;
}
identity<number>(1);        // number
identity('hello');          // 推断为 string

interface Box<T> {
  value: T;
}
const box: Box<string> = { value: 'hi' };
```

- **泛型约束**：`extends` 限制类型参数必须满足某形状。

```typescript
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

- **泛型默认参数**：`<T = string>`，未传入时使用默认类型。

#### 类型体操常用工具

- **keyof**：对象类型的键的联合类型。
- **typeof**（类型层面）：取值的类型。
- **in**（映射类型）：遍历联合类型生成新类型。
- **条件类型**：`T extends U ? X : Y`。
- **infer**：在条件类型中推断类型变量。
- **内置工具类型**：`Partial<T>`、`Required<T>`、`Readonly<T>`、`Pick<T, K>`、`Omit<T, K>`、`Record<K, V>`、`Exclude<T, U>`、`Extract<T, U>`、`NonNullable<T>`、`ReturnType<T>`、`Parameters<T>` 等。

```typescript
// 条件类型 + infer 示例
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Params<T> = T extends (...args: infer P) => any ? P : never;

// 映射类型示例
type Partial<T> = { [K in keyof T]?: T[K] };
type Readonly<T> = { readonly [K in keyof T]: T[K] };
```

#### 常见面试题（泛型与类型体操）

1. **什么是泛型？为什么用泛型而不是 any 或重载？**
   - **泛型**：类型参数化，在定义函数/类/接口时保留“类型形参”，在调用时由实参类型或推断确定，实现**一次实现、多类型复用**且不丢失类型信息。
   - **vs any**：any 丢失类型，调用方拿不到具体类型，返回值也变成 any；泛型能保留入参与返回的关联（如 `identity<T>(x: T): T`）。
   - **vs 重载**：重载要写多份签名，类型多时代码膨胀；泛型一份实现即可覆盖无穷多种类型（在约束范围内）。

2. **泛型约束 T extends U 的含义？多个约束怎么写？**
   - `T extends U` 表示 T 必须是 U 的子类型（或等于 U），在函数体内可把 T 当 U 用（读属性、调方法）。
   - 多个约束：`T extends A & B`（同时满足 A 和 B），或 `T extends A ? T extends B ? ... : never : never`（条件类型里再约束）。常见写法是 `T extends object & { id: number }` 这种交叉。

3. **keyof 和 typeof（类型层面）分别做什么？组合使用举例。**
   - **keyof T**：得到 T 的**键的联合类型**。若 T 是 `{ a: number; b: string }`，则 `keyof T` 为 `'a' | 'b'`。
   - **typeof x**（类型位置）：取**值 x 的类型**。常用于从常量、配置对象推导类型，保证“类型与值一致”。
   - 组合：`keyof typeof obj` 先取 obj 的类型，再取键的联合；实现类型安全的 `get(obj, key)` 时用 `K extends keyof T` 保证 key 一定属于 T，返回 `T[K]`。

4. **条件类型 T extends U ? X : Y 的分配律（分布式）是什么？**
   - 当 T 是**联合类型**时，条件类型会**分布式**展开：`(A | B) extends U ? X : Y` 等价于 `(A extends U ? X : Y) | (B extends U ? X : Y)`。
   - 利用这一点可实现 `Exclude<T, U>`（从 T 中排除可赋值给 U 的成员）、`Extract<T, U>`（保留可赋值给 U 的成员）、以及“对联合每一项做变换”的体操。
   - 若不想分配，用元组包一层：`[T] extends [U] ? X : Y`，此时 T 作为整体参与判断。

5. **infer 在条件类型里怎么用？手写 ReturnType、Parameters、Promise 解包。**
   - **infer**：在条件类型的 extends 子句中声明**类型变量**，由编译器在匹配时推断。只能出现在 true 分支。
   - **ReturnType**：从函数类型推断返回值。  
     `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;`
   - **Parameters**：从函数类型推断参数元组。  
     `type Parameters<T> = T extends (...args: infer P) => any ? P : never;`
   - **Promise 解包**：若 T 是 Promise<X> 则得到 X，否则保持 T。  
     `type Awaited<T> = T extends Promise<infer R> ? Awaited<R> : T;`（递归解多层 Promise）

6. **手写 Partial、Required、Readonly、Pick、Omit、Record 的思路与实现。**
   - **Partial**：所有属性变可选。`type Partial<T> = { [K in keyof T]?: T[K] };`
   - **Required**：所有可选变必选。`type Required<T> = { [K in keyof T]-?: T[K] };`（`-?` 去掉可选）
   - **Readonly**：所有属性只读。`type Readonly<T> = { readonly [K in keyof T]: T[K] };`
   - **Pick**：只保留指定键。`type Pick<T, K extends keyof T> = { [P in K]: T[P] };`
   - **Omit**：排除指定键。`type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;`
   - **Record**：键类型 K 到值类型 V 的映射。`type Record<K extends keyof any, V> = { [P in K]: V };`

7. **什么是协变、逆变、双变？函数参数为什么是逆变的？**
   - **协变**：子类型可赋给父类型。如 `Dog` 是 `Animal` 的子类型，则 `Array<Dog>` 可赋给 `Array<Animal>`（只读场景安全）。
   - **逆变**：在**函数参数位置**，父类型可赋给子类型。若函数 `(a: Animal) => void` 可赋给 `(a: Dog) => void`，则传入 Dog 时一定能当 Animal 用；反过来若把 `(a: Dog) => void` 赋给 `(a: Animal) => void`，调用时可能传入 Cat，则不安全。故参数是**逆变**。
   - **双变**：TS 中为兼容 JS 历史，默认下函数参数是**双变**（既可协变也可逆变），可通过 `strictFunctionTypes` 改为严格逆变，更安全。

8. **类型体操在项目中的实际用途？**
   - **API 层**：用泛型约束请求/响应，`request<T>(url): Promise<T>`，配合接口定义；从路由或 handler 类型推导出 Response 类型（ReturnType、Parameters）。
   - **表单/配置**：根据配置对象推导出“可选键”“必填键”“默认值类型”；DeepPartial、DeepRequired 等深度变换。
   - **状态管理**：Redux 的 Action 联合 + 按 type 收窄；Reducer 的 state/action 类型与 dispatch 类型一致。
   - **组件库**：React 组件 props 的默认值、omit 掉 ref 等，用 Omit、Pick、Partial 组合；HOC 的泛型透传。

---

### Typescript 注解与反射

- **注解（Decorator）**：一种在类、方法、属性、参数上的**元数据**语法，用 `@DecoratorName` 的形式标注，用于依赖注入、路由、校验、日志等。  
- 在 TypeScript 中需在 `tsconfig.json` 中开启 `"experimentalDecorators": true`（以及可选 `"emitDecoratorMetadata": true`），且当前仍是实验特性；ECMAScript 的装饰器提案尚未完全定稿，TS 实现随标准演进。

```typescript
// 类装饰器
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(msg: string) {
    this.greeting = msg;
  }
}
```

- **反射（Reflection）**：在运行时查看或操作类型/元数据。在 TS/JS 中常通过：
  - **Reflect 元数据**：配合 `reflect-metadata` 库与 `emitDecoratorMetadata`，在运行时读取设计类型（如参数类型、返回值类型）。
  - **Reflect API**：`Reflect.get`、`Reflect.set`、`Reflect.defineMetadata` 等，用于读写元数据。
- 典型用法：依赖注入容器根据构造函数参数类型自动解析并注入实例；ORM 根据属性类型映射数据库列；校验器根据类型生成校验规则。

```typescript
import 'reflect-metadata';

function Injectable() {
  return function (target: any) {
    Reflect.defineMetadata('injectable', true, target);
  };
}

@Injectable()
class Service {}
```

- **面试常问**：装饰器做了什么（为类/方法/属性/参数附加逻辑或元数据）；装饰器执行顺序（由外到内、由下到上等）；反射在 TS 中的实现方式（reflect-metadata + 编译器生成的类型元数据）。

#### 常见面试题（注解与反射）

1. **装饰器的执行顺序（类、方法、属性、参数）？**
   - **实例成员**：属性 → 方法 → 方法参数（同一方法内参数按声明顺序）。
   - **静态成员**：静态属性 → 静态方法 → 静态方法参数。
   - **类装饰器**：最后执行（在实例与静态成员之后）。
   - 同一目标的多个装饰器：**从下到上、从右到左**执行（即靠近目标的先执行）；工厂返回的装饰器是“外层”，先执行再执行内层）。

2. **类装饰器、方法装饰器、属性装饰器的签名分别是什么？**
   - **类装饰器**：`(constructor: Function) => void` 或返回新构造函数的函数。
   - **方法装饰器**：`(target, propertyKey, descriptor: PropertyDescriptor) => void | PropertyDescriptor`。可修改 descriptor 实现 AOP（如 log、缓存）。
   - **属性装饰器**：`(target, propertyKey) => void`。无 descriptor，若需影响属性行为需配合 Reflect.defineProperty 或后续在类装饰器里处理。

3. **reflect-metadata 能拿到哪些元数据？TS 如何配合？**
   - 可存储自定义 key-value 元数据；在开启 `emitDecoratorMetadata` 时，TS 会为**类构造函数参数**、**属性**、**方法返回值**注入设计时类型（design:type、design:paramtypes、design:returntype），由 reflect-metadata 在运行时读取。
   - 用途：依赖注入根据 `design:paramtypes` 解析构造函数参数类型并注入实例；ORM 根据属性类型映射列类型。

4. **装饰器与 TS 类型系统的关系？类型会被擦除吗？**
   - 装饰器是**值空间**的语法，运行时有执行；类型是**类型空间**的，编译后擦除。装饰器拿不到“泛型参数”“类型别名”等纯类型信息，只能拿到运行时存在的东西（如 class、constructor）。emitDecoratorMetadata 注入的是“设计时类型”的运行时等价（如 String、Number、Array），复杂泛型会退化为 Object 等。

---

### Typescript 实战，围绕面试题

#### 工程与配置

- **tsconfig.json**：`strict`、`strictNullChecks`、`noImplicitAny`、`module`、`target`、`paths` 等；面试可能问 strict 包含哪些、为何开启 strict。
- **与构建工具**：Vite、Webpack 中集成 TS（`ts-loader`、`esbuild`）；类型检查与编译分离（`tsc --noEmit` + 构建用 esbuild/swc）。

#### 类型安全实践

- **第三方库无类型**：`@types/xxx` 或手写 `.d.ts`；`declare module 'xxx'`。
- **安全地使用 any**：先用 `unknown`，再类型收窄或断言；为遗留代码写 `.d.ts` 逐步收窄。
- **泛型约束 API**：请求/响应用泛型约束，避免前后端类型不一致。

#### 常见实战/面试题

1. **如何在 React 中为 props/state/ref/事件 写类型？泛型组件怎么写？**
   - **Props**：`interface Props { ... }`，函数组件用 `(props: Props)` 或 `React.FC<Props>`（FC 已内置 children 等，可按需不用）。
   - **State**：`useState<Type>(initial)` 明确类型；复杂 state 用 type 或 interface。
   - **Ref**：`useRef<HTMLInputElement>(null)`（DOM）；`useRef<ValueType | null>(null)`（可变值）。
   - **事件**：`React.ChangeEvent<HTMLInputElement>`、`React.MouseEvent<HTMLButtonElement>`、`React.FormEvent` 等。
   - **泛型组件**：`function List<T>({ data, render }: { data: T[]; render: (item: T) => ReactNode }) { ... }`，使用时 `List<User>({ data: users, render: u => u.name })` 可推断 item 为 User。

2. **如何保证请求返回的数据类型既编译期安全又运行时正确？**
   - **编译期**：为请求函数写泛型 `request<T>(url): Promise<T>`，接口定义响应形状，调用方得到 T。
   - **运行时**：TS 类型会擦除，后端可能返回不一致。做法：用 **zod**、**io-ts**、**yup** 等做 schema 校验，校验通过后再赋给类型 T；或生成类型与 validator 同源（如从 OpenAPI 生成），保证“类型 = 运行时约束”。

3. **tsconfig 里 strict 包含哪些？strictNullChecks 开了会带来什么影响？**
   - **strict 包含**：`strictNullChecks`、`strictFunctionTypes`、`strictBindCallApply`、`strictPropertyInitialization`、`noImplicitAny`、`noImplicitThis`、`useUnknownInCatchVariables`（及部分版本差异）。
   - **strictNullChecks**：`null`/`undefined` 变为独立类型，不能随意赋给 string/number 等；可选属性、未赋值变量类型会带 `| undefined`。需要显式判空、可选链 `?.`、空值合并 `??`，或断言。开启后能避免大量“空指针”类运行时错误，推荐新项目必开。

4. **类型声明文件 .d.ts 的作用？declare、declare global、declare module 分别用在什么场景？**
   - **.d.ts**：只含类型声明，不产出 JS，供 TS 做类型检查和智能提示。
   - **declare**：声明“存在某变量/类型”，不提供实现。如 `declare const __DEV__: boolean;`、`declare function fn(x: number): string;`。
   - **declare global**：在模块文件中扩展**全局**类型，如给 `Window` 加属性、给 `globalThis` 加变量。
   - **declare module**：为无类型的三方库或模块声明形状，如 `declare module 'xxx' { export const x: number; }`；或 `declare module '*.css'` 处理非 TS 模块。

5. **如何实现类型安全的 EventEmitter（按事件名推导 payload）？**
   - 用**字面量联合**定义事件名，用**映射类型**定义“事件名 → payload”：
   ```typescript
   type EventMap = { click: { x: number; y: number }; input: string };
   class TypedEmitter<E extends Record<string, any>> {
     on<K extends keyof E>(event: K, fn: (payload: E[K]) => void): void;
     emit<K extends keyof E>(event: K, payload: E[K]): void;
   }
   const e = new TypedEmitter<EventMap>();
   e.on('click', (p) => p.x);  // p 推断为 { x: number; y: number }
   e.emit('input', 'hi');      // 第二个参数必须是 string
   ```

6. **Redux 里如何让 dispatch 的 action 与 reducer 分支类型一致？**
   - 定义 **Action 联合类型**：`type Action = { type: 'ADD'; payload: number } | { type: 'RESET' }`。
   - Reducer 用 `(state, action: Action)`，switch(action.type) 各 case 内 action 被收窄，payload 类型正确。
   - 若用 Redux Toolkit，`createSlice` 的 reducers 会生成对应 action creator，类型由工具推断；手写时可用类型断言或封装 `dispatch` 为泛型，只接受 `Action` 联合中的某一项。

7. **类型检查与编译分离（tsc --noEmit + esbuild/swc）有什么好处？**
   - **tsc** 做类型检查慢但准确；**esbuild/swc** 做转译快但不做类型检查。分离后：构建用 esbuild/swc 提速，CI/本地用 `tsc --noEmit` 做类型检查，既快又安全。
   - 注意：需保证 tsconfig 中用于 noEmit 的配置与构建用的转译范围一致（如 include、paths），否则可能出现“构建能过、类型检查报错”或反之。

8. **如何为没有类型的第三方库写 .d.ts？模块扩展（Module Augmentation）怎么做？**
   - **为库写 .d.ts**：在项目内建 `types/xxx.d.ts`，写 `declare module 'xxx' { ... }`，在内部用 export 导出类型或值声明；或在 node_modules 下建 `@types/xxx`（不推荐直接改 node_modules，可用 patch 或发布到 DefinitelyTyped）。
   - **模块扩展**：对已有类型声明的库（如 Express），在项目里写 `declare module 'express' { interface Request { user?: User; } }`，即可在中间件里用 `req.user` 且类型正确，无需改库源码。

