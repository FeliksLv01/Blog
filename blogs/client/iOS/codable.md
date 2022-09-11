---
title: Swift Codable
date: 2022-07-17
publish: false
categories:
  - 客户端
tags:
  - Swift
  - iOS
---

Codable 是 Decodable 和 Encodable 协议的类型别名。当 Codable 用作类型或泛型约束时，它匹配符合这两种协议的任何类型。

```swift
typealias Codable = Decodable & Encodable
```

一个类型通过声明自己遵守 Encodable/Decodable 协议，来表示可以被序列化/反序列化。

```swift
public protocol Encodable {
  public func encode(to encoder: Encoder) throws
}

public protocol Decodable {
  public init(from decoder: Decoder) throws
}
```

只要让你的类型满足 Codable 协议，它就能变成可编码的类型，如果类型中所有的存储属性都是可编解码的，那么编译器会自动帮你生成实现 Encodable 和 Decodable 协议的代码。

如果枚举不包含关联值，或者它们的关联值也遵守 Codable，那么这个枚举也可以同样地通过代码生成满足 Codable。

## Encoding

Swift自带两个编码器，分别是 JSONEncoder 和 PropertyListEncoder。另外，实现了 Codable 的类型和 Cocoa 中的 NSKeyedArchiver 也是兼容的。

```swift
import Foundation
struct Coordinate: Codable {
    var latitude: Double
    var longitude: Double
}

struct Placemark: Codable {
    var name: String
    var coordinate: Coordinate
}

let places = [
    Placemark(name: "Berlin", coordinate: Coordinate(latitude: 52, longitude: 13)),
    Placemark(name: "Cape Town", coordinate: Coordinate(latitude: -34, longitude: 18))
]

do {
    let encoder = JSONEncoder()
    let jsonData = try encoder.encode(places)
    let jsonString = String(decoding: jsonData, as: UTF8.self)
    print(jsonString)
} catch {
    print(error.localizedDescription)
}
```

实际上，JSONEncoder没有实现Encoder协议，它只是一个实现了Encoder协议的私有类的封装。这是因为JSONEncoder应该提供的API和在编码过程中传递给可编码类型的Encoder对象是截然不同的。

## Decoding

```swift
do {
  let decoder = JSONDecoder()
	let data = try decoder.decode([Placemark].self, from: jsonData)
	print(data.first?.name ?? "")
} catch {
  print(error.localizedDescription)
}
```

和编码过程比起来，解码过程中的错误处理是非常重要的。有太多的事情能导致解码失败 - 比如数据缺失 (JSON 中缺少某个必要的字段)、类型错误 (服务器不小心将数字编码为了字符串) 以及数据完全损坏等。

## 自定义编码格式

在进行 JSON 解析的时候，可以与 Property Wrapper 结合来实现更加灵活的功能。比如，我们想把 Coordinate 中的两个 double 类型的属性改为字符串存储，我们可以编写一个属性包装器。

```swift
@propertyWrapper
struct CodedAsString: Codable {

    var wrappedValue: Double

    init(wrappedValue: Double) {
        self.wrappedValue = wrappedValue
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let str = try container.decode(String.self)
        guard let value = Double(str) else {
            let error = EncodingError.Context(
            codingPath: container.codingPath,
            debugDescription: "Invalid string representation of double value"
            )
            throw EncodingError.invalidValue(str, error)
        }
        wrappedValue = value
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(String(wrappedValue))
    }
}

struct Coordinate: Codable {
    @CodedAsString var latitude: Double
    @CodedAsString var longitude: Double
}
```

## 容器

Encoder协议的定义

```swift
/// 一个可以把值编码成某种外部表现形式的类型。
public protocol Encoder {
	/// 编码到当前位置的编码键 (coding key) 路径
	var codingPath: [CodingKey] { get }
	/// 用户为编码设置的上下文信息。
	var userInfo: [CodingUserInfoKey : Any] { get }
	/// 返回一个容器，用于存放多个由给定键索引的值。
	func container<Key: CodingKey>(keyedBy type: Key.Type) -> KeyedEncodingContainer<Key>
	/// 返回一个容器，用于存放多个没有键索引的值。
	func unkeyedContainer() -> UnkeyedEncodingContainer
	/// 返回一个适合存放单一值的编码容器。
	func singleValueContainer() -> SingleValueEncodingContainer
}
```

先忽略codingPath和userInfo，显然Encoder的核心功能是提供一个编码容器，通过给每个要编码的值创建一个新的容器，编码器可以确保每个值都不会覆盖彼此的数据。容器有三种类型：

- 键容器(Keyed Container)：用于编码键值对
- 无键容器：用于编码一系列值，但不需要对应的值
- 单值容器：它们对单一值进行编码

对于这三种容器，它们每个都对应了一个协议，来约束容器应该如何接收一个值并进行编码。

```swift
/// 支持存储和直接编码无索引单一值的容器。
public protocol SingleValueEncodingContainer {
	/// 编码到当前位置的编码键路径。
	var codingPath: [CodingKey] { get }
	/// 编码空值。
	mutating func encodeNil() throws
	/// 编码原始类型的方法
	mutating func encode(_ value: Bool) throws
	mutating func encode(_ value: Int) throws
	mutating func encode(_ value: Int8) throws
	mutating func encode(_ value: Int16) throws
	mutating func encode(_ value: Int32) throws
	mutating func encode(_ value: Int64) throws
	mutating func encode(_ value: UInt) throws
	mutating func encode(_ value: UInt8) throws
	mutating func encode(_ value: UInt16) throws
	mutating func encode(_ value: UInt32) throws
	mutating func encode(_ value: UInt64) throws
	mutating func encode(_ value: Float) throws
	mutating func encode(_ value: Double) throws
	mutating func encode(_ value: String) throws
	mutating func encode<T: Encodable>(_ value: T) throws
}
```

可以看到，这个协议定义了一系列encode方法，包括原始类型还有null值，以及针对泛型的，所有的编码器和解码器都必须支持原始类型，而且所有的Encodable类型从根本上来说，也都必须归结到这些类型。UnkeyedEncodingContainer 和 KeyedEncodingContainerProtocol 拥有和 SingleValueEncodingContainer 相同的结构，不过它们具备更多的能力，比如可以创建嵌套的容器。如果你想要为其它数据格式创建编码器或解码器，那么最重要的部分就是实现这些容器。

## 合成的代码

要继续研究，我们需要知道编译器为我们合成了哪些代码

### CodingKeys

在Placemark中，编译器会生成一个叫做CodingKeys的私有枚举类型。

```swift
struct Placemark {
  // ...
  private enum CodingKeys: CodingKey {
    case name
    case coordinate
  }
}
```

这个枚举包含的成员和结构体里的存储属性一一对应。而枚举值即为键容器编码对象时使用的键。CodingKey是一个协议，它负责完成键到字符串或者整数值的转换。

```swift
/// 该类型作为编码和解码时使用的键
public protocol CodingKey {
	/// 在一个命名集合 (例如：以字符串作为键的字典) 中的字符串值。
	var stringValue: String { get }
	/// 在一个整数索引的集合 (一个整数作为键的字典) 中使用的值。
	var intValue: Int? { get }
	init?(stringValue: String)
	init?(intValue: Int)
}
```

### encode(to:)方法

```swift
struct Placemark: Codable {
	// ...
	func encode(to encoder: Encoder) throws {
		var container = encoder.container(keyedBy: CodingKeys.self)
		try container.encode(name, forKey: .name)
		try container.encode(coordinate, forKey: .coordinate)
	}
}
```

Placemark会把自己编码到一个**键容器**中，对于拥有多个属性的复合数据类型，使用键容器是正确的选择，这里有个例外，就是Range(它使用**无键容器**来编码上下界)。注意，Placemark从编码器中申请容器时，是通过CodingKeys.self指定容器中的键值的。

### init(from:)

我们调用 `try decoder.decode([Placemark].self, from: jsonData)` 时，解码器会按照我们传入的类型 (这里是 [Placemark])，使用 Decodable 中定义的初始化方法创建一个该类型的实例。和编码器类似，解码器也管理一棵由解码容器 (decoding containers) 构成的树，树中所包含的容器我们已经很熟悉了，它们还是键容器，无键容器，以及单值容器。

```swift
struct Placemark: Codable {
	// ...
	init(from decoder: Decoder) throws {
		let container = try decoder.container(keyedBy: CodingKeys.self)
		name = try container.decode(String.self, forKey: .name)
		coordinate = try container.decode(Coordinate.self, forKey: .coordinate)
	}
}
```

