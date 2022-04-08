---
title: OC学习记录
date: 2022-02-21
sidebar: 'auto'
publish: false
categories:
  - 客户端
tags:
  - OC
  - iOS
---

记录一些函数和语法。。。

## 一些基础C函数

### sleep

用于等待指定的秒数，在`unistd.h`中声明

### atoi

获取一个字符串后将它转换成整数，如果不能转换，就返回0。

```c
int num = atoi("23");
```

### modf

返回浮点数的整数部分和小数部分，整数部分通过引用传递。

```c
double pi = 3.14;
double integerPart;
double fractionPart = modf(pi, &integerPart);
printf("%.0f, %.2f\n", integerPart, fractionPart);
```

### time和localtime_r

`time`函数返回英国格林尼治时间从1970到当前累计时间。`localtime_r`函数可以读取当前秒数。`localtime_r`有两个形式参数，分别是time_t类型变量的地址和struct tm类型变量的地址。

```c
 long t = time(NULL);
 printf("%ld\n", t);
 struct tm now;
 localtime_r(&t, &now);
 printf("The time is %d:%d:%d\n", now.tm_hour, now.tm_min, now.tm_sec);
```

## OC部分

### import 指令

这是一个预处理指令，是include的增强版，将文件的内容在预编译的时候拷贝写指令的地方。同一个文件无论import多少次，只会包含一次。

### NSLog

printf增强版，用于输出一些调试信息。

- 执行这段代码的时间
- 程序的名称
- 进程编号
- 线程编号
- 输出的信息

### OC程序编译

使用编译器将源代码编译成目标文件

```shell
cc -cxx.m
```

- 预处理
- 检查语法
- 编译

链接

```shell
cc xx.o
```

如果程序中使用了框架中的函数或者类，那么在链接的时候，就必须要告诉编译器，去框架中寻找那个类。

```shell
cc xx.o -framework 框架名称
```

链接成功之后，会生成一个a.out可执行文件。

### 内存中的五大区域

- 栈 存储局部变量
- 堆 手动申请的字节空间 malloc、calloc、realloc
- BSS段 存储未被初始化或初始化为0的全局变量 静态变量
- Data段(常量段) 存储已经被初始化的全局、静态变量 常量数据
- 代码段 存储代码

### id

当声明指向对象的指针时，通常都会明确地写出相应对象的类：

```objc
NSDate *expiration;
```

当声明的指针不知道所指对象的准确类型时，可以使用id类型，id类型的含义是：可以指向任意类型Objective-C对象的指针。id已经隐含了星号的作用。

```objc
id delegate;
```

### NSString

#### 创建字符串实例

```objc
NSString *lament = @"Why me?";
```

`@"..."`是OC中的一个缩写，代表根据给定的字符串创建一个`NSString`对象。这种缩写为字面量语法。

#### 创建动态字符串

```objc
NSString *dateStr = [NSString stringWithFormat: @"The date is %@", now];
```

#### NSString 方法

```objc
NSString *str = @"Hello World";
// 获取长度
NSUInteger count = [str length];
NSLog(@"%lu", count);
NSString *temp = @"123";
// 判断字符串是否相同
if([temp isEqualToString: str]) {
  NSLog(@"equal");
}
// 返回原字符串大写版本
NSString *upper = [str uppercaseString];
NSLog(@"%@", upper);

NSString* str = @"test\n123\n";
NSArray *array = [str componentsSeparatedByString:@"\n"];
for (NSString* str in array) {
  NSLog(@"%@", str);
}
```

### NSArray/NSMutableArray

创建NSArray，使用字面量语法。

```objc
NSDate *now = [NSDate date];
NSDate *tomorrow = [now dateByAddingTimeInterval:24.0*60.0*60.0];
NSDate *yesterday = [now dateByAddingTimeInterval:-24.0*60.0*60.0];
NSArray *dateList = @[now, tomorrow, yesterday];

NSLog(@"%@", dateList[0]);
// 获取数组中的元素个数
NSLog(@"%@", [dateList count]);
```

NSArray实例是无法改变的，一旦被创建，就无法添加或者删除。

创建NSMutableArray

```objc
NSMutableArray *dateList = [NSMutableArray array];
[dateList addObject: now];
[dateList addObject: tomorrow];
[dateList insertObject: yesterday atIndex: 0];
[dateList removeObjectAtIndex: 0];
```

#### 快速枚举

```objc
for (NSDate *d in dateList) {
    NSLog(@"%@", d);
}
```

### 类加载

- 当某个类第一次被访问时，会被加载到代码段，这个过程叫类加载
- 执行方法的4步：
  1. 将方法加载到代码段
  2. 声明方法的参数到栈
  3. 把实参的值赋值给形参

### 对象在内存中的存储

```objc
Person *p1 = [Person new];
```

1). Person *p1; 会在栈中申请一块空间。在栈内存中声明一个Person类型的指针变量p1。

2). [Person new]; 真正在内存中创建对象的是这句代码。new做了下面几件事情。

a. 在堆内存中申请一块合适大小的空间。

b. 在这个空间中根据类的模版创建对象。类模版中定义了哪些属性，就把这些属性依次声明在对象之中。对象中还有另外一个属性，叫做`isa`，是一个指针，它指向对象所属的类在代码段中的地址。

c. 初始化对象的属性，如果属性的类型是基本数据类型，那么就赋值为0，如果属性的类型是C语言的指针类型，就赋值为NULL，如果属性的类型是OC的类指针类型，那么就赋值为nil。

d. 返回对象的地址

3). 注意

a. 对象中只有属性，而没有方法，自己类的属性外加1个isa指针指向代码段中的类。
b. 如何访问对象的属性
指针名 -> 属性名
根据指针，找到指针指向的对象，再找到对象中的属性类访问。
c. 如何调用方法
[指针名 方法名];
先根据指针名找到对象，对象发现要调用方法，再根据对象的isa指针找到类，然后调用类里的方法。
