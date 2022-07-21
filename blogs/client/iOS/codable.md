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

## 最小案例

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

    let decoder = JSONDecoder()
    let data = try decoder.decode([Placemark].self, from: jsonData)
    print(data.first?.name ?? "")
} catch {
    print(error.localizedDescription)
}
```

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
