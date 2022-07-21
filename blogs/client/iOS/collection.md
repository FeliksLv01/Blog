---
title: Swift 内建集合类型
date: 2022-07-17
publish: false
categories:
  - 客户端
tags:
  - Swift
  - iOS
---

## 数组

### 数组和可变性

数组的可变性通过定义时使用 var/let 来进行区分。由于 Swift 中的数组的值类型，将数组赋值给一个新的变量的时候，数组的内容将会被复制。

```swift
var nums = [0,1,2,3]
nums.append(4)
nums.append(contentsOf: [5,6,7])

var x = [1, 2, 3]
var y = x
y.append(4)
y // [1,2,3,4]
x // [1,2,3]
```
