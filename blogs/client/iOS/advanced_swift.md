---
title: Swift进阶
date: 2022-07-10
sidebar: 'auto'
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
