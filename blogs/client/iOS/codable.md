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
