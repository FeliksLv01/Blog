---
title: Block
date: 2025-02-11
publish: false
categories:
    - 客户端
tags:
    - iOS
    - Objective-C
---

## Block 的基本使用

```objc
int age = 10;
void (^block)(int, int) = ^(int a, int b) {
    NSLog(@"%d %d %d", a, b, age);
};
block(1, 2);
```

## Block 的本质

Block 的本质是一个 OC 对象，它内部也有个 isa 指针。Block 是封装了函数调用以及函数调用环境的 OC 对象。

```cpp
strut __main_block_impl_0 {
    struct __block_impl impl;
    struct __main_block_desc_0* Desc;
    int age;
};

struct __block_impl {
    void *isa;
    int Flags;
    int Reserved;
    void *FuncPtr;
}

struct __main_block_desc_0 {
    size_t reserved;
    size_t Block_size;
}
```

## Block 的变量捕获

为了保证 block 内部能够正常访问外部的变量，block 有个变量捕获机制

| 变量类型        | 捕获到 block 内部 | 访问方式 |
| --------------- | ----------------- | -------- |
| 局部变量 auto   | 是                | 值传递   |
| 局部变量 static | 是                | 指针传递 |
| 全局变量        | 否                | 直接访问 |

## Block 的类型

block 有 3 种类型，可以通过调用 class 方法或者 isa 指针查看具体类型，最终都是继承自 NSBlock 类型。

-   \_\_NSGlobalBlock\_\_（\_NSConcreteGlobalBlock）
-   \_\_NSStackBlock\_\_（\_NSConcreteStackBlock）
-   \_\_NSMallocBlock\_\_（\_NSConcreteMallocBlock）
