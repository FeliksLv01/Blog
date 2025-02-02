---
title: Swift PM构建 XCFramework
date: 2025-02-03
categories:
    - 客户端
tags:
    - iOS
---

## 安装

```shell
brew install segment-integrations/formulae/swift-create-xcframework
```

## 打包静态库

```shell
swift create-xcframework Alamofire --platform ios --xc-setting MACH_O_TYPE=staticlib --xc-setting LIBRARY_TYPE=static
```
