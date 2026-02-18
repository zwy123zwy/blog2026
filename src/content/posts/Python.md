---
title: Python
published: 2026-02-15
description: 'Python 基础与进阶：语法、数据结构、面向对象、并发、常用库与最佳实践'
image: ''
tags: [Python, 编程语言, 后端]
category: ''
draft: false 
lang: 'zh-cn'
---

# Python 基础与进阶

## 一、Python 基础语法

### 1.1 数据类型

- **基本类型**：int、float、bool、str、None
- **集合类型**：list、tuple、dict、set
- **类型转换**：显式转换、隐式转换、类型检查（isinstance、type）
- **可变与不可变**：可变对象（list、dict、set）与不可变对象（int、str、tuple）的区别

### 1.2 变量与作用域

- **变量命名**：命名规范、命名空间
- **作用域**：LEGB（Local、Enclosing、Global、Built-in）
- **global / nonlocal**：修改全局变量与闭包变量
- **变量赋值**：浅拷贝 vs 深拷贝（copy、deepcopy）

### 1.3 控制流

- **条件语句**：if/elif/else、三元表达式、match-case（Python 3.10+）
- **循环**：for、while、break、continue、else 子句
- **列表推导式**：基本语法、嵌套、条件过滤
- **生成器表达式**：与列表推导式的区别、内存优势

---

## 二、数据结构与算法

### 2.1 列表（List）

- **操作**：增删改查、切片、排序、反转
- **性能**：时间复杂度（append O(1)、insert O(n)、查找 O(n)）
- **常用方法**：append、extend、insert、remove、pop、index、count、sort、reverse

### 2.2 字典（Dict）

- **操作**：增删改查、遍历（keys、values、items）
- **性能**：平均 O(1) 查找、哈希冲突处理
- **常用方法**：get、setdefault、update、pop、popitem、keys、values、items
- **字典推导式**：创建字典的简洁方式

### 2.3 集合（Set）

- **操作**：并集、交集、差集、对称差集
- **性能**：O(1) 查找、去重应用
- **常用方法**：add、remove、discard、union、intersection、difference

### 2.4 元组（Tuple）

- **特点**：不可变、可哈希、作为字典键
- **命名元组**：collections.namedtuple、提高可读性

---

## 三、函数

### 3.1 函数定义与调用

- **参数**：位置参数、关键字参数、默认参数、可变参数（*args、**kwargs）
- **返回值**：return、多返回值（元组解包）、None
- **文档字符串**：docstring、类型注解（type hints）

### 3.2 高级特性

- **装饰器**：函数装饰器、类装饰器、带参数的装饰器、functools.wraps
- **闭包**：内部函数访问外部变量、应用场景
- **lambda**：匿名函数、适用场景与限制
- **生成器**：yield、生成器函数、生成器表达式、迭代器协议

### 3.3 内置函数

- **常用内置函数**：map、filter、reduce、zip、enumerate、sorted、any、all、isinstance
- **作用**：函数式编程风格、简化代码

---

## 四、面向对象编程

### 4.1 类与对象

- **类定义**：class、__init__、self
- **实例属性与类属性**：区别、访问方式
- **方法类型**：实例方法、类方法（@classmethod）、静态方法（@staticmethod）
- **属性访问**：__getattr__、__setattr__、property 装饰器

### 4.2 继承与多态

- **继承**：单继承、多继承、MRO（方法解析顺序）
- **super()**：调用父类方法、MRO 的作用
- **多态**：鸭子类型、接口实现
- **抽象基类**：abc 模块、@abstractmethod

### 4.3 特殊方法（魔术方法）

- **常用特殊方法**：
  - `__str__`、`__repr__`：字符串表示
  - `__len__`、`__getitem__`、`__setitem__`：容器协议
  - `__call__`：可调用对象
  - `__enter__`、`__exit__`：上下文管理器
  - `__eq__`、`__hash__`：相等性与哈希

---

## 五、异常处理

### 5.1 异常基础

- **try/except/else/finally**：异常捕获、清理操作
- **常见异常类型**：ValueError、TypeError、KeyError、IndexError、AttributeError、IOError
- **自定义异常**：继承 Exception、异常链

### 5.2 最佳实践

- **异常处理原则**：只捕获能处理的异常、避免空的 except
- **异常信息**：raise、traceback、日志记录
- **上下文管理器**：with 语句、异常安全

---

## 六、文件操作与 I/O

### 6.1 文件读写

- **打开文件**：open()、文件模式（r、w、a、b、+）
- **读取**：read、readline、readlines、迭代文件对象
- **写入**：write、writelines
- **上下文管理器**：with open() 自动关闭

### 6.2 JSON / CSV / 其他格式

- **JSON**：json.loads、json.dumps、json.load、json.dump
- **CSV**：csv.reader、csv.writer、csv.DictReader、csv.DictWriter
- **其他**：pickle（序列化）、yaml、xml

---

## 七、模块与包

### 7.1 模块导入

- **import 方式**：import、from ... import、import as
- **模块搜索路径**：sys.path、PYTHONPATH
- **__init__.py**：包标识、包初始化
- **相对导入与绝对导入**：. 与 .. 的使用

### 7.2 常用标准库

- **os / os.path**：文件系统操作、路径处理
- **sys**：系统参数、退出、标准输入输出
- **datetime**：日期时间处理、时区
- **collections**：deque、defaultdict、Counter、OrderedDict
- **itertools**：迭代器工具、组合与排列
- **functools**：partial、lru_cache、wraps
- **re**：正则表达式、匹配与替换
- **urllib / requests**：HTTP 请求

---

## 八、并发与异步

### 8.1 多线程（threading）

- **Thread**：创建线程、启动、join
- **线程同步**：Lock、RLock、Semaphore、Event、Condition
- **GIL（全局解释器锁）**：限制、适用场景（I/O 密集型）
- **线程安全**：Queue、线程安全的数据结构

### 8.2 多进程（multiprocessing）

- **Process**：创建进程、启动、join
- **进程通信**：Queue、Pipe、共享内存（Value、Array）
- **进程池**：Pool、map、apply_async
- **适用场景**：CPU 密集型任务

### 8.3 异步编程（asyncio）

- **async/await**：协程定义与调用
- **事件循环**：asyncio.run、loop.run_until_complete
- **并发执行**：asyncio.gather、asyncio.create_task
- **异步 I/O**：aiohttp、异步文件操作
- **适用场景**：I/O 密集型、高并发网络服务

---

## 九、常用第三方库

### 9.1 Web 开发

- **Flask**：轻量级框架、路由、模板、扩展
- **FastAPI**：现代框架、自动文档、类型验证、异步支持
- **Django**：全栈框架、ORM、Admin、中间件

### 9.2 数据处理

- **NumPy**：数组操作、数学运算、广播
- **Pandas**：DataFrame、Series、数据清洗、分组聚合
- **Matplotlib / Seaborn**：数据可视化

### 9.3 其他常用库

- **requests**：HTTP 客户端
- **SQLAlchemy**：ORM、数据库操作
- **pytest**：单元测试框架
- **logging**：日志记录
- **python-dotenv**：环境变量管理

---

## 十、最佳实践与性能优化

### 10.1 代码规范

- **PEP 8**：代码风格指南
- **命名规范**：变量、函数、类、常量
- **注释与文档**：docstring、类型注解
- **代码组织**：模块划分、包结构

### 10.2 性能优化

- **列表 vs 生成器**：内存占用
- **字典查找 vs 列表查找**：时间复杂度
- **字符串拼接**：join vs +、f-string
- **缓存**：functools.lru_cache、手动缓存
- **性能分析**：cProfile、timeit、memory_profiler

### 10.3 调试与测试

- **调试工具**：pdb、IDE 调试器、print 调试
- **单元测试**：unittest、pytest、mock
- **测试覆盖率**：coverage.py

---

## 十一、常见面试问题

- Python 中可变对象与不可变对象的区别？为什么字符串不可变？
- 解释 Python 的 GIL，它对多线程有什么影响？
- 装饰器的作用是什么？如何实现一个带参数的装饰器？
- 生成器与列表的区别？什么时候用生成器？
- Python 的垃圾回收机制（引用计数、标记清除、分代回收）？
- 深拷贝与浅拷贝的区别？如何实现深拷贝？
- 解释 Python 的 MRO（方法解析顺序）？
- async/await 与多线程的区别？各自适用场景？
- 如何优化 Python 代码的性能？
- Python 中如何实现单例模式？

---

以上框架覆盖 Python 从基础到进阶的核心知识点，适合系统复习与查漏补缺。
