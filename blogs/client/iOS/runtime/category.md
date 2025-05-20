---
title: Catrgory 原理
date: 2025-02-09
publish: false
categories:
    - 客户端
tags:
    - Objective-C
    - iOS
---

```objc
@implementation Person (test)

- (void)test {
    NSLog(@"Person+test -test");
}

@end
```

将这个 oc 文件转为 cpp。

```shell
xcrun -sdk iphoneos clang -arch arm64 -rewrite-objc Person+test.m -o personTest.cpp
```

Category 相关的结构体如下：

```cpp
struct _category_t {
	const char *name;
	struct _class_t *cls;
	const struct _method_list_t *instance_methods;
	const struct _method_list_t *class_methods;
	const struct _protocol_list_t *protocols;
	const struct _prop_list_t *properties;
};
```

代码里创建了一个 \_category_t 类型的结构体。

```cpp
static struct _category_t _OBJC_$_CATEGORY_Person_$_test __attribute__ ((used, section ("__DATA,__objc_const"))) =
{
	"Person",
	0, // &OBJC_CLASS_$_Person,
	(const struct _method_list_t *)&_OBJC_$_CATEGORY_INSTANCE_METHODS_Person_$_test,
	0,
	0,
	0,
};
```

category 加载的流程。源码阅读顺序：

-   objc-os.mm

    -   \_objc_init
    -   map_images
    -   map_images_nolock

-   objc-runtime-new.mm
    -   \_read_images
    -   remethodizeClass
    -   attachCategories
    -   attachLists
    -   realloc、memmove、 memcpy

1. Category 的实现原理
   Category 编译之后的底层结构是 struct category_t，里面存储着分类的对象方法、类方法、属性、协议信息。在程序运行的时候，runtime 会将 Category 的数据，合并到类信息中（类对象、元类对象中）。

2. Category 和 Class Extension 的区别是什么？
   Class Extension 在编译的时候，它的数据就已经包含在类信息中
   Category 是在运行时，才会将数据合并到类信息中

一个问题：如果分类的方法和原始类一样，那么它会覆盖原始类方法吗？
由于在方法列表中，分类的方法会添加在原始类方法的前面。
所以如果通过 runtime 的 objc_msgSend 方法进行消息发送，那么会先通过自己的 isa 指针找方法的实现，也就是说如果分类和原始类的方法一样，那么它会调用分类的实现的方法，但是原始类的方法还是在方法列表中的，它不是真正的方法覆盖。

## +load

+load 方法会在 runtime 加载类、分类时调用

每个类、分类的+load，在程序运行过程中只调用一次

调用顺序
先调用类的+load
按照编译先后顺序调用（先编译，先调用）
调用子类的+load 之前会先调用父类的+load

再调用分类的+load
按照编译先后顺序调用（先编译，先调用）

+load 方法是根据方法地址直接调用，并不是经过 objc_msgSend 函数调用

## initialize

+initialize 方法会在类第一次接收到消息时调用

调用顺序
先调用父类的+initialize，再调用子类的+initialize
(先初始化父类，再初始化子类，每个类只会初始化 1 次)

+initialize 和+load 的很大区别是，+initialize 是通过 objc_msgSend 进行调用的，所以有以下特点
如果子类没有实现+initialize，会调用父类的+initialize（所以父类的+initialize 可能会被调用多次）
如果分类实现了+initialize，就覆盖类本身的+initialize 调用。

## 给分类添加成员变量
