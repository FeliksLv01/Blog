---
title: Swift进阶
date: 2022-07-10
sidebar: 'auto'
publish: false
categories:
  - 客户端
tags:
  - Swift
  - iOS
---

## 内建集合类型

### 数组

Swift 集合类型都是值类型，并使用了“写时复制”功能这一技术，它能保证只在必要的时候对数据进行复制。

#### 数组变形

```swift
let squares = fibs.map { fib in fib * fib }
squares // [0, 1, 1, 4, 9, 25]
```

可以模拟实现一下 map 功能。

```swift
extension Array {
func map<T>(_ transform: (Element) -> T) -> [T] {
    var result: [T] = []
    result.reserveCapacity(count)
    for x in self {
      result.append(transform(x))
    }
    return result
  }
}
```

## Optional

```swift
enum Optional<Wrapped> {
    case name
    case some(Wrapped)
}
```

如果只想对非 nil 的值做 for 循环，可以使用 case 来进行模式匹配。

```swift
for case let i? in maybeInts {

}

// 只对nil做循环
for case nil in maybeInts {

}
```

这里只使用了`x?`这个模式，它只会匹配那些非 nil 的值。这是`.some(x)`的简写形式。

```swift
for case let .some(i) in maybeInts {
  print(i)
}
```

### if var and while var

除了 let 以外，你还可以使用 var 来搭配 if、while 和 for。这让你可以在语句块中改变变量：

```swift
let number = "1"
if var i = Int(number) {
  i += 1
  print(i)
} // 2
```

这里的 i 是一个本地的复制，任何对 i 的改变将不会影响原来的可选值。

### Never

一个返回 Never 的函数用于通知编译器：它绝对不会返回。有两类常见的函数会这么做：一种是像 fatalError 那样表示程序失败的函数，另一种是像 dispatchMain 那样运行在整个程序生命周期的函数。编译器会使用这个信息来检查和确保控制流正确。举例来说，guard 语句的 else 路径必须退出当前域或者调用一个不会返回的函数。
Never 又被叫做无人类型 (uninhabited type)。这种类型没有有效值，因此也不能够被构建。一个声明为返回无人类型的函数绝对不可能正常返回。
在 Swift 中，无人类型是通过一个不包含任意成员的 enum 实现的：
public enum Never { }

一般来说，你不会自己定义返回 Never 的方法，除非你在为 fatalError 或者 preconditionFailure 写封装。一个很有意思的应用场景是，当你要创建一个很复杂的 switch 语句，在逐条编写每个 case 的过程中，编译器就会用空的 case 语句或者是没有返回值这样的错误一直轰炸你，而你又想先集中精力处理某一个 case 语句的逻辑。这时，放几个 fatalError() 就能让编译器闭嘴。你还可以写一个 unimplemented() 方法，这样能够更好地表达这些调用是暂时没有实现的意思：

```swift
func unImplemented() -> Never {
    fatalError("This code path is not implemented")
}
```

### 可选链赋值

可以通过可选链来进行赋值。假设你有一个可选值变量，如果它不是 nil 的话，你想要更新它的一个属性：

```swift
struct Person {
    var name: String
    var age: Int
}

var optionalLisa: Person? = Person(name: "Lisa Simpson", age: 8)
// 如果不是 nil，则增加 age
if optionalLisa != nil {
    optionalLisa!.age += 1
}
optionalLisa // age = 9
```

由于这里的 Person 是结构体，是值类型，不能使用可选绑定的方式，绑定后的值只是原来值的局部作用域的复制，对这个复制进行变更，并不会影响原来的值：

```swift
if var lisa = optionalLisa {
    // 对lisa的更改不会影响到optionalLisa
    lisa.age += 1
}
```

可以通过下面的方式对可选值赋值：

```swift
var a: Int? = 10
a? = 5
a // Optional(5)
```

`a? = 5`这种方式，只在 a 的值在赋值前不为 nil 时才会生效。

此外，对于字典这种类型，我们知道，将其中某个键的值设置为 nil 的时候，可以将对应的键从字典中删除。设想一下下面这个字典。

```swift
var dict:[String:Int?] = [
    "one":1,
    "two":2,
    "three":nil
]
```

这个字典的值为可选值类型，要想将 two 键对应的值设置成 nil，需要直接使用`dict["two"] = nil`，将会将 two 这个键从字典中删除。这里就可以使用可选值赋值的方式。

```swift
dict["two"]? = nil
```

### nil 合并运算符

```swift
array.first ?? 0
```

合并运算符也可以进行链接操作，如果你有多个可选值，并且想要**第一个非 nil 的值**，你可以将它们按顺序合并。

## 函数

### sort

Swift 的排序可以使用任意的比较函数来对集合进行排序。
