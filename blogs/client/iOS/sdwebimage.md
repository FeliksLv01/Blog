---
title: SDWebImage源码阅读
date: 2022-08-13
publish: false
categories:
  - 客户端
tags:
  - iOS
---

<https://blog.csdn.net/allanGold/article/details/103562722>

## 判断当前线程是不是主线程

对于当前是否在主线程，很多时候我们可能直接使用 `Thread.isMainThread`来判断，但实际上，这是存在一些问题的。首先我们得了解一下以下几个问题。

1. 主线程和主队列的关系
2. 为什么通过 dispatch_get_main_queue() 就可以确保在代码在主线程执行
3. 主线程是否可以执行非主队列里的任务

在需要进行主线程操作的时候，我们经常会这样做

```objc
dispatch_async(dispatch_get_main_queue(), ^{
  NSLog(@"Test");
});
```

主队列是系统自动为我们创建的一个串行队列，在每个应用内只有一个主队列，专门负责处理主线程里的操作。主队列里的任务，即使是异步的，也只能在主线程中执行。

```objc
- (void)test {
    NSLog(@"begin");
    for (int i = 0 ; i < 10; i ++) {
        dispatch_sync(dispatch_get_main_queue(), ^{
            NSLog(@"current Thread: %@; Task: %@",[NSThread currentThread], @(i));
        });
    }
    NSLog(@"end");
}
```

运行以上代码，会先输出 begin 和 end，之后才会输出 current Thread 的信息，这是因为 block 内的任务是异步执行的，主线程会将当前方法(test)执行完成之后才会执行主队列的任务。

但如果改成 sync 就会导致死锁。因为同步任务必须立即被执行，但是由于主线程的 test 方法还没有执行完成，主线程没法去处理主队列里的任务。**也就是说，只有当主线程空闲时，才会调度队列中的任务在主线程执行**。

主队列的任务一定在主线程中执行。那么主线程可以执行非主队列的任务吗？

```objc
NSLog(@"isMainThread: %@", @([NSThread isMainThread]));
dispatch_sync(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    NSLog(@"isMainThread: %@", @([NSThread isMainThread]));
});
```

在主队列中同步执行一个后台队，运行输出结果显示当前是在主线程上。这是因为并行队列同步执行的话，不会创建新的线程，只会在当前线程执行。所以即使`Thread.isMainThread`输出为 true，也不能确保当前的任务是主队列的任务。

所以在 SDWebImage 中也是使用这种方法来判断的。

```objc
#ifndef dispatch_main_async_safe
#define dispatch_main_async_safe(block)\
    if (dispatch_queue_get_label(DISPATCH_CURRENT_QUEUE_LABEL) == dispatch_queue_get_label(dispatch_get_main_queue())) {\
        block();\
    } else {\
        dispatch_async(dispatch_get_main_queue(), block);\
    }
#endif
```

根据苹果官网的描述，可以通过以下方式将 block 在主队列中执行。[链接](https://developer.apple.com/documentation/dispatch/1452921-dispatch_get_main_queue)

> The system automatically creates the main queue and associates it with your application’s main thread. Your app uses one (and only one) of the following three approaches to invoke blocks submitted to the main queue:
>
> - Calling dispatch_main
>
> - Calling UIApplicationMain (iOS) or NSApplicationMain (macOS)
>
> - Using a CFRunLoopRef on the main thread
