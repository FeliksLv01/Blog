---
title: Swift笔记
date: 2021-10-31
publish: false
sidebar: 'auto'
categories:
  - 客户端
tags:
  - Swift
  - iOS
---

文档参考[Swift 中文文档](https://www.cnswift.org/)

记录一些自己可能记不住的语法 🤔

## 基础内容

输出

```swift
var a = 123
print("test: \(a)") // 123
print("test", terminator: " 123") //test 123
```

类型别名

```swift
typealias AudioSample = UInt16
```

进制表示

```swift
var type_10 = 17
var type_2 = 0b10001
var type_8 = 0o21
var type_16 = 0x11
```

### 元祖

```swift
let http404Error = (404, "Not Found")

let (status, message) = http404Error
// 不需要的数据可以使用_代替
let (justStatus, _) = http404Error

print("The code is \(status)")
print("The message is \(message)")
// 利用从零开始的索引数字访问元组中的单独元素
print("The code is \(http404Error.0)")
print("The message is \(http404Error.1)")
```

在定义元组的时候给其中的单个元素命名

```swift
let http200Status = (statusCode: 200, description: "OK")
print("The status code is \(http200Status.statusCode)")
// prints "The status code is 200"
print("The status message is \(http200Status.description)")
// prints "The status message is OK"
```

在 Swift, nil 不是指针，他是值缺失的一种特殊类型，任何类型的可选项都可以设置成 nil 而不仅仅是对象类型。

### 可选项绑定

可以使用*可选项绑定*来判断可选项是否包含值，如果包含就把值赋给一个临时的常量或者变量。可选绑定可以与 if 和 while 的语句使用来检查可选项内部的值。

```swift
var a:Int? = nil
a = 1
if let temp = a {
    print("a: \(temp)")
} else {
    print("nil")
}
```

可以在同一个 if 语句中包含多可选项绑定，用逗号分隔即可。如果任一可选绑定结果是 nil 或者布尔值为 false ，那么整个 if 判断会被看作 false 。

```swift
if let firstNumber = Int("4"), let secondNumber = Int("42"), firstNumber < secondNumber && secondNumber < 100 {
    print("\(firstNumber) < \(secondNumber) < 100")
}
```

### 隐式展开可选项

有时在一些程序结构中可选项一旦被设定值之后，就会一直拥有值，在这种情况下，就可以去掉检查的需求，也不必每次访问的时候都进行展开，因为它可以安全的确认每次访问的时候都有一个值。

这种类型的可选项被定义为*隐式展开可选项*。

```swift
let possibleString: String? = "An optional string."
let forcedString: String = possibleString! // requires an exclamation mark

let assumedString: String! = "An implicitly unwrapped optional string."
let implicitString: String = assumedString // no need for an exclamation mark
```

当使用隐式展开可选项，Swift 首先尝试将它作为普通可选值来使用，如果它不能作为可选项，Swift 就强制展开值。

```swift
let optionalString = assumedString // optionalString类型为 String?
```

### 区间运算符

闭区间 `a...b`定义了从 a 到 b 的一组范围，并且包含 a 和 b 。 a 的值不能大于 b 。

```swift
for index in 1...5 {
    print("\(index) times 5 is \(index * 5)")
}
```

_半开区间运算符_`a..<b`定义了从 a 到 b 但不包括 b 的区间

```swift
let names = ["Anna", "Alex", "Brian", "Jack"]
let count = names.count
for i in 0..<count {
    print("Person \(i + 1) is called \(names[i])")
}
// Person 1 is called Anna
// Person 2 is called Alex
// Person 3 is called Brian
// Person 4 is called Jack
```

单侧区间

闭区间有另外一种形式来让区间朝一个方向尽可能的远——比如说，一个包含数组所有元素的区间，从索引 2 到数组的结束。在这种情况下，你可以省略区间运算符一侧的值。因为运算符只有一侧有值，所以这种区间叫做*单侧区间*。

```swift
for name in names[2...] {
    print(name)
}
// Brian
// Jack

for name in names[...2] {
    print(name)
}
// Anna
// Alex
// Brian

// 半开单侧区间
for name in names[..<2] {
    print(name)
}
```

### 字符串

**扩展字符串分隔符**

可以在字符串字面量中放置*扩展分隔符*来在字符串中包含特殊字符而不让它们真的生效。通过把字符串放在双引号（ " ）内并由井号（ # ）包裹。

```swift
let str = #"{"msg":"error"}"#
let otherStr = ###"Line1\###nLine2"###
print(str) // {"msg":"error"}
print(otherStr) // Line1\###nLine2
```

**初始化字符串**

```swift
var str = String(describing: (1, 1.0, true))
str = String(describing: [1, 2, 3])
str = String(format: "我是%@", "Felikslv")
str = String(describing: Int.self) // Int

let catCharacters: [Character] = ["C", "a", "t", "!", "🐱️"]
let catString = String(catCharacters)
```

**字符串可变性**

通过把一个 `String`设置为变量（这里指可被修改），或者为常量（不能被修改）来指定它是否可以被修改（或者*改变*）

```swift
var variableString  = "Horse"
variableString += "add carriage"

let constantString = "Highlander"
```

**字符串是值类型**

Swift 的 String 类型是一种值类型。如果你创建了一个新的 String 值， String 值在传递给方法或者函数的时候会被复制过去，还有赋值给常量或者变量的时候也是一样。每一次赋值和传递，现存的 String 值都会被复制一次，传递走的是拷贝而不是原本。

**字符串索引**

```swift
var greeting = "Hello, playground"

greeting[greeting.startIndex] // H

greeting[greeting.index(after: greeting.startIndex)] // e

greeting[greeting.index(before: greeting.endIndex)] // d

// 获取索引
let index = greeting.index(greeting.startIndex, offsetBy: 7)
greeting[index] // p
```

使用 indices 属性来访问字符串中每个字符的索引。

```swift
for index in greeting.indices {
    print("\(greeting[index]) ", terminator: "")
}
```

**插入和删除**

```swift
var welcome = "hello"
welcome.insert("!", at: welcome.endIndex)
// welcome now equals "hello!"

welcome.insert(contentsOf: " there", at: welcome.index(before: welcome.endIndex))
welcome.remove(at: welcome.index(before: welcome.endIndex))
// 删除范围

let range = welcome.index(welcome.endIndex, offsetBy: -6)..<welcome.endIndex

welcome.removeSubrange(range)
```

**子字符串**

当你获得了一个字符串的子字符串——比如说，使用下标或者类似 prefix(\_:) 的方法——结果是一个[ Substring](https://developer.apple.com/documentation/swift/substring) 的实例，不是另外一个字符串。Swift 中的子字符串拥有绝大部分字符串所拥有的方法，也就是说你可以用操作字符串相同的方法来操作子字符串。总之，与字符串不同，在字符串上执行动作的话你应该使用子字符串执行短期处理。当你想要把结果保存得长久一点时，你需要把子字符串转换为 String 实例。

```swift
let greeting = "Hello, world!"
let index = greeting.firstIndex(of: ",") ?? greeting.endIndex

// String.SubSequence
let beginning = greeting[..<index]
// String
let newString = String(beginning)
```

与字符串类似，每一个子字符串都有一块内存区域用来保存组成子字符串的字符。字符串与子字符串的不同之处在于，作为性能上的优化，子字符串可以重用一部分用来保存原字符串的内存，或者是用来保存其他子字符串的内存。（字符串也拥有类似的优化，但是如果两个字符串使用相同的内存，他们就是等价的。）这个性能优化意味着在你修改字符串或者子字符串之前都不需要花费拷贝内存的代价。如同上面所说的，子字符串并不适合长期保存——因为它们重用了原字符串的内存，只要这个字符串有子字符串在使用中，那么这个字符串就必须一直保存在内存里。

## 集合

**可变性**

如果你创建一个数组、合集或者一个字典，并且赋值给一个变量，那么创建的集合就是*可变的*。这意味着你随后可以通过添加、移除、或者改变集合中的元素来改变（或者说*异变*）集合。如果你把数组、合集或者字典赋值给一个常量，则集合就成了*不可变的*，它的大小和内容都不能被改变。

### 数组

**创建**

```swift
var someInts = [Int]() // 初始化器语法
someInts.append(123)

// 默认值创建 [0.0, 0.0, 0.0]
var threeDoubles = Array(repeating: 0.0, count: 3)

var anotherThreeDoubles = Array(repeating: 2.5, count: 3)
// [0.0, 0.0, 0.0, 2.5, 2.5, 2.5]
var sixDoubles = threeDoubles + anotherThreeDoubles

// 使用数组字面量创建
var shoppingList: [String] = ["Eggs", "Milk"]
```

**访问和修改数组**
