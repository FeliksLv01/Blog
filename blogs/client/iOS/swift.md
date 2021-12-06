---
title: Swift笔记
date: 2021-10-31
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

## 集合类型

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

```swift
var array = [1,2,3,4,5,6,7,8,9]

array.count // 获取数组的长度

if array.isEmpty {
    print("空数组")
}

var a = array[0]
var subArray = array[0...3] // 获取区间元素组成的新数组
var b = array.first
var c = array.last
array[0] = 0
array[0...3] = [1, 2, 3, 4] // 修改数组中区间范围的元素
array.append(10)
array.append(contentsOf: [11, 12, 13]) // 追加一组元素
```

插入和删除

```swift
array.insert(0, at: 0)
array.insert(contentsOf: [-2, -1], at: 0)
array.remove(at: 1)
array.removeFirst()
array.removeLast()
array.removeFirst(2) // 移除前几位元素
array.removeLast(2) // 移除后几位元素

array.removeSubrange(0...2) // 移除范围内的元素
array.replaceSubrange(0...2, with: [0, 1])

array.removeAll()

if array.contains(1) {
    print(true)
}
```

for-in 遍历

```swift
let arrayLeft = [0, 1, 2, 3, 4]
let arrayLet2 = [(1, 2), (2, 3), (3, 4)]

for item in array {
    print(item)
}

for item in arrayLet2.enumerated() {
    print(item)
}

for index in arrayLet2.indices {
    print(arrayLet2[index], separator: "")
}
```

排序

```swift
var arraySort = [1, 3, 5, 6, 7]
arraySort = arraySort.sorted(by: >) // 从大到小排序
arraySort = arraySort.sorted(by: <) // 从小到大排序

arraySort.max()
arraySort.min()
```

### 集合（Set）类型

```swift
var set1: Set<Int> = [1, 2, 3, 4]
var set2 = Set(arrayLiteral: [1, 2, 3, 4])

set1[set1.startIndex]
set1[set1.index(after: set1.startIndex)] // 获取某个下标后一个元素
set1[set1.index(set1.startIndex, offsetBy: 3)] // 获取某个下标后几个元素
```

集合的下标操作是不可逆操作，只能向后移动，不能向前移动

```swift
set1.count
if set1.isEmpty {
  // ...
}

if set1.contains(1) {
  // ...
}
set1.max()
set1.min()
```

增删查改

```swift
set1.insert(5)
set1.remove(1)
set1.removeFirst()
set1.remove(at: set1.firstIndex(of: 3)!) // 移除集合中某个位置的元素
```

**集合数学运算**

集合支持 4 类数学运算，分别为`intersection`(交集)、`symmetricDifference`（交集的补集）、`union`（并集）、`subtracting`（补集）

```swift
let oddDigits: Set = [1, 3, 5, 7, 9]
let evenDigits: Set = [0, 2, 4, 6, 8]
let singleDigitPrimeNumbers: Set = [2, 3, 5, 7]

oddDigits.union(evenDigits).sorted()
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
oddDigits.intersection(evenDigits).sorted()
// []
oddDigits.subtracting(singleDigitPrimeNumbers).sorted()
// [1, 9]
oddDigits.symmetricDifference(singleDigitPrimeNumbers).sorted()
// [1, 2, 9]
```

集合关系运算

- 使用“相等”运算符 ( == )来判断两个合集是否包含有相同的值；
- 使用 isSubset(of:) 方法来确定一个合集的所有值是被某合集包含；
- 使用 isSuperset(of:)方法来确定一个合集是否包含某个合集的所有值；
- 使用 isStrictSubset(of:) 或者 isStrictSuperset(of:)方法来确定是个合集是否为某一个合集的子集或者超集，但并不相等；
- 使用 isDisjoint(with:)方法来判断两个合集是否拥有完全不同的值。

```swift
set1.isSubset(of: set3)  // 子集
set3.isSuperset(of: set1) // 超集
set1.isStrictSubset(of: set3) // 真子集
set3.isStrictSuperset(of: set4) // 真超集
```

### 字典

**创建字典**

```swift
var dict = [Int: String]()
var airports: [String: String] = ["YYZ": "Toronto Pearson", "DUB": "Dublin"]
```

**访问和修改字典**

```swift
if airports.isEmpty {
    print("The airports dictionary is empty.")
} else {
    print("The airports dictionary is not empty.")
}

airports["LHR"] = "London"

// 作为下标脚本的代替，使用字典的 updateValue(_:forKey:)方法来设置或者更新特点键的值
if let oldValue = airports.updateValue("Dublin Airport", forKey: "DUB") {
    print("The old value for DUB was \(oldValue).")
}

// 给一个键赋值 nil来从字典当中移除一个键值对
airports["APL"] = "Apple International"
airports["APL"] = nil

// 使用 removeValue(forKey:)来从字典里移除键值对。这个方法移除键值对如果他们存在的话，并且返回移除的值，如果值不存在则返回 nil
if let removedValue = airports.removeValue(forKey: "DUB") {
    print("The removed airport's name is \(removedValue).")
} else {
    print("The airports dictionary does not contain a value for DUB.")
}
```

**遍历字典**

```swift
for (airportCode, airportName) in airports {
    print("\(airportCode): \(airportName)")
}

// 访问字典的 keys和 values
for airportCode in airports.keys {
    print("Airport code: \(airportCode)")
}

for airportName in airports.values {
    print("Airport name: \(airportName)")
}
```

可以使用 keys 或 values 初始化数组

```swift
let airportCodes = [String](airports.keys)
// airportCodes is ["YYZ", "LHR"]
let airportNames = [String](airports.values)
// airportNames is ["Toronto Pearson", "London Heathrow"]
```

## 控制流

### repeat-while

```swift
repeat {
    statements
} while condition
```

### switch

swift 的 switch 没有显示的贯穿，默认不需要给 case 后面添加 break

符合情况可以用`,`分隔

```swift
let anotherCharacter: Character = "a"
switch anotherCharacter {
case "a", "A":
    print("The letter A")
default:
    print("Not the letter A")
}
```

**区间匹配**

```swift
let approximateCount = 62
let countedThings = "moons orbiting Saturn"
var naturalCount: String
switch approximateCount {
case 0:
    naturalCount = "no"
case 1..<5:
    naturalCount = "a few"
case 5..<12:
    naturalCount = "several"
case 12..<100:
    naturalCount = "dozens of"
case 100..<1000:
    naturalCount = "hundreds of"
default:
    naturalCount = "many"
}
```

**匹配元组**

```swift
let somePoint = (1, 1)
switch somePoint {
case (0, 0):
    print("(0, 0) is at the origin")
case (_, 0):
    print("(\(somePoint.0), 0) is on the x-axis")
case (0, _):
    print("(0, \(somePoint.1)) is on the y-axis")
case (-2...2, -2...2):
    print("(\(somePoint.0), \(somePoint.1)) is inside the box")
default:
    print("(\(somePoint.0), \(somePoint.1)) is outside of the box")
}
```

**值绑定**

```swift
let anotherPoint = (2, 0)
switch anotherPoint {
case (let x, 0):
    print("on the x-axis with an x value of \(x)")
case (0, let y):
    print("on the y-axis with a y value of \(y)")
case let (x, y):
    print("somewhere else at (\(x), \(y))")
}
```

**where**

switch 情况可以使用 where 分句来检查额外的情况。

```swift
let yetAnotherPoint = (1, -1)
switch yetAnotherPoint {
case let (x, y) where x == y:
    print("(\(x), \(y)) is on the line x == y")
case let (x, y) where x == -y:
    print("(\(x), \(y)) is on the line x == -y")
case let (x, y):
    print("(\(x), \(y)) is just some arbitrary point")
}
// prints "(1, -1) is on the line x == -y"
```

### 提前退出

guard 语句，类似于 if 语句，基于布尔值表达式来执行语句。使用 guard 语句来要求一个条件必须是真才能执行 guard 之后的语句。与 if 语句不同， guard 语句总是有一个 else 分句—— else 分句里的代码会在条件不为真的时候执行。

```swift
func greet(person: [String: String]) {
    guard let name = person["name"] else {
        return
    }

    print("Hello \(name)!")

    guard let location = person["location"] else {
        print("I hope the weather is nice near you.")
        return
    }

    print("I hope the weather is nice in \(location).")
}

greet(person: ["name": "John"])
// Prints "Hello John!"
// Prints "I hope the weather is nice near you."
greet(person: ["name": "Jane", "location": "Cupertino"])
// Prints "Hello Jane!"
// Prints "I hope the weather is nice in Cupertino."
```

## 闭包

*闭包*是可以在你的代码中被传递和引用的功能性独立代码块。闭包能够捕获和存储定义在其上下文中的任何常量和变量的引用，这也就是所谓的*闭合*并包裹那些常量和变量，因此被称为“闭包”，Swift 能够为你处理所有关于捕获的内存管理的操作。

闭包有三种形式：

- 全局函数是一个有名字但不会捕获任何值的闭包；
- 内嵌函数是一个有名字且能从其上层函数捕获值的闭包；
- 闭包表达式是一个轻量级语法所写的可以捕获其上下文中常量或变量值的没有名字的闭包。

**逃逸闭包**

逃逸闭包是指在函数内的闭包在函数执行结束后在函数外仍然可以使用，非逃逸闭包是指当函数的生命周期结束后，闭包也被销毁。默认情况下，函数参数里的闭包都是非逃逸闭包，这样做的好处是可以提高代码的性能，节省内存消耗。

逃逸闭包常用于异步操作中，例如一个后台请求完成后要执行闭包回调，需要使用逃逸类型。

**自动闭包**

自动闭包是一种自动创建的用来把作为实际参数传递给函数的表达式打包的闭包。它不接受任何实际参数，并且当它被调用时，它会返回内部打包的表达式的值。这个语法的好处在于通过写普通表达式代替显式闭包而使你省略包围函数形式参数的括号。
