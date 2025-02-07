---
title: Runtime系列1-浅析NSObject对象的Class
date: 2025-01-05
publish: false
categories:
    - 客户端
tags:
    - Objective-C
    - iOS
---

## 前言

Runtime 作用是什么？最大的作用当然是：**将 Objective-C 对象、方法、协议用 C 语言来解释**因此，笔者打算先简单分享这方面的知识点，更深入的留到后续部分再聊。

NSObject 对象是 iOS 开发者都很熟悉的对象，它几乎是所有对象的根类。在任何.m 文件中输入以下代码：

```nginx
NSObject
```

点击`NSObject`跳转到其定义文件，发现如下声明：

```shell
@interface NSObject <NSObject> {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wobjc-interface-ivars"
    Class isa  OBJC_ISA_AVAILABILITY;
#pragma clang diagnostic pop
}
```

其中`#pragma clang diagnostic push`用于去除警告，因此，我们能发现 NSObject 对象只有一个`Class`类型的成员变量：`isa`。  
那么：

-   什么是`isa`
-   什么是`Class`类型，与`class` 方法有何区别

这篇文章将要给大家揭晓该问题。

## 关于 Class

我们知道任何一个类都有 `class`方法比如：

```
[NSObject class];
```

当然还有`superclass`方法：

```
[NSObject superclass];
```

更多和 class 相关的方法列举如下：

```markdown
-   (BOOL)isKindOfClass:(Class)aClass;
-   (BOOL)isMemberOfClass:(Class)aClass;
```

这两个方法相信大家都不陌生，只不过这两个方法位于`@protocol NSObject`中，但`NSObject`中还是有其实现的。所以我们有理由相信，`NSObject`中的成员变量`isa`是有特殊含义的，点击改成员变量的类型`Class`我们可以看到其定义：

```
typedef struct objc_class *Class;
```

继续点击`objc_class`：

```swift
struct objc_class : objc_object {
//这里省略成员变量以及方法...
}
```

再次点击`objc_object`：

```
struct objc_object {
private:
isa_t isa;
//这里省略成员变量以及方法...
}
```

层次有点深，但大家只关注其结构即可：

> `Class`本质是一个结构体。

画个图总结一下：  
![NSObject内部类继承图表](https://images.xiaozhuanlan.com/photo/2018/c83aa9f019577a9fef7b3e76f21c09d6.png)

NSObject 内部类继承图表

关于结构体，大家应该都有所了解，这里再做个复习吧：  
C 语言和 C++ 都支持结构体，只是 C++ 的结构体基本上和类没有区别。以下是摘自知乎某答主：

> **结构体和类的区别**  
> 本质上来说结构体与类是同一个东西，可是默认情况下基于可读性的原因还是加一些区分：  
> 结构体就只含数据成员和构造函数、析构函数，尽可能保持简单。  
> 类则包含更多的非构造、析构成员函数，概念更大，用来描述普遍意义上的对象类型。

我们有理由相信：`NSObject`对象的各个方法，基本上是针对其结构体 isa 对象的操作。这里我们研究几个我们常用的方法：

## 是否同一个类(isMemberOfClass)

```php
- (BOOL)isMemberOfClass:(Class)cls {
return [self class] == cls;
}
```

很简单，判断一下，当前的 class 方法是否等于参数。  
因为`self`是`NSObjec`t 对象，因此我们查看`class`方法：

```ruby
- (Class)class {
return object_getClass(self);
}
```

其定义如下：

```
Class object_getClass(id obj)
{
if (obj) return obj->getIsa();
else return Nil;
}
```

点击`object_getClass` 我们可以看到，这个方法位于文件 objc_object.h 中，而且有两个定义：  
![两个 getIsa 方法](https://images.xiaozhuanlan.com/photo/2021/bbd3d276a1f499d74f49c0d0980fe613.png)

两个 getIsa 方法

如图我们暂时不看上面那个 getIsa，因为他是支持 Tagged Pointers 的版本，关于 Tagged Pointers 是另外一个主题，我们后面会讲到，现在我们先看不支持 Tagged Pointers 的，也就是如下定义：

```
inline Class
objc_object::getIsa()
{
if (!isTaggedPointer()) return ISA();
uintptr_t ptr = (uintptr_t)this;
if (isExtTaggedPointer()) {
uintptr_t slot =
            (ptr >> _OBJC_TAG_EXT_SLOT_SHIFT) & _OBJC_TAG_EXT_SLOT_MASK;
return objc_tag_ext_classes[slot];
    } else {
uintptr_t slot =
            (ptr >> _OBJC_TAG_SLOT_SHIFT) & _OBJC_TAG_SLOT_MASK;
return objc_tag_classes[slot];
    }
}
```

可以发现，越牵扯越深，阅读有点困难了。但大家别着急，我们可以屏蔽

```
if (!isTaggedPointer()) return ISA();
```

以下的代码，因为我们不支持 Tagged Pointer。上面的代码于是可以先简化成：

```
inline Class
objc_object::getIsa()
{
if (!isTaggedPointer()) return ISA();
}
```

所以，我们只需要继续研究`ISA()`方法：

```
inline Class
objc_object::ISA()
{
    assert(!isTaggedPointer());
#if SUPPORT_INDEXED_ISA
if (isa.nonpointer) {
uintptr_t slot = isa.indexcls;
return classForIndex((unsigned)slot);
    }
return (Class)isa.bits;
#else
return (Class)(isa.bits & ISA_MASK);
#endif
}
```

同样去掉暂时不需要我们理解的部分，简化代码如下：

```
inline Class
objc_object::ISA()
{
return (Class)(isa.bits & ISA_MASK);
}
```

至此，我们可以看到 class 方法最终获取的即是：结构体`objc_object`的`isa.bits & ISA_MASK`的结果。  
那，大家的疑问也会随之而来：

-   `inline` 关键字作用，为何这里的几个方法实现都在`.h`文件中
-   在方法：`objc_object::ISA()` 中双冒号的作用。
-   `objc_object` 中的`isa`又是什么
-   `isa.bits` & `ISA_MASK` 的含义

### inline 关键字

> 用来定义一个类的内联函数，引入它的主要原因是用它替代 C 中表达式形式的宏定义。

也就是说，用`inline`关键字修饰的是内联函数，内联函数用于替代宏定义。取代宏定义的原因是：

> 1.  C 中使用 define 这种形式宏定义的原因是因为，C 语言是一个效率很高的语言，这种宏定义在形式及使用上像一个函数，但它使用预处理器实现，没有了参数压栈，代码生成等一系列的操作,因此，效率很高，这是它在 C 语言中被使用的一个主要原因。
> 2.  这种宏定义在形式上类似于一个函数，但在使用它时，仅仅只是做预处理器符号表中的简单替换，因此它不能进行参数有效性的检测，也就不能享受 C++ 编译器严格类型检查的好处，另外它的返回值也不能被强制转换为可转换的合适的类型，这样，它的使用就存在着一系列的隐患和局限性。
> 3.  在 C++ 中引入了类及类的访问控制，这样，如果一个操作或者说一个表达式涉及到类的保护成员或私有成员，你就不可能使用这种宏定义来实现(因为无法将 this 指针放在合适的位置)。
> 4.  inline 推出的目的，也正是为了取代这种表达式形式的宏定义，它消除了宏定义的缺点，同时又很好地继承了宏定义的优点。

### 双冒号

> 用于表示“域操作符”，例：声明了一个类 A，类 A 里声明了一个成员函数 void f()，但没有在类的声明里给出 f 的定义，那么在类外定义 f 时，就要写成 void A::f()，表示这个 f()函数是类 A 的成员函数。

### objc_object 中的 isa

之前我们已经写了`objc_object`的定义，可以知道，isa 其实是一个`isa_t`的对象，那`isa_t`是什么呢，我们继续看一下它的实现：

```
union isa_t
{
//这里省略很多变量
}
```

可以知道，`isa_t`是个联合体,也就是说：`objc_object` 中的`isa`其实是个联合体

### isa.bits & ISA_MASK 含义

上面我们知道，`isa`是个联合体，其内部的属性 bits 呢？

```
union isa_t
{
//省略部分方法和属性...
uintptr_t bits;
```

然后看`uintptr_t`实现：

```
typedef unsigned long        uintptr_t;
```

发现其是个`unsigned long`类型，而`ISA_MASK`的定义如下：

```shell
# if __arm64__
#   define ISA_MASK        0x0000000ffffffff8ULL
# elif __x86_64__
#   define ISA_MASK        0x00007ffffffffff8ULL
# else
#   error unknown architecture for packed isa
# endif
```

可知，其实`ISA_MASK`还是个数值类型。也就是说判断两个对象是否是同一个`class`其实是通过比对`objc_object`中的数值计算后得出的结果是否相等得出的。

于是，我们上面的类继承图表又可以做如下完善：  
![](https://images.xiaozhuanlan.com/photo/2018/b8b1c56e5b97dafdd95d0400f08e64c2.png)

讲完了 `isMemberOfClass`方法，`isKindOfClass`方法这里就不多做介绍了，给出其源代码即可：

## 是否父子类关系(isKindOfClass)

其实现如下：

```
+ (BOOL)isKindOfClass:(Class)cls {
for (Class tcls = object_getClass((id)self); tcls; tcls = tcls->superclass) {
if (tcls == cls) return YES;
    }
return NO;
}
```

## 总结

-   `Class`类型本质是个结构体，该结构体中存储了该`NSObject`中的所有信息。
-   比对两个类是否是同一个类，其实是判断`Class`中的某个数值运算的结果是否相等。

---

NSObject 的对象对外暴露的属性就只有 isa，重要性不言而喻。  
isa 是一个 Class 类型的变量，他在 objc.h 中有定义，其实是个结构体指针，结构体名字为：objc_class。目前我们还不知道这个结构体的作用，但我们相信随着我们逐渐深入的查看源码，他定会被我们一览无余。  
果不其然，我们随便找一个方法 isMemberOfClass （作用是判断某个对象是否是某个类的成员），通过我们的刨根问底，终于发现，判断某个对象是否属于某个类，其实是通过 object_getClass 来实现的，而这个方法正好就是结构体 objc_object（objc_class 子类） 中的方法。

## 结论

目前我们已经知道这个 object_getClass 类型的一个实例是 NSObject 类的成员变量，而且 NSObject 类的 class 方法，以及一切和 class 相关的方法，比如 isMemerOfClass，都是 objc_object 他来管理的。
