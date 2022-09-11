---
title: Swift 键路径
date: 2022-09-10
categories:
  - 客户端
tags:
  - Swift
  - iOS
---

键路径是一个指向属性的未调用的引用。它描述了一个从根路径开始的类型层级路径。代码示例如下：

```swift
struct Address {
	var street: String
	var city: String
	var zipCode: Int
}

struct Person {
	let name: String
	var address: Address
}

// WritableKeyPath<Person, String>
let streetPath = \Person.address.street

// KeyPath<Person, String>
let namePath = \Person.name

```

键路径可以由任意的存储和计算属性组合而成，其中还可以包括可选链操作符。编译器会自动为所有类型生成 [keyPath:] 的下标方法。你通过这个方法来“调用”某个键路径。对键路径的调用，也就是在某个实例上访问由键路径所描述的属性。

```swift
let address = Address(street: "成华大道", city: "成都", zipCode: 610081)
print(address[keyPath: \.street]) // 成华大道

```

namePath 的类型是`KeyPath<Person, String>`，这个键路径是强类型的，它表示该键路径可以作用于 Person，并返回一个 String。而 streetPath 是一个`WritableKeyPath`，这是因为构成这个键路径的所有属性都是可变的，所以这个可写键路径本身允许其中的值发生变化。

```swift
let streetPath = \Person.address.street
var person = Person(name: "Feliks", address: address)
person[keyPath: streetPath] = "二仙桥"
```

也可以使用 KeyPath 来描述下标操作，例如提取数组中元素的属性：

```swift
var lisa = Person(name: "lisa", address: address)
var bart = Person(name: "bart", address: address)

let people = [lisa, bart]
print(people[keyPath: \.[1].name])
```

也可以用于在键路径中包含字典下标。

## KeyPath Can Be Modeled with Functions

编译器可以自动把一个键路径表达式转换成一个函数，例如在 map 中的使用：

```swift
people.map { $0.name }
people.map(\.name)
```

这只对键路径表达式有效，以下代码会编译失败。

```swift
let keyPath = \Person.name
people.map(keyPath)
```

直接传不行，因为类型不匹配。为了解决这个问题，可以显式地转换成函数形式。

```rust
let f: (User) -> String  = \.name
let f2 = \.name as (User) -> String
```

编译器会生成类似的函数：

```rust
let f: (User) -> String = { kp in { root in root[keyPath: kp] } }(\User.name)
```

键路径可以附加，但是类型必须匹配，可以实现

A->B + B->C = A->C

```swift
// KeyPath<Person, String> + KeyPath<String, Int> = KeyPath<Person, Int>
let nameCountKeyPath = nameKeyPath.appending(path: \.count)
// Swift.KeyPath<Person, Swift.Int>
```
