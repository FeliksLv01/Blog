---
title: KVO 原理
date: 2025-01-26
categories:
    - 客户端
tags:
    - Objective-C
    - iOS
---

```objc
@interface KVODemoViewController ()
@property (nonatomic, strong) MJPerson *person1;
@property (nonatomic, strong) MJPerson *person2;
@end

@implementation KVODemoViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.person1 = [[MJPerson alloc] init];
    self.person1.age = 4;

    self.person2 = [[MJPerson alloc] init];

    NSKeyValueObservingOptions options = NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld;
    [self.person1 addObserver:self forKeyPath:@"age" options:options context:nil];
}

- (void)dealloc
{
    [self.person1 removeObserver:self forKeyPath:@"age"];
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    self.person1.age = 5;
    self.person2.age = 6;
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    NSLog(@"监听到 %@的 %@的属性值改变了 - %@", object, keyPath, change);
}

@end
```

添加断点查看 person1 和 person2 的 isa 指针，person1 的 isa 指向的是 MJPerson 的子类 NSKVONotifying_MJPerson，person2 的 isa 指向的是 MJPerson。(person1 的 isa 输出是一个地址，我们可以通过 object_getClassName 查看：)

```shell
(lldb) p self.person1.isa
(Class) 0x0100600002600a23
  Evaluated this expression after applying Fix-It(s):
    self.person1->isa
(lldb) p self.person2.isa
(Class) MJPerson
  Evaluated this expression after applying Fix-It(s):
    self.person2->isa


(lldb) po object_getClassName(self.person1)
0x00006000002462a0

(lldb) po (const char *)0x00006000002462a0
"NSKVONotifying_MJPerson"
```

NSKVONotifying_MJPerson 是 MJPerson 的子类，它是 Runtime 动态创建的。怎么证明呢？我们可以使用`objc_getClassList` 获取所有的类，然后找出父类是 MJPerson 的类就行了。

```objc
- (void)test {
    // 获取类的总数
    int numClasses = objc_getClassList(NULL, 0);

    // 分配足够的内存来存储所有类
    Class *classes = (Class *)malloc(sizeof(Class) * numClasses);

    // 获取所有类
    numClasses = objc_getClassList(classes, numClasses);

    // 遍历类并打印类名
    for (int i = 0; i < numClasses; i++) {
        Class cls = classes[i];
        if (class_getSuperclass(cls) == [MJPerson class]) {
            NSLog(@"%@", NSStringFromClass(cls)); // NSKVONotifying_MJPerson
        }
    }

    // 释放内存
    free(classes);
}
```

那么怎么知道这个 NSKVONotifying_MJPerson 这个类里有什么方法呢？我们可以使用`class_copyMethodList` 获取所有的方法，然后遍历方法，打印方法名。

```objc
- (void)test {
    unsigned int methodCount = 0;
    Class cls = NSClassFromString(@"NSKVONotifying_MJPerson");
    Method *methods = class_copyMethodList(cls, &methodCount);
    for (unsigned int j = 0; j < methodCount; j++) {
        Method method = methods[j];
        SEL sel = method_getName(method);
        IMP imp = class_getMethodImplementation(cls, sel);
        NSLog(@"%@-%p", NSStringFromSelector(sel), imp);
    }
    free(methods);
}

// 输出
// setAge:-0x180eae6f4
// class-0x180eac0fc
// dealloc-0x180eabe44
// _isKVOA-0x180eabe3c
```

从结果中可以看出有四个方法，分别是 setAge 、 class 、 dealloc 、 \_isKVOA，那这些方法是继承还是重写？可以通过重写 MJPerson 里的 setAge 方法，然后以同样的方式，输出 IMP 的地址，和上面的结果对比。

这里直接给出结论：

NSKVONotifying_MJPerson 是 MJPerson 的子类，它是 Runtime 动态创建的，并重写了 MJPerson 里的 setAge 方法，以及 NSObject 里的 class、dealloc、\_isKVOA 方法。

移除 KVO 观察者后，我们也可以观察 isa 指针的变化，这里也直接给出结论：移除 person1 的 KVO 观察者后，person1 的 isa 指针指向的是 MJPerson。通过在 dealloc 方法移除 KVO 监听之后，再次使用 objc_getClassList 获取一下所有类，可以发现中间类 NSKVONotifying_MJPerson 还在内存之中，可能考虑到复用，所以没有释放）。

怎么知道 NSKVONotifying_MJPerson 如何重写 setAge 方法的呢？

```objc
NSLog(@"%p, %p", [self.person1 methodForSelector:@selector(setAge:)], [self.person2 methodForSelector:@selector(setAge:)]);
```

开启断点之后，可以打印出对应的 IMP

```shell
(lldb) p (IMP)0x180eae6f4
(IMP) 0x0000000180eae6f4 (Foundation`_NSSetUnsignedLongLongValueAndNotify)
(lldb) p (IMP)0x102a74ee4
(IMP) 0x0000000102a74ee4 (InterviewDemo`-[MJPerson setAge:] at MJPerson.m:12)
```

可以看到 person1 的 setAge 重写为了 \_NSSetUnsignedLongLongValueAndNotify。这个方法的内部实现大概长这样（需要逆向）：

```objc
// 伪代码
- (void)_NSSetUnsignedLongLongValueAndNotify {
    [self willChangeValueForKey:@"age"];
    [super setAge:age];
    [self didChangeValueForKey:@"age"];
}
```

我们上面提到，它还重写了 class 方法，我们可以验证一下。

```objc
NSLog(@"%@, %@", object_getClass(self.person1), object_getClass(self.person2));
// NSKVONotifying_MJPerson, MJPerson

NSLog(@"%@, %@", [self.person1 class], [self.person2 class]);
// MJPerson, MJPerson
```

object_getClass 方法我们知道是返回它的 isa 指针，它和 class 方法的返回不一样，这就可以说明确实重写了 class 方法，返回的是 MJPerson。

## 总结

1.  iOS 用什么方式实现 KVO 的？

-   利用 Runtime 动态创建子类，并让 instance 对象的 isa 指向这个新的子类。
-   当修改 instance 对象的属性时，会调用 Foundation 的\_NSSetXXXValueAndNotify 方法。
    -   会调用 willChangeValueForKey:
    -   父类原有的 setter
    -   didChangeValueForKey:
    -   内部会触发监听器的监听方法(observeValueForKeyPath:ofObject:change:context:)

2. 如何手动触发 KVO？

```objc
[self.person1 willChangeValueForKey:@"age"];
[self.person1 didChangeValueForKey:@"age"];
```

didChangeValueForKey 内部会判断有没有调用 willChangeValueForKey，如果没有调用，就不会触发监听方法。

3. 直接修改成员变量会触发 KVO 吗？

不会。因为直接修改成员变量，不会触发 setter 方法，不会调用 willChangeValueForKey 和 didChangeValueForKey 方法。
