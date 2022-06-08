---
title: 动态化引擎实践
date: 2022-04-17
publish: false
sidebar: 'auto'
categories:
  - 客户端
tags:
  - Swift
  - iOS
---

本文参考快手电商无线团队的文章[打造你自己的动态化引擎](https://juejin.cn/post/7046299455397560350)，在 iOS 上进行了尝试。

## JS 引擎

JSCore 是 WebKit 默认内嵌的 JS 引擎。它建立起了 Objective-C 和 JavaScript 两门语言沟通的桥梁。iOS7 之后，苹果对 WebKit 中的 JSCore 进行了 Objective-C 的封装，并提供给所有的 iOS 开发者。JSCore 框架给 Swift、OC 以及 C 语言编写的 App 提供了调用 JS 程序的能力。同时我们也可以使用 JSCore 往 JS 环境中去插入一些自定义对象。JSCore 作为苹果的浏览器引擎 WebKit 中重要组成部分，这个 JS 引擎已经存在多年。

### Native 调用 JS

```swift
import JavaScriptCore    //导入JavaScriptCore
// 通过JSContext执行js代码
let context = JSContext()
guard let context = context else {
    return
}
let value = context.evaluateScript("var i = 0; i++; i")!
rint("result: \(value.toNumber() ?? 0)") // result: 1
```

### Native 执行 JS 方法

```swift
let context = JSContext()
guard let context = context else {
    return
}
let jsStr = "function add(a, b) { return a + b }"
context.evaluateScript(jsStr)
guard let function = context.objectForKeyedSubscript("add") else {
    return
}
let res = function.call(withArguments: [1, 2])
print("result: \(res?.toNumber() ?? 0)") // result: 3
```

## 双向通信

### JS 调用 Native 方法

首先介绍一下`JSExport`。JSExport是一个协议，遵守此协议，就可以定义我们自己的协议，在协议中声明的API都会在JS中暴露出来，这样JS才能调用原生的API。

以实现`console.log`为例:

```swift
@objc protocol ConsoleProtocol: JSExport {
    func log(_ msg: String)
}

class Console: NSObject, ConsoleProtocol {
    
    func log(_ msg: String) {
        NSLog("JSCore: \(msg)")
    }
}

// 实际调用

let console = Console()
context.setObject(console, forKeyedSubscript: "console" as NSCopying & NSObjectProtocol)
context.evaluateScript("console.log('Hello World')")
// 2022-04-17 18:39:18.946365+0800 Iwut[93022:661962] JSCore: Hello World
```
