---
title: Python
published: 2026-02-26
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

### 3.1 函数创建与调用

- **def 关键字**：`def 函数名(参数):` 开头，冒号结尾，缩进函数体
- **文档字符串**：函数第一行可选的三引号字符串，用于存放函数说明（`func.__doc__`）
- **return**：返回值给调用者并结束函数；不写 return 默认返回 None
- **返回值类型**：可以是任意对象（int、str、list、dict）、表达式、函数本身（递归）、多个值（元组解包）、其他函数（实现装饰器）

```python
def get_average(a, b):
    '''计算平均值'''
    return (a + b) / 2

# 递归示例
def fact(n):
    if n == 1:
        return 1
    return n * fact(n - 1)

# 多返回值
def demo_func():
    return 1, 2.3  # 实际返回元组 (1, 2.3)
```

### 3.2 函数参数（11 个核心案例）

**参数分类**：
- **必选参数**：调用时必须指定，定义时没有默认值
- **可选参数（默认参数）**：调用时可指定也可不指定，不指定使用默认值
- **位置参数**：按定义顺序传参
- **关键字参数**：使用 key=value 形式传参，可不按顺序
- **可变位置参数 `*args`**：接收任意个位置参数，类型为元组
- **可变关键字参数 `**kwargs`**：接收任意个关键字参数，类型为字典

**参数顺序规则**：
1. 必选参数必须在可选参数前面（`def func(a, b=1):` 正确，`def func(a=1, b):` 报错）
2. 可变位置参数必须在可变关键字参数前面（`def func(*args, **kw):` 正确）
3. 可变关键字参数必须放在最后
4. 完整顺序：`def func(必选, 默认, *args, **kw):`
5. 使用单独的 `*` 强制后续参数必须用关键字方式传参（`def func(a, b, *, c):`）

```python
# 四种参数组合
def demo_func(arg1, arg2=10, *args, **kw):
    print("arg1:", arg1)
    print("arg2:", arg2)
    print("args:", args)
    print("kw:", kw)

demo_func(1, 12, 100, 200, d=1000, e=2000)
# arg1: 1   arg2: 12   args: (100, 200)   kw: {'d': 1000, 'e': 2000}
```

**传参的坑**：函数参数传递的是对象的内存地址。可变对象（list、dict）在函数内部修改后，外部值也会随之改变。

```python
def add_item(item, source_list):
    source_list.append(item)
alist = [0, 1]
add_item(2, alist)
print(alist)  # [0, 1, 2] —— 外部已被修改
```

### 3.3 匿名函数（lambda）

- **语法**：`lambda 参数: 表达式`，是一个表达式而非语句
- **特点**：无需定义函数名，可写在一行，但可读性相对较差
- **适用场景**：作为高阶函数的参数（map、filter、sorted 的 key 等）

```python
# 基础用法
(lambda x, y: x + y)(2, 4)  # 6

# 带 if/else
(lambda x, y: x if x < y else y)(1, 2)  # 1

# 递归
func = lambda n: 1 if n == 0 else n * func(n - 1)
func(5)  # 120
```

### 3.4 高阶函数（map / filter / reduce）

- **map(func, iterable)**：对序列中每个元素应用函数，返回迭代器（Python 3）
  ```python
  list(map(lambda x: x * 2, [1, 2, 3, 4, 5]))  # [2, 4, 6, 8, 10]
  ```
- **filter(func, iterable)**：过滤序列，保留 func 返回 True 的元素，返回迭代器
  ```python
  list(filter(lambda x: x < 0, range(-5, 5)))  # [-5, -4, -3, -2, -1]
  ```
- **reduce(func, iterable)**：累积运算（1+2 → 3+3 → 6+4 → 10+5），需从 `functools` 导入
  ```python
  from functools import reduce
  reduce(lambda x, y: x + y, [1, 2, 3, 4, 5])  # 15
  ```

### 3.5 偏函数（functools.partial）

固定函数的某些常用参数，生成新函数，减少重复传参。

```python
from functools import partial

def power(x, n):
    s = 1
    while n > 0:
        n -= 1
        s *= x
    return s

power_2 = partial(power, n=2)  # 固定 n=2
power_2(2)  # 4
power_2(3)  # 9
```

### 3.6 泛型函数（singledispatch）

根据第一个参数的类型，分发到不同的函数实现。

```python
from functools import singledispatch

@singledispatch
def age(obj):
    print('请传入合法类型的参数！')

@age.register(int)
def _(age):
    print(f'我已经{age}岁了。')

@age.register(str)
def _(age):
    print(f'I am {age} years old.')

age(23)           # 我已经23岁了。
age('twenty three')  # I am twenty three years old.
age(['23'])        # 请传入合法类型的参数！
```

### 3.7 装饰器

装饰器本质上是一个 Python 函数/类，它可以让其他函数/类在不需要做任何代码变动的前提下增加额外功能。常用于：日志记录、性能测试、事务处理、缓存、权限校验等。

**① 普通装饰器（函数）**：

```python
def logger(func):
    def wrapper(*args, **kw):
        print(f'开始执行：{func.__name__}')
        result = func(*args, **kw)
        print(f'执行完毕。')
        return result
    return wrapper

@logger
def add(x, y):
    return x + y
```

**② 带参数的函数装饰器**（三层嵌套）：

```python
def say_hello(country):
    def wrapper(func):
        def deco(*args, **kwargs):
            if country == "china":
                print("你好!")
            elif country == "america":
                print("hello.")
            func(*args, **kwargs)
        return deco
    return wrapper

@say_hello("china")
def xiaoming():
    pass
```

**③ 不带参数的类装饰器**：实现 `__init__`（接收被装饰函数）和 `__call__`（实现装饰逻辑）

```python
class logger:
    def __init__(self, func):
        self.func = func
    def __call__(self, *args, **kwargs):
        print(f"[INFO]: {self.func.__name__}() is running...")
        return self.func(*args, **kwargs)
```

**④ 带参数的类装饰器**：`__init__` 接收装饰器参数，`__call__` 接收被装饰函数

```python
class logger:
    def __init__(self, level='INFO'):
        self.level = level
    def __call__(self, func):
        def wrapper(*args, **kwargs):
            print(f"[{self.level}]: {func.__name__}() is running...")
            func(*args, **kwargs)
        return wrapper

@logger(level='WARNING')
def say(something):
    print(f"say {something}!")
```

**⑤ 偏函数 + 类实现装饰器**：任何 callable 对象都可以作为装饰器

```python
import time, functools

class DelayFunc:
    def __init__(self, duration, func):
        self.duration = duration
        self.func = func
    def __call__(self, *args, **kwargs):
        time.sleep(self.duration)
        return self.func(*args, **kwargs)

def delay(duration):
    return functools.partial(DelayFunc, duration)

@delay(duration=2)
def add(a, b):
    return a + b
```

**⑥ 装饰类的装饰器**（如单例模式）：

```python
instances = {}

def singleton(cls):
    def get_instance(*args, **kw):
        cls_name = cls.__name__
        if cls_name not in instances:
            instances[cls_name] = cls(*args, **kw)
        return instances[cls_name]
    return get_instance

@singleton
class User:
    def __init__(self, name):
        self.name = name
```

### 3.8 上下文管理器

使用 `with` 语句优雅地管理资源（文件、数据库连接等），自动处理资源的获取与释放。

**基本语法**：

```python
with open('test.txt') as file:
    print(file.readlines())
# 文件自动关闭，无需手动 file.close()
```

**自定义上下文管理器**（实现 `__enter__` 和 `__exit__`）：

```python
class Resource:
    def __enter__(self):
        print('===connect to resource===')
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        print('===close resource connection===')
        return True  # True = 异常已被处理，不再向外抛出

    def operate(self):
        1 / 0  # 即使抛出异常，__exit__ 也会被调用

with Resource() as res:
    res.operate()  # 不会报错，异常在 __exit__ 被吞掉
```

- `__exit__` 的三个参数：exc_type（异常类型）、exc_val（异常值）、exc_tb（异常栈信息），无异常时三者均为 None
- 返回 True 表示异常已被捕获，不再向外传播

**使用 contextlib 简化**：

```python
import contextlib

@contextlib.contextmanager
def open_func(file_name):
    # yield 之前 = __enter__
    print('open file:', file_name)
    file_handler = open(file_name, 'r')
    try:
        yield file_handler
    except Exception:
        print('the exception was thrown')
    finally:
        # yield 之后 = __exit__
        print('close file:', file_name)
        file_handler.close()

with open_func('test.txt') as file_in:
    for line in file_in:
        print(line)
```

### 3.9 反射与自省

在运行时获取对象的类型、属性、方法等信息。

- **help()**：进入交互式帮助模式，查看模块/关键字/函数的使用方法
- **dir()**：返回对象的所有属性名称排序列表
- **type()**：获取对象的类型（如 `<class 'int'>`）
- **hasattr(obj, name)**：判断对象是否有某个属性
  ```python
  import json
  hasattr(json, "dumps")  # True
  ```
- **getattr(obj, name)**：获取对象的属性值
  ```python
  dumps = getattr(json, "dumps")
  dumps({"name": "MING"})  # '{"name": "MING"}'
  ```
- **id(obj)**：返回对象的唯一标识符（内存地址）
- **isinstance(obj, type)**：判断对象是否为某个类型的实例
  ```python
  isinstance("python", str)  # True
  ```
- **callable(obj)**：判断对象是否可调用（函数、类是可调用的）
- **常用魔法属性**：
  - `__doc__`：对象的文档字符串
  - `__name__`：对象定义时的名称
  - `__file__`：模块的文件路径（内建模块没有此属性）
  - `__dict__`：对象可用的属性字典
  - `__module__`：类定义所在的模块名
  - `__bases__`：直接父类的元组

---

## 四、面向对象编程

### 4.1 类与对象

```python
class Animal:                   # Python 3 默认继承 object
    age = 0                     # 类属性（所有实例共享）

    def __init__(self, name):   # 构造函数
        self.name = name        # 实例属性

    def run(self):              # 实例方法
        print(f"{self.name} 跑起来了")

# 实例化与调用
dog = Animal(name="小黑")
print(dog.name)      # 访问实例属性
dog.run()            # 通过对象调用方法（无需传 self）
Animal.run(dog)      # 通过类调用方法（需传实例）
```

### 4.2 方法类型

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def run(self):                  # 实例方法：第一个参数固定为 self
        print(f"{self.name}跑起来啦")

    @staticmethod
    def eat():                      # 静态方法：无需 self/cls，无法访问实例
        print("正在吃饭...")

    @classmethod
    def jump(cls, name):            # 类方法：第一个参数固定为 cls（类本身）
        print(f"{name}跳起来啦")
```

- **实例方法**：`self` 代表实例对象，可访问实例属性和类属性
- **静态方法**：不需要 self 或 cls 参数，本质是函数（`type(dog.eat) == <class 'function'>`）
- **类方法**：`cls` 代表类本身，可访问类属性，通常用于工厂方法

### 4.3 私有变量与封装

- **单前导下划线 `_var`**：约定私有，但外部仍可访问（PEP 8 建议仅供内部使用）
- **双前导下划线 `__var`**：触发名称修饰（Name Mangling），变为 `_ClassName__var`，实现伪私有
- **封装**：通过公开接口（方法）操作私有属性，隐藏实现细节

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.__age = age          # 私有变量

    def is_adult(self):            # 封装：通过接口访问私有属性
        return self.__age >= 18

# p.__age              # AttributeError
# p._Person__age       # 仍可访问（但不推荐）
```

### 4.4 Property 属性

```python
class Student:
    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if 0 <= value <= 150:
            self._age = value
        else:
            raise ValueError("年龄必须在 [0, 150] 之间")

s = Student()
s.age = 25    # 触发 @age.setter，进行校验
print(s.age)  # 触发 @property
```

### 4.5 继承

**单继承**：
```python
class People:
    def speak(self):
        print("speaking...")

class Student(People):
    def __init__(self, name, grade):
        super().__init__()         # 调用父类方法（推荐方式）
        self.grade = grade

    def speak(self):               # 重写父类方法
        print(f"我是学生，在读{self.grade}")
```

**多继承与 MRO**：
```python
class A(B, E): pass                # 多继承
print(A.__mro__)                   # 查看方法解析顺序

# MRO 使用 C3 线性化算法，原则：从左向右，子类优先于父类
# 也可以使用 inspect.getmro(A) 查询
```

### 4.6 多态与鸭子类型

```python
class American:
    def speak(self): print("Hello")

class Chinese:
    def speak(self): print("你好")

def do_speak(person):              # 不关心参数类型，只关心是否有 speak 方法
    person.speak()

do_speak(American())  # Hello
do_speak(Chinese())   # 你好
```

> **鸭子类型**：一个对象只要"看起来像鸭子，走起路来像鸭子"，它就可以被看做是鸭子。不强制类型检查，只关心接口是否匹配。

### 4.7 Mixin 设计模式

Mixin 是一种多继承的设计模式，用于给类添加可选的功能增强。类名通常以 `Mixin` 结尾。

```python
class PlaneMixin:
    def fly(self):
        print('I am flying')

class Airplane(Vehicle, PlaneMixin):  # 飞机获取飞行能力
    pass
```

**规范**：
- 表示某种功能而非某个物品
- 功能单一，有多个功能就写多个 Mixin
- 独立于子类：子类没有这个 Mixin 也能正常工作

### 4.8 魔术方法（部分常用）

| 类别 | 方法 | 说明 |
|------|------|------|
| 构造 | `__init__` | 实例初始化 |
| 构造 | `__new__` | 创建实例（在 `__init__` 之前调用） |
| 构造 | `__del__` | 析构函数 |
| 字符串 | `__str__` | `str()` / `print()` 调用 |
| 字符串 | `__repr__` | `repr()` 调用，开发者友好 |
| 比较 | `__eq__`, `__ne__`, `__lt__`, `__le__`, `__gt__`, `__ge__` | 比较运算符 |
| 容器 | `__len__` | `len()` 调用 |
| 容器 | `__getitem__` | 索引访问 `obj[key]` |
| 容器 | `__setitem__` | 索引赋值 `obj[key] = value` |
| 容器 | `__contains__` | `in` 运算符 |
| 调用 | `__call__` | 让实例可调用 |
| 上下文 | `__enter__`, `__exit__` | `with` 上下文管理器 |

### 4.9 元类（Metaclass）

元类是创建类的类。Python 中类的类型是 `type`，`type` 本身就是一个元类。

```python
# 使用 type 动态创建类
MyClass = type('MyClass', (Base,), {'attr': 1, 'method': lambda self: 'hello'})

# 自定义元类
class SingletonMeta(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):  # 单例模式
    pass
```

### 4.10 描述符（Descriptor）

实现了 `__get__`、`__set__`、`__delete__` 中任意一个方法的类，其实例就是描述符。

- **数据描述符**：实现 `__get__` 和 `__set__`，优先级最高，Python 的 `property` 就是数据描述符
- **非数据描述符**：仅实现 `__get__`，如 `@staticmethod`、`@classmethod`

```python
class PositiveNumber:
    def __get__(self, obj, objtype=None):
        return obj._value
    def __set__(self, obj, value):
        if value < 0:
            raise ValueError("必须为正数")
        obj._value = value

class Order:
    price = PositiveNumber()  # 描述符自动做类型校验
```

---

## 五、异常处理

### 5.1 常见内置异常

| 异常 | 说明 |
|------|------|
| SyntaxError | 语法错误，代码不符合 Python 语法 |
| TypeError | 类型错误，操作应用于不合适类型 |
| IndexError | 索引超出序列范围 |
| KeyError | 字典中访问不存在的键 |
| ValueError | 值错误，类型正确但值不合法 |
| AttributeError | 对象没有该属性或方法 |
| NameError | 变量未定义 |
| IOError / OSError | 文件/IO 操作失败 |
| StopIteration | 迭代器没有更多值 |
| ZeroDivisionError | 除数为零 |
| AssertionError | assert 断言失败 |
| IndentationError | 缩进错误 |
| ImportError | 导入模块失败 |

### 5.2 抛出与捕获异常

**抛出异常**（raise）：
```python
raise Exception("发生错误")
# 程序自动抛出：1/0 → ZeroDivisionError
```

**捕获异常的四种语法**：

```python
# 1. 只捕获不获取异常信息
try:
    1 / 0
except ZeroDivisionError:
    print("除数不能为零")

# 2. 捕获并获取异常信息
try:
    1 / 0
except ZeroDivisionError as e:
    print(f"错误信息: {e}")

# 3. 带 else（无异常时执行）
try:
    result = 4 / 2
except ZeroDivisionError:
    print("除数不能为零")
else:
    print(f"结果: {result}")  # 无异常时执行

# 4. 带 finally（无论如何都执行）
try:
    f = open('file.txt')
    content = f.read()
except IOError:
    print("文件读取失败")
finally:
    f.close()  # 始终会执行
```

**捕获多个异常**：
```python
try:
    risky_operation()
except (ZeroDivisionError, FloatingPointError):
    print("计算出错")
except (IOError, OSError):
    print("IO 出错")
```

### 5.3 自定义异常

```python
class InputError(Exception):
    def __init__(self, msg):
        self.message = msg
    def __str__(self):
        return self.message

def get_input():
    name = input("请输入你的姓名：")
    if name == "":
        raise InputError("未输入内容")
```

### 5.4 异常链与上下文

```python
# 异常链接（关联原始异常）
try:
    1 / 0
except ZeroDivisionError as exc:
    raise RuntimeError("Something bad happened") from exc

# 关闭异常关联
try:
    1 / 0
except ZeroDivisionError:
    raise RuntimeError("Something bad happened") from None
```

### 5.5 异常处理好习惯

1. **只做精准的异常捕获**：只捕获可能抛出异常的语句块，捕获精确的异常类型而非模糊的 `Exception`
2. **保持异常类的抽象一致性**：底层模块不应抛出高层异常（如 API 错误码），需要在边界处进行异常包装转换
3. **用上下文管理器简化异常处理**：将重复的 `try...except` 逻辑封装为上下文管理器，让主逻辑更清晰

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

### 7.1 包、模块、库的关系

- **模块（Module）**：以 `.py` 为后缀的文件，是 Python 代码载体的最小单元
- **包（Package）**：包含 `__init__.py` 的文件夹（Python 3.3+ 已非必需，但建议保留），可包含子包和模块
- **库（Library）**：一定功能的代码集合，一个库可能由多个包和模块组成
- **层级**：库 → 包 → 模块
- **`__name__`**：直接执行时值为 `"__main__"`，被导入时值为模块名

### 7.2 模块导入方式

**基本导入**：
```python
import os
import os as operating_system
from os import getcwd
from os import getcwd as cwd
```

**相对导入与绝对导入**：
- **绝对导入**（推荐）：`import foo.bar` 或 `from foo import bar`，结构清晰，避免重名冲突
- **相对导入**：`from . import B`（当前模块），`from ..A import B`（上层模块），适合内部项目

**花式导包**：
- `__import__('os')`：底层导入函数，import 语句内部调用它
- `importlib.import_module("os")`：Python 3 推荐的动态导入方式
- `imp.find_module()` + `imp.load_module()`：已弃用（Python 3.4+）
- `from github_com.zzzeek import sqlalchemy`：第三方包，从 GitHub 直接下载导入

**导入规范（PEP 8）**：
```python
# 标准库
import os
import sys

# 第三方库
import flask

# 本地模块
from foo import bar
```

### 7.3 模块缓存与重载

导入模块时会先检查 `sys.modules`，已加载的模块不会重复导入。需要重载时：

```python
import importlib
import my_mod
importlib.reload(my_mod)  # 强制重新加载
```

### 7.4 `__all__` 控制导出

```python
# profile.py
name = '小明'
age = 18
__all__ = ['name']  # 仅 name 可被 from profile import * 导入
```

### 7.5 命名空间包（Namespace Package）

Python 3.3+ 特性：没有 `__init__.py` 的文件夹也能作为包导入，允许分散在不同物理位置的代码合并为同一个命名空间。

```python
# 不同目录下
# foo-package/spam/blah.py
# bar-package/spam/grok.py

import sys
sys.path.extend(['foo-package', 'bar-package'])
import spam.blah  # OK
import spam.grok  # OK
spam.__path__      # _NamespacePath(['foo-package/spam', 'bar-package/spam'])
```

### 7.6 pip 使用指南

| 命令 | 说明 |
|------|------|
| `pip list` | 列出已安装的包 |
| `pip list --outdated` | 列出可升级的包 |
| `pip show pkg` | 查看包详细信息 |
| `pip install pkg` | 安装包 |
| `pip install pkg==2.1.2` | 安装指定版本 |
| `pip install pkg>=2.1.2` | 安装版本约束 |
| `pip install --upgrade pkg` | 升级包 |
| `pip uninstall pkg` | 卸载包 |
| `pip install --no-index --find-links=/local/wheels pkg` | 离线安装 |
| `pip install --user pkg` | 用户私有安装 |
| `pip install --proxy http://ip:port pkg` | 代理安装 |
| `pip freeze > requirements.txt` | 导出依赖列表 |
| `pip install -r requirements.txt` | 从依赖列表安装 |
| `pip download -d /local/wheels -r requirements.txt` | 下载离线包 |

**国内镜像源配置**（`~/.pip/pip.conf`）：
```ini
[global]
index-url = https://mirrors.aliyun.com/pypi/simple/
[install]
trusted-host = mirrors.aliyun.com
```

### 7.7 模块导入原理

**导入协议的两大组件**：

1. **查找器（Finder）**：定义模块查找机制
   - `sys.meta_path` 中默认有三个查找器：BuiltinImporter、FrozenImporter、PathFinder
   - 可自定义查找器并注册到 `sys.meta_path`
2. **加载器（Loader）**：负责真正加载模块
   - 定义 `load_module()` 方法（旧）或 `create_module()` + `exec_module()`（新）
   - Python 3.4+ 使用 ModuleSpec 对象封装查找结果

### 7.8 包分发与发布

- **distutils**：最早的分发工具，setuptools 的前身
- **setuptools**：distutils 的增强版，现代 Python 包分发的标准
- **源码包 vs 二进制包**：源码包（`tar.gz`/`zip`）需编译安装；二进制包（`wheel`/`egg`）直接解压安装
- **Wheel vs Egg**：Wheel 是 PEP 427 定义的新标准，替代 Egg
- **setup.py**：包分发与安装的核心文件
  ```bash
  python setup.py sdist          # 构建源码发行包
  python setup.py bdist_wheel    # 构建 wheel 包
  python setup.py install        # 安装到系统
  python setup.py develop        # 开发模式安装（软链接）
  ```
- **发布到 PyPI**：
  ```bash
  python setup.py register       # 注册项目信息
  python setup.py upload          # 上传源码包
  # 或使用 twine
  pip install twine
  twine upload dist/*
  ```

### 7.9 常用标准库

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

## 十、代码规范、调试与性能优化

### 10.1 代码规范（PEP 8 要点）

- **缩进**：4 个空格缩进，不使用 Tab，更不能混用
- **行长度**：每行最大 79 字符，使用括号换行
- **空行**：类与顶层函数之间空两行；类方法之间空一行
- **命名规范**：
  - 模块/包：小写，可用下划线（`my_module`）
  - 类：CapWords 大驼峰（`MyClass`）
  - 函数/方法/变量：小写，下划线分隔（`my_func`）
  - 常量：全大写，下划线分隔（`MAX_SIZE`）
  - 私有属性/方法：单前导下划线 `_internal`；双前导下划线触发名称修饰 `__private`
- **import 规范**：分行书写，按「标准库 → 第三方 → 本地」排列
- **空格**：操作符左右各一个空格；函数/序列左括号前不加空格
- **注释**：英文完整句子，`#` 后加空格，错误的注释不如没有注释

### 10.2 Pythonic 代码技巧（15 个案例）

```python
# 1. 变量交换
a, b = b, a

# 2. 列表推导
squares = [x**2 for x in range(10)]

# 3. 带索引遍历
for i, item in enumerate(my_list):
    print(i, item)

# 4. 序列解包
a, *rest = [1, 2, 3]  # a=1, rest=[2,3]

# 5. 字符串拼接
word = ''.join(letters)  # 而非 for + +=

# 6. 真假判断
if not attr: pass  # 而非 if attr == None

# 7. 字典访问
value = d.get('key', 'default')  # 而非先判断 key 存在

# 8. 文件读取
with open('file.txt') as fp:  # 自动关闭
    for line in fp:
        print(line)

# 9. 三目运算
status = "adult" if age > 18 else "teenager"

# 10. 链式比较
if 80 < score < 90: print("良好")

# 11. 代码续行（括号方式）
s = ("This is a very long string "
     "that spans multiple lines")

# 12. 使用占位符
basename, _, ext = filename.rpartition('.')

# 13. EAFP vs LBYL
# EAFP（先执行再处理异常）—— Python 推荐
try:
    value = d['key']
except KeyError:
    value = None
# LBYL（先检查再执行）
if 'key' in d:
    value = d['key']

# 14. 显示优于隐式
def add(a: int, b: int) -> int:  # 清晰地表达意图
    return a + b

# 15. f-string 格式化
print(f"I earn {money:,} dollars.")
```

### 10.3 调试技巧

**pdb 命令行调试**：

```bash
python -m pdb script.py        # 从第一行开始调试
```

```python
import pdb; pdb.set_trace()     # 代码中设置断点
```

| 命令 | 说明 |
|------|------|
| `n` (next) | 执行下一行 |
| `s` (step) | 进入函数 |
| `r` (return) | 执行到函数返回 |
| `c` (continue) | 继续到下一个断点 |
| `l` (list) | 查看当前源码 |
| `p` (print) | 打印变量 |
| `b` (break) | 设置断点 |
| `q` (quit) | 退出调试 |

**其他调试方法**：
- `python -i script.py`：脚本报错后自动进入 Python Shell 模式进行调试
- `pdb.pm()`：在 Python Console 中报错后，调用 `pdb.pm()` 直接进入报错位置的调试模式
- **PySnooper**：`@pysnooper.snoop()` 装饰器自动记录函数运行过程中的每行代码和变量变化
- **PyCharm**：图形化调试，F8 单步、F7 进入函数、Shift+F8 跳出、F9 下一断点

### 10.4 性能优化

- **列表 vs 生成器**：大数据用生成器，内存占用小
- **字典查找 vs 列表查找**：O(1) vs O(n)
- **字符串拼接**：`''.join()` > f-string > `+`
- **缓存**：`functools.lru_cache` 缓存计算结果
- **性能分析**：`cProfile`（函数级）、`timeit`（微基准）、`memory_profiler`（内存）

### 10.5 写好函数的 6 个建议

1. **命名合理**：函数名清晰表达用途，避免缩写
2. **单一功能**：一个函数只做一件事，便于测试和复用
3. **文档字符串**：每个函数应有 docstring，先写文档再写代码
4. **返回有用值**：每个函数应返回有用的值（即使只是返回 True/False）
5. **控制长度**：函数不超过 50 行，过长则拆分为更小函数
6. **追求幂等**：纯函数/幂等函数（相同输入总是相同输出）最易测试和维护

---

## 十一、虚拟环境与包管理

### 11.1 为什么需要虚拟环境？

虚拟环境使不同项目拥有独立的 Python 依赖环境，互不干扰。避免包版本冲突，环境升级不影响其他项目或全局环境。

### 11.2 virtualenv + virtualenvwrapper（经典方案）

- **virtualenv**：创建独立 Python 环境的工具
  ```bash
  pip install virtualenv
  virtualenv my_env                # 创建虚拟环境
  source my_env/bin/activate       # 进入（Mac/Linux）
  deactivate                        # 退出
  ```
- **virtualenvwrapper**：virtualenv 的扩展，方便管理多个虚拟环境
  ```bash
  pip install virtualenvwrapper
  mkvirtualenv my_env      # 创建并进入
  workon my_env             # 切换环境
  lsvirtualenv              # 列出所有环境
  rmvirtualenv my_env       # 删除环境
  ```

### 11.3 pipenv（依赖+环境一体化）

`pipenv` 是 virtualenv 和 pip 的合体，使用 Pipfile 和 Pipfile.lock 管理依赖。

```bash
pip install pipenv
pipenv install                    # 创建虚拟环境
pipenv shell                      # 进入虚拟环境
pipenv install requests           # 安装包
pipenv uninstall requests         # 卸载包
pipenv graph                      # 查看依赖关系图
pipenv check                      # 检查安全漏洞
pipenv lock -r > requirements.txt # 导出 requirements.txt
```

### 11.4 Poetry（现代项目依赖管理）

```bash
pip install poetry
poetry new my-project              # 创建新项目
poetry init                        # 已有项目初始化
poetry add requests                # 安装包
poetry add pytest --dev            # 安装开发依赖
poetry remove requests             # 卸载包
poetry show --tree                 # 查看依赖树
poetry update                      # 更新所有依赖
poetry shell                       # 激活虚拟环境
poetry run python app.py           # 在虚拟环境中执行
```

### 11.5 venv（Python 3 内置方案）

```bash
python3 -m venv my_env         # 创建虚拟环境
source my_env/bin/activate     # 进入（Mac/Linux）
my_env\Scripts\activate.bat    # 进入（Windows cmd）
deactivate                      # 退出
```

### 11.6 pipx（命令行工具专用）

`pipx` 专门用于安装和管理 Python CLI 应用程序，每个应用安装到独立的隔离环境中。

```bash
pip install pipx
pipx install black              # 全局安装 black
pipx run pycowsay hello         # 运行一次性的工具
pipx list                       # 查看已安装的应用
pipx upgrade black              # 升级指定的应用
pipx uninstall black            # 卸载应用
```

### 11.7 PDM（PEP 582 下一代方案）

国人开发的包管理器，基于 PEP 582，无需虚拟环境，使用 `__pypackages__` 本地目录。

```bash
pip install pdm
pdm init                         # 初始化项目
pdm add requests                 # 安装包
pdm add -d pytest                # 安装开发依赖
pdm remove requests              # 删除包
pdm list --graph                 # 查看依赖树
pdm update                       # 更新所有包
pdm run python app.py            # 在当前环境执行
pdm export -o requirements.txt   # 导出依赖
```

### 11.8 pyenv（Python 版本管理器）

管理机器上多个 Python 版本，支持项目级别的版本切换。

```bash
brew install pyenv
pyenv install --list              # 查看可安装版本
pyenv install 3.9.16              # 安装指定版本
pyenv global 3.9.16               # 设置全局 Python 版本
pyenv local 3.8.16                # 设置当前目录的 Python 版本
pyenv versions                    # 查看已安装的版本
```

---

## 十二、开发工具链

### 12.1 静态类型检查（mypy）

Python 3.6+ 支持类型注解，mypy 利用类型注解进行静态类型检查。

```bash
pip install mypy
mypy app.py
```

```python
class Student:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

# mypy 会检测出 age 参数类型不匹配
stu = Student('小明', '16.5')  # error: expected "int"
```

### 12.2 单元测试框架（pytest）

- **测试发现**：递归查找 `test_*.py` 或 `*_test.py` 文件中的 `test_*` 函数和 `Test*` 类
- **断言**：使用普通 `assert` 语句，pytest 会给出详细的失败信息
- **Fixture**：`@pytest.fixture` 提供测试数据和 setup/teardown
  ```python
  import pytest
  
  @pytest.fixture
  def sample_data():
      return {"name": "test"}
  
  def test_example(sample_data):
      assert sample_data["name"] == "test"
  
  # 参数化测试
  @pytest.mark.parametrize("a,b,expected", [(1, 2, 3), (2, 3, 5)])
  def test_add(a, b, expected):
      assert a + b == expected
  
  # 异常断言
  def test_error():
      with pytest.raises(ZeroDivisionError):
          1 / 0
  ```
- **常用命令**：
  ```bash
  pytest -v                  # 详细输出
  pytest -x                  # 首次失败后停止
  pytest -k "pattern"        # 运行匹配名称的测试
  pytest --cov=myapp         # 生成覆盖率报告
  pytest -m "not slow"       # 按 marker 筛选
  ```

### 12.3 Git 提交前检查（pre-commit）

在 git commit 之前自动运行代码格式化和检查工具。

```bash
pip install pre-commit
# 创建 .pre-commit-config.yaml
```

```yaml
repos:
  - repo: https://github.com/psf/black
    rev: stable
    hooks:
      - id: black
        language_version: python3
  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0
    hooks:
      - id: flake8
```

```bash
pre-commit install  # 安装到 .git/hooks/
git commit -m "xxx"  # 提交时自动运行 black + flake8
```

### 12.4 项目模板生成（cookiecutter）

快速基于模板生成标准化的项目结构。

```bash
pip install cookiecutter
# 使用 GitHub 上的模板
cookiecutter gh:audreyr/cookiecutter-pypackage
# 使用本地模板
cookiecutter ~/.cookiecutters/my-template/
```

---

## 十三、常见面试问题

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
- Python 中的 `*args` 和 `**kwargs` 是什么？
- 解释 Python 的 LEGB 作用域规则？
- `__new__` 和 `__init__` 的区别？
- 描述符（Descriptor）是什么？property 是如何实现的？

---

以上框架覆盖 Python 从基础到进阶的核心知识点，适合系统复习与查漏补缺。
