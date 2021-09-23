---
title: JavaScript笔记
date: 2021-09-20
categories:
  - 前端
tags:
  - js
---

## 数据类型

### null 值

特殊的 `null` 值不属于上述任何一种类型。

它构成了一个独立的类型，只包含 `null` 值：

```javascript
let age = null;
```

相比较于其他编程语言，JavaScript 中的 `null` 不是一个“对不存在的 `object` 的引用”或者 “null 指针”。JavaScript 中的 `null` 仅仅是一个代表“无”、“空”或“值未知”的特殊值。

## 类型转换

有三种常用的类型转换：转换为 string 类型、转换为 number 类型和转换为 boolean 类型。

**字符串转换** —— 转换发生在输出内容的时候，也可以通过 `String(value)` 进行显式转换。原始类型值的 string 类型转换通常是很明显的。

**数字型转换** —— 转换发生在进行算术操作时，也可以通过 `Number(value)` 进行显式转换。

数字型转换遵循以下规则：

| 值             | 变成……                                                                           |
| :------------- | :------------------------------------------------------------------------------- |
| `undefined`    | `NaN`                                                                            |
| `null`         | `0`                                                                              |
| `true / false` | `1 / 0`                                                                          |
| `string`       | “按原样读取”字符串，两端的空白会被忽略。空字符串变成 `0`。转换出错则输出 `NaN`。 |

**布尔型转换** —— 转换发生在进行逻辑操作时，也可以通过 `Boolean(value)` 进行显式转换。

布尔型转换遵循以下规则：

| 值                                    | 变成……  |
| :------------------------------------ | :------ |
| `0`, `null`, `undefined`, `NaN`, `""` | `false` |
| 其他值                                | `true`  |

上述的大多数规则都容易理解和记忆。人们通常会犯错误的值得注意的例子有以下几个：

- 对 `undefined` 进行数字型转换时，输出结果为 `NaN`，而非 `0`。
- 对 `"0"` 和只有空格的字符串（比如：`" "`）进行布尔型转换时，输出结果为 `true`。

## 基础运算

### 求幂

求幂运算 `a ** b` 是 `a` 乘以自身 `b` 次。

例如：

```javascript
alert(2 ** 2); // 4  (2 * 2，自乘 2 次)
alert(2 ** 3); // 8  (2 * 2 * 2，自乘 3 次)
alert(2 ** 4); // 16 (2 * 2 * 2 * 2，自乘 4 次)
```

在数学上，求幂的定义也适用于非整数。例如，平方根是以 `1/2` 为单位的求幂：

```javascript
alert(4 ** (1 / 2)); // 2（1/2 次方与平方根相同)
alert(8 ** (1 / 3)); // 2（1/3 次方与立方根相同)
```

### 用二元运算符 + 连接字符串

我们来看一些学校算术未涉及的 JavaScript 运算符的特性。

通常，加号 `+` 用于求和。

但是如果加号 `+` 被应用于字符串，它将合并（连接）各个字符串：

```javascript
let s = 'my' + 'string';
alert(s); // mystring
```

注意：只要任意一个运算元是字符串，那么另一个运算元也将被转化为字符串。

举个例子：

```javascript
alert('1' + 2); // "12"
alert(2 + '1'); // "21"
```

你看，第一个运算元和第二个运算元，哪个是字符串并不重要。

下面是一个更复杂的例子：

```javascript
alert(2 + 2 + '1'); // "41"，不是 "221"
```

在这里，运算符是按顺序工作。第一个 `+` 将两个数字相加，所以返回 `4`，然后下一个 `+` 将字符串 `1` 加入其中，所以就是 `4 + '1' = 41`。

二元 `+` 是唯一一个以这种方式支持字符串的运算符。其他算术运算符只对数字起作用，并且总是将其运算元转换为数字。

下面是减法和除法运算的示例：

```javascript
alert(6 - '2'); // 4，将 '2' 转换为数字
alert('6' / '2'); // 3，将两个运算元都转换为数字
```

### 数字转化，一元运算符 +

加号 `+` 有两种形式。一种是上面我们刚刚讨论的二元运算符，还有一种是一元运算符。

一元运算符加号，或者说，加号 `+` 应用于单个值，对数字没有任何作用。但是如果运算元不是数字，加号 `+` 则会将其转化为数字。

例如：

```javascript
// 对数字无效
let x = 1;
alert(+x); // 1

let y = -2;
alert(+y); // -2

// 转化非数字
alert(+true); // 1
alert(+''); // 0
let apples = '2';
let oranges = '3';

// 在二元运算符加号起作用之前，所有的值都被转化为了数字
alert(+apples + +oranges); // 5

// 更长的写法
// alert( Number(apples) + Number(oranges) ); // 5
```

## 值的比较

### 不同类型之间的比较

当对不同类型的值进行比较时，JavaScript 会首先将其转化为数字（number）再判定大小。

```javascript
alert('2' > 1); // true，字符串 '2' 会被转化为数字 2
alert('01' == 1); // true，字符串 '01' 会被转化为数字 1
```

对于布尔类型值，`true` 会被转化为 `1`、`false` 转化为 `0`。

```javascript
alert(true == 1); // true
alert(false == 0); // true
let a = 0;
alert(Boolean(a)); // false

let b = '0';
alert(Boolean(b)); // true

alert(a == b); // true!
```

### 严格相等

普通的相等性检查 `==` 存在一个问题，它不能区分出 `0` 和 `false`，也同样无法区分空字符串和 `false`。这是因为在比较不同类型的值时，处于相等判断符号 `==` 两侧的值会先被转化为数字。空字符串和 `false` 也是如此，转化后它们都为数字 0。如果我们需要区分 `0` 和 `false`，该怎么办？

**严格相等运算符 `===` 在进行比较时不会做任何的类型转换。**

换句话说，如果 `a` 和 `b` 属于不同的数据类型，那么 `a === b` 不会做任何的类型转换而立刻返回 `false`。

### 对 null 和 undefined 进行比较

当使用 `null` 或 `undefined` 与其他值进行比较时，其返回结果常常出乎你的意料。

- 当使用严格相等 `===` 比较二者时

  它们不相等，因为它们属于不同的类型。`alert( null === undefined ); // false`

- 当使用非严格相等 `==` 比较二者时

  JavaScript 存在一个特殊的规则，会判定它们相等。它们俩就像“一对恋人”，仅仅等于对方而不等于其他任何的值（只在非严格相等下成立）。`alert( null == undefined ); // true`

- 当使用数学式或其他比较方法 `< > <= >=` 时：

  `null/undefined` 会被转化为数字：`null` 被转化为 `0`，`undefined` 被转化为 `NaN`。

### 奇怪的结果：null vs 0

通过比较 `null` 和 0 可得：

```javascript
alert(null > 0); // (1) false
alert(null == 0); // (2) false
alert(null >= 0); // (3) true
```

### 特立独行的 undefined

`undefined` 不应该被与其他值进行比较：

```javascript
alert(undefined > 0); // false (1)
alert(undefined < 0); // false (2)
alert(undefined == 0); // false (3)
```

为何它看起来如此厌恶 0？返回值都是 false！

原因如下：

- `(1)` 和 `(2)` 都返回 `false` 是因为 `undefined` 在比较中被转换为了 `NaN`，而 `NaN` 是一个特殊的数值型值，它与任何值进行比较都会返回 `false`。
- `(3)` 返回 `false` 是因为这是一个相等性检查，而 `undefined` 只与 `null` 相等，不会与其他值相等。

## 面向对象

1、对象合并

```js
Object.assign(dest, [src1, src2, src3...])
```

- 第一个参数 dest 是指目标对象。
- 更后面的参数 src1, ..., srcN（可按需传递多个参数）是源对象。
- 该方法将所有源对象的属性拷贝到目标对象 dest 中。换句话说，从第二个开始的所有参数的属性都被拷贝到第一个参数的对象中。
- 调用结果返回 dest。
- 如果被拷贝的属性的属性名已经存在，那么它会被覆盖。

我们也可以用 Object.assign 代替 for..in 循环来进行简单克隆：

```js
let user = {
  name: 'John',
  age: 30,
};

let clone = Object.assign({}, user);
```

它将`user`中的所有属性拷贝到了一个空对象中，并返回这个新的对象。

2、深层克隆

```js
let user = {
  name: 'John',
  sizes: {
    height: 182,
    width: 50,
  },
};
```

现在这样拷贝`clone.sizes = user.sizes`已经不足够了，因为`user.sizes`是个对象，它会以引用形式被拷贝。因此`clone`和`user`会共用一个`sizes`。

为了解决此问题，我们应该使用会检查每个`user[key]`的值的克隆循环，如果值是一个对象，那么也要复制它的结构。这就叫“深拷贝”。

我们可以用递归来实现。或者不自己造轮子，使用现成的实现，例如 JavaScript 库 [lodash](https://lodash.com/) 中的 [\_.cloneDeep(obj)](https://lodash.com/docs/4.17.15#cloneDeep)。

3、箭头函数有些特别：它们没有自己的 this。如果我们在这样的函数中引用 this，this 值取决于外部“正常的”函数。

```js
let user = {
  firstName: 'Ilya',
  sayHi() {
    let arrow = () => alert(this.firstName);
    arrow();
  },
};

user.sayHi(); // Ilya
```

4、所有的对象在布尔上下文（context）中均为 true。所以对于对象，不存在 to-boolean 转换，只有字符串和数值转换。
