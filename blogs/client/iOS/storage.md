---
title: iOS文件管理
date: 2022-01-07
publish: false
categories:
  - 客户端
tags:
  - iOS
---

## 沙盒简介

iOS 中每个应用程序都有一个独立的文件夹，这个文件夹就是沙盒。沙盒用来存储 app 的本地文件，例如：音频、视频、图片文件等。并且每个 app 的沙盒都是独立的，即当前 app 没有权限访问其他 app 的沙盒，所以说沙盒存储较之更安全。

沙盒分为 Bundles 和 Datas

- Bundles 主要包括应用配置信息和二进制文件/资源
- Datas 主要包括 Documents、Library、SystemData、tmp

Datas 结构

- Documents 可以进行备份和恢复，体积较大，一般存储用户数据
- Library 开发者最长使用的文件夹，可以自定义子文件夹
- tmp 临时文件不会备份，启动时有可能被清除

### Library 和 Documents 的区别

Documents 是支持用户共享的，通过在 info.plist 中添加`Application supports iTunes file sharing`

Library 下有 Preferences、Caches 和一些自定义文件夹

- Caches：存放体积大又不需要备份的数据,SDWebImage 缓存路径就是这个
- Preference：用户偏好设置目录，UserDefault，iCloud 会备份设置信息

## 沙盒操作

### 获取沙盒路径

获取沙盒根路径

```swift
let homePath = NSHomeDirectory()
```

获取 document 路径

```swift
let pathArray = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)
print(pathArray[0])
```

获取 library 路径

```swift
let documentPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)
```

获取 cache 路径

```swift
let cachePath = NSSearchPathForDirectoriesInDomains(.cachesDirectory, .userDomainMask, true)
```

获取 tmp 路径

```swift
let tmpPath = NSTemporaryDirectory()
```

获取程序包路径

```swift
let path = Bundle.main.resourcePath
```

获取图片资源路径

```swift
let imagePath = Bundle.main.path(forResource: "temp", ofType: "png")
```

## 文件管理

FileManager 类

- 单例，提供 App 内⽂件 & ⽂件夹管理功能
- 创建⽂件、删除文件、查询文件、移动和复制等
- 读取⽂件内容 & 属性
- 通过 URL 或者 String 作为 Path

FileManagerDelegate

- 提供移动、复制、删除等操作的具体自定义实现

检查文件是否存在

```swift
FileManager.default.fileExists(atPath: filePath)
```

创建文件夹

```swift
FileManager.default.createDirectory(atPath: path, withIntermediateDirectories: true, attributes: nil)
```

创建文件

```swift
let data = "Hello World".data(using: .utf8)
FileManager.default.createFile(atPath: path, contents: data, attributes: nil)
```

删除文件

```swift
FileManager.default.removeItem(atPath: path)
```

移动文件

```swift
FileManager.default.moveItem(atPath: oldPath, toPath: newPath)
```

复制文件

```swift
FileManager.default.copyItem(atPath: oldPath, toPath: newPath)
```

获取文件属性

```swift
FileManager.default.attributesOfItem(atPath: filePath)
```

## FileHandler

```swift
let path = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0] + "test.txt"
if !FileManager.default.fileExists(atPath: path) {
    FileManager.default.createFile(atPath: path, contents: nil, attributes: nil)
}

let fileHandle = FileHandle(forWritingAtPath: path)!
fileHandle.seekToEndOfFile()
fileHandle.write("hello, world!".data(using: .utf8)!)
try? fileHandle.close()

if let content = try? String(contentsOfFile: path, encoding: .utf8) {
    print(content)
}
```

## NSCoder

- 归档（序列化）& 解归档（反序列化）
- 提供简单的函数，在Object和二进制数据间进行转换
- 抽象类 具体功能需要子类实现

