---
title: iOS多线程开发
date: 2022-04-14
sidebar: 'auto'
categories:
  - 客户端
tags:
  - OC
  - iOS
---

## 同步和异步

**同步执行（sync）**：

- 同步添加任务到指定的队列中，在添加的任务执行结束之前，会一直等待，直到队列里面的任务完成之后再继续执行。
- 只能在当前线程中执行任务，不具备开启新线程的能力。

**异步执行（async）**：

- 异步添加任务到指定的队列中，它不会做任何等待，可以继续执行任务。
- 可以在新的线程中执行任务，具备开启新线程的能力。

## 进程和线程

线程与进程的比较如下:

- 进程是资源(包括内存、打开的文件等)分配的单位，线程是 CPU 调度的单位;

- 进程拥有一个完整的资源平台，而线程只独享必不可少的资源，如寄存器和栈;

- 线程同样具有就绪、阻塞、执行三种基本状态，同样具有状态之间的转换关系;

- 线程能减少并发执行的时间和空间开销;

对于，线程相比进程能减少开销，体现在:

- 线程的创建时间比进程快，因为进程在创建的过程中，还需要资源管理信息，比如内存管理信息、文件管理信息，而线程在创建的过程中，不会涉及这些资源管理信息，而是共享它们;
- 线程的终止时间比进程快，因为线程释放的资源相比进程少很多;
- 同一个进程内的线程切换比进程切换快，因为线程具有相同的地址空间(虚拟内存共享)，这意味着
  同一个进程的线程都具有同一个⻚表，那么在切换的时候不需要切换⻚表。而对于进程之间的切换，
  切换的时候要把⻚表给切换掉，而⻚表的切换过程开销是比较大的;
- 由于同一进程的各线程间共享内存和文件资源，那么在线程之间数据传递的时候，就不需要经过内核了，这就使得线程之间的数据交互效率更高了;

所以，不管是时间效率，还是空间效率线程比进程都要高。

## 主线程

- 一个程序运行后，默认会开启一个主线程，称为“主线程”或“UI 线程”。
- 主线程一般用来刷新 UI 界面，处理 UI 事件（比如点击、滚动、拖拽
- 别把耗时操作放到主线程，那样会卡住主线程，影响 UI 流畅度

## iOS 多线程技术方案

| 技术方案    | 简介                                                                                  | 语言 | 线程生命周期 | 使用频率 |
| ----------- | ------------------------------------------------------------------------------------- | ---- | ------------ | -------- |
| pthread     | 一套通用的多线程 API，适用于 Linux/Uninx/Windows 等系统，跨平台、可移植，使用难度较大 | C    | 程序员管理   | 几乎不用 |
| NSThread    | 使用更加面向对象，简单易用，直接操作线程对象                                          | OC   | 程序员管理   | 偶尔不用 |
| GCD         | 旨在替代 NSThread 等多线程技术，充分利用设备的多核                                    | C    | 自动管理     | 经常使用 |
| NSOperation | 基于 GCD，比 GCD 多了一些更简单实用的功能，使用更加面向对象                           | OC   | 自动管理     | 经常使用 |

## pthread

```c
#include <pthread/pthread.h>
#include <stdio.h>

void* hello(void* param) {
  printf("Hello %s\n", (char*)param);
  return NULL;
}

int main() {
  // 1. 线程编号地址
  // 2. 线程的属性
  // 3. 线程要执行的函数
  // 4. 要执行函数的参数
  // 函数返回值 int 0成功 非0 失败
  pthread_t pthread;
  char* name = "felikslv";
  int res = pthread_create(&pthread, NULL, hello, name);
  if (res != 0) {
    printf("失败\n");
  }
  while (1) {
  }
}
```

### 传递 oc 字符串

使用`__bridge`桥接

```objc
pthread_t pthread;
NSString *name = @"felikslv";
int res = pthread_create(&pthread, NULL, hello, (__bridge void *)name);


void* hello(void* param) {
  NSString *name = (__bridge NSString *) param;
  NSLog(@"Hello %@", name);
  return NULL;
}
```

## NSThread

方式一

```objc
NSThread *thread = [[NSThread alloc] initWithTarget:self selector: @selector(demo) object:nil];
[thread start];
```

方式二

创建后立即执行

```objc
[NSThread detachNewThreadSelector:@selector(demo) toTarget:self withObject:nil];
```

方式三

```objc
[self performSelectorInBackground:@selector(demo) withObject:nil];
```

方式四 带参数

```objc
NSThread *thread = [[NSThread alloc] initWithTarget:self selector:@selector(demo:) object:@"felikslv"];
[thread start];
```

### NSThread 生命周期

```objc
// 新建状态
NSThread *thread = [[NSThread alloc] initWithTarget:self selector:@selector(demo:) object:@"felikslv"];
// 就绪状态
[thread start];

- (void) demo: (NSString*)name {
    NSLog(@"hello %@",name);
    for(int i = 0;i<20;i++) {
        NSLog(@"%d",i);
        if (i == 5) {
          // 阻塞状态
            [NSThread sleepForTimeInterval:3];
        }
        if(i == 10) {
          // 结束 线程执行完成之后会自动销毁
            [NSThread exit];
        }
    }
}
```

其他方法

```objc
NSThread *thread = [[NSThread alloc] initWithTarget:self selector:@selector(demo:) object:@"felikslv"];
thread.name = @"thread";
thread.threadPriority = 1.0; // 取值返回 0 ～ 1， 默认是0.5
[NSThread currentThread]; // 获取当前线程
[NSThread isMainThread]; // 判断当前是不是主线程
```

内核调度算法在决定该运行哪个线程时，会把线程的优先级作为考量因素，较高优先级的线程会比较低优先级的线程具有更多的运行机会。较高优先级不保证你的线程具体执行的时间，只是相比较低优先级的线程，它更有可能被调度器选择执行而已。

### 互斥锁

多线程操作共享资源的时候，会有很大概率出现非线程安全问题。可以通过使用互斥锁`@synchronized`来实现，能有效防止因多线程抢夺资源造成的数据安全问题。线程同步，多条线程按顺序执行任务。

```objc
- (void)myMethod:(id)anObj {
    @synchronized(anObj) {
        // 在括号内 anObj 不会被其他线程改变
    }
}
```

swift 中已经移除了`@synchronized`，可以通过以下代码来实现:

```swift
func synchronized(_ lock: AnyObject, closure: ()->()) {
    objc_sync_enter(lock)
    defer { objc_sync_exit(lock) }
    closure()
}
```

#### 互斥锁原理

每一个对象(NSObject)内部都有一个锁（变量），当有线程进入 synchronized 到代码块中会先检查对象的锁是打开还是关闭状态，默认锁打开状态是 1，如果是线程执行到代码块内部会先上锁 0，如果锁被关闭，再有线程要执行代码块就先等待，直到锁打开才可以进入。

线程执行到 synchronized：

1. 检查锁状态，如果是开锁状态（1），转到 2，如果上锁（0）转到 5
2. 上锁（0）
3. 执行代码块
4. 执行完毕，开锁（1）
5. 线程等待（就绪状态）

加锁后程序执行的效率比不加锁的时候要低，因为要线程等待锁，但是锁保证了多个线程同时操作全局变量的安全性。

### 原子属性

属性中的修饰符

- nonatomic 非原子属性，非线程安全
- atomic 原子属性(线程安全)，针对多线程设计，为默认值，需要消耗大量资源

atomic 保证同一时间只有一个线程能够写入，但是同一时间多个线程都可以取值。atomic 本身就有一把锁（自旋锁）。

ios 开发建议：

- 所有属性都声明为 nonatmoic
- 尽量避免多线程抢夺同一块资源
- 尽量将加锁、资源抢夺的业务逻辑交给服务端解决，减小移动客户端的压力

#### 互斥锁和自旋锁的区别

互斥锁：

- 如果发现其他线程正在执行锁定代码，线程就会进入休眠（就绪状态），等其它线程事件片到打开锁后，线程就会被唤醒（执行）

自旋锁：

- 如果发现有其他线程正在锁定代码，线程会用死循环的方式，一直等待锁定的代码执行完成，自旋锁更适合执行不耗时的代码

## 消息循环

- Runloop 就是消息循环，每一个线程内都有一个消息循环
- 只有主线程的消息循环默认开启，子线程的消息循环默认不开启

消息循环的目的：

- 保证程序不退出
- 负责处理输入事件
- 如果没有事件发生，会让程序进入休眠状态

使用消息循环的时候必须指定两件事情：

- 输入事件：输入源/定时源

- 消息循环模式

消息循环运行在某一种消息循环模式下，输入事件必须设置消息循环的模式，并且如果想让输入事件可以在消息循环上执行，输入事件的消息循环模式必须和当前消息循环的消息循环模式一致。

```objc
@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor systemBackgroundColor];
    UITextView *textView = [[UITextView alloc]init];
    textView.text = @"..."; // 设置成一个长文本，使得textview可以滚动
    textView.font = [UIFont systemFontOfSize:12.0];
    textView.frame = CGRectMake(100, 200, 200, 100);
    [self.view addSubview:textView];
    NSTimer *timer = [NSTimer timerWithTimeInterval:1.0 target:self selector:@selector(demo) userInfo:nil repeats:YES];
     // 设置成Common模式
    [[NSRunLoop currentRunLoop]addTimer:timer forMode: NSRunLoopCommonModes];
}

- (void) demo {
    NSLog(@"hello %@", [NSRunLoop currentRunLoop].currentMode);
}

@end
```

如果这里将 runloop 的模式设置成`NSDefaultRunLoopMode`模式的话，在滚动 textview 的时候，不会输出任何信息，因为在滚动的时候，currentRunLoop 的模式为`UITrackingRunLoopMode`，与设置的模式不符。而`NSRunLoopCommonModes`模式包含了`NSDefaultRunLoopMode`和`NSDefaultRunLoopMode`。

### 子线程的消息循环

主线程的消息循环默认开启，子线程的消息循环默认不开启。

```objc
- (void) demo {
    NSLog(@"I'm running");
    // 开启子线程的消息循环
    // 如果消息循环里没有添加输入事件，消息循环会立刻退出
    [[NSRunLoop currentRunLoop]run];
    NSLog(@"end");
}

- (void) demo1 {
    NSLog(@"I'm running on runloop");
}

NSThread *thread = [[NSThread alloc]initWithTarget:self selector:@selector(demo) object:nil];
[thread start];
// 往子线程添加输入源
[self performSelector:@selector(demo1) onThread:thread withObject:nil waitUntilDone:NO];
```

## GCD

全称 Grand Central Dispatch，使用 C 语言开发，提供了非常多的强大的函数。

优势：

- GCD 是苹果公司为多核的并行运算提出的解决方案
- GCD 会自动利用更多的 CPU 内核（比如双核、四核
- GCD 会自动管理线程的生命周期（创建线程、调度任务、销毁线程

### GCD 任务和队列

#### 任务

任务就是执行操作的意思，换句话说就是你在线程中执行的那段代码。在 GCD 中是放在 block 中的。执行任务有两种方式：**『同步执行』** 和 **『异步执行』**。两者的主要区别是：**是否等待队列的任务执行结束，以及是否具备开启新线程的能力。**

- 同步执行（sync）
  - 同步添加任务到指定的队列中，在添加的任务执行结束之前，会一直等待，直到队列里面的任务完成之后再继续执行。
  - 只能在当前线程中执行任务，不具备开启新线程的能力。
- 异步执行（async）
  - 异步添加任务到指定的队列中，它不会做任何等待，可以继续执行任务。
  - 可以在新的线程中执行任务，具备开启新线程的能力。

#### 队列

这里的队列指执行任务的等待队列，即用来存放任务的队列。采用先进先出的原则。GCD 中有**『串行队列』** 和 **『并发队列』**两种队列。

**串行队列（Serial Dispatch Queue）**：

- 每次只有一个任务被执行。让任务一个接着一个地执行。（只开启一个线程，一个任务执行完毕后，再执行下一个任务）

**并发队列（Concurrent Dispatch Queue）**：

- 可以让多个任务并发（同时）执行。（可以开启多个线程，并且同时执行任务）

> 注意：**并发队列** 的并发功能只有在异步（dispatch_async）方法下才有效。

### GCD 的使用步骤

- 创建队列
- 将任务添加到队列中

#### 创建队列

```objc
// 串行队列的创建方法
dispatch_queue_t queue = dispatch_queue_create("net.bujige.testQueue", DISPATCH_QUEUE_SERIAL);
// 并发队列的创建方法
dispatch_queue_t queue = dispatch_queue_create("net.bujige.testQueue", DISPATCH_QUEUE_CONCURRENT);
```

Swift:

```swift
// 串行队列
let loaderQueue = DispatchQueue(label: "com.felikslv.resourceLoader.queue")
// 并行
let loaderQueue = DispatchQueue(label: "com.felikslv.resourceLoader.queue", attributes: .concurrent)
```

串行队列同步/异步执行

```objc
// 串行队列，同步执行，不开新线程, 任务按顺序执行
- (void) demo {
    dispatch_queue_t queue = dispatch_queue_create("felikslv.queue", DISPATCH_QUEUE_SERIAL);
    for(int i = 0; i < 10; i++) {
        dispatch_sync(queue, ^{
            NSLog(@"---> %d %@", i, [NSThread currentThread]);
        });
    }
}


// 串行队列，异步执行，开启新线程（1个），任务有序执行
- (void) demo1 {
    dispatch_queue_t queue = dispatch_queue_create("felikslv.queue", DISPATCH_QUEUE_SERIAL);
    for(int i = 0; i < 10; i++) {
        dispatch_async(queue, ^{
            NSLog(@"---> %d %@", i, [NSThread currentThread]);
        });
    }
}
```

并行队列

```objc
// 并行队列，同步执行，不开新线程, 任务按顺序执行
- (void) demo {
    dispatch_queue_t queue = dispatch_queue_create("felikslv.queue", DISPATCH_QUEUE_CONCURRENT);
    for(int i = 0; i < 10; i++) {
        dispatch_sync(queue, ^{
            NSLog(@"---> %d %@", i, [NSThread currentThread]);
        });
    }
}

// 并行队列，异步执行，开多个线程，任务无序执行
- (void) demo1 {
    dispatch_queue_t queue = dispatch_queue_create("felikslv.queue", DISPATCH_QUEUE_CONCURRENT);
    for(int i = 0; i < 10; i++) {
        dispatch_async(queue, ^{
            NSLog(@"---> %d %@", i, [NSThread currentThread]);
        });
    }
}
```

#### 主队列

- 对于串行队列，GCD 默认提供了：『主队列（Main Dispatch Queue）』
  - 所有放在主队列中的任务，都会放到主线程中执行。
  - 可使用 `dispatch_get_main_queue()` 方法获得主队列。

主队列异步执行时，没有开启新线程，任务按顺序执行。先执行完主线程上的任务，才会执行主队列中的任务

```objc
- (void) demo {
    for(int i = 0; i < 10; i++) {
        NSLog(@"start");
        dispatch_async(dispatch_get_main_queue(), ^{
            NSLog(@"---> %d %@", i, [NSThread currentThread]);
        });
        NSLog(@"end");
    }
}
// ...
// 2022-04-19 17:44:13.421045+0800 geektime[44817:765851] start
// 2022-04-19 17:44:13.421261+0800 geektime[44817:765851] end
// 2022-04-19 17:44:13.479135+0800 geektime[44817:765851] ---> 0 <_NSMainThread: 0x6000031801c0>{number = 1, name = main}
// ...
```

**『主线程』** 中调用 **『主队列』+『同步执行』** 会导致死锁问题。这是因为 **主队列中追加的同步任务** 和 **主线程本身的任务** 两者之间相互等待，阻塞了 **『主队列』**，最终造成了主队列所在的线程（主线程）死锁问题。可以放到子线程中，这样就不会发生死锁。代码如下：

```objc
- (void) demo1 {
    dispatch_async(dispatch_get_global_queue(0, 0), ^{
        for(int i = 0; i < 10; i++) {
          // 添加任务在子线程上完成的
            dispatch_sync(dispatch_get_main_queue(), ^{
                NSLog(@"---> %d %@", i, [NSThread currentThread]);
            });
        }
    });
}
```

#### 全局并发队列

对于并发队列，GCD 默认提供了 **『全局并发队列（Global Dispatch Queue）』**。

- 可以使用 `dispatch_get_global_queue` 方法来获取全局并发队列。需要传入两个参数。第一个参数表示队列优先级，一般用 `DISPATCH_QUEUE_PRIORITY_DEFAULT`。第二个参数暂时没用，用 `0` 即可。

```objc
// 全局并发队列的获取方法
dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
```

### Barrier 阻塞

主要用于在多个异步操作完成之后，统一对非线程安全的对象进行更新

```objc
/**
 * 栅栏方法 dispatch_barrier_async
 */
- (void)barrier {
    dispatch_queue_t queue = dispatch_queue_create("net.bujige.testQueue", DISPATCH_QUEUE_CONCURRENT);

    dispatch_async(queue, ^{
        // 追加任务 1
        [NSThread sleepForTimeInterval:2];              // 模拟耗时操作
        NSLog(@"1---%@",[NSThread currentThread]);      // 打印当前线程
    });
    dispatch_async(queue, ^{
        // 追加任务 2
        [NSThread sleepForTimeInterval:2];              // 模拟耗时操作
        NSLog(@"2---%@",[NSThread currentThread]);      // 打印当前线程
    });

    dispatch_barrier_async(queue, ^{
        // 追加任务 barrier
        [NSThread sleepForTimeInterval:2];              // 模拟耗时操作
        NSLog(@"barrier---%@",[NSThread currentThread]);// 打印当前线程
    });

    dispatch_async(queue, ^{
        // 追加任务 3
        [NSThread sleepForTimeInterval:2];              // 模拟耗时操作
        NSLog(@"3---%@",[NSThread currentThread]);      // 打印当前线程
    });
    dispatch_async(queue, ^{
        // 追加任务 4
        [NSThread sleepForTimeInterval:2];              // 模拟耗时操作
        NSLog(@"4---%@",[NSThread currentThread]);      // 打印当前线程
    });
}
```

### 延迟操作

`dispatch_after` 方法并不是在指定时间之后才开始执行处理，而是在指定时间之后将任务追加到主队列中。严格来说，这个时间并不是绝对准确的，但想要大致延迟执行任务，`dispatch_after` 方法是很有效的。

```objc
/**
 * 延时执行方法 dispatch_after
 */
- (void)after {
    NSLog(@"currentThread---%@",[NSThread currentThread]);  // 打印当前线程
    NSLog(@"asyncMain---begin");

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        // 2.0 秒后异步追加任务代码到主队列，并开始执行
        NSLog(@"after---%@",[NSThread currentThread]);  // 打印当前线程
    });
}
```

### 一次性代码

使用 `dispatch_once` 方法能保证某段代码在程序运行过程中只被执行 1 次，并且即使在多线程的环境下，`dispatch_once` 也可以保证线程安全。常用于创建单例。

```objc
/**
 * 一次性代码（只执行一次）dispatch_once
 */
- (void)once {
  // typedef long dispatch_once_t，默认是0
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        // 只执行 1 次的代码（这里面默认是线程安全的）
    });
}
```

原理：判断静态全局变量的值，默认是 0，执行完成后，设置成-1，once 内部会判断，是 0 才会执行。

可以使用`dispatch_once`来创建单例。

```objc
+(instancetype)sharePerson{
    static Person *p = nil ;//1.声明一个空的静态的单例对象
    static dispatch_once_t onceToken; //2.声明一个静态的gcd的单次任务
    dispatch_once(&onceToken, ^{ //3.执行gcd单次任务：对对象进行初始化
        if (p == nil) {
            p = [[Person alloc]init];
        }
    });
    return p;
}
```

### 快速迭代

- 通常我们会用 for 循环遍历，但是 GCD 给我们提供了快速迭代的方法 `dispatch_apply`。`dispatch_apply` 按照指定的次数将指定的任务追加到指定的队列中，并等待全部队列执行结束。

如果是在串行队列中使用 `dispatch_apply`，那么就和 for 循环一样，按顺序同步执行。但是这样就体现不出快速迭代的意义了。

我们可以利用并发队列进行异步执行。比如说遍历 0~5 这 6 个数字，for 循环的做法是每次取出一个元素，逐个遍历。`dispatch_apply` 可以 在多个线程中同时（异步）遍历多个数字。

还有一点，无论是在串行队列，还是并发队列中，dispatch_apply 都会等待全部任务执行完毕，这点就像是同步操作，也像是队列组中的 `dispatch_group_wait`方法。

```objc
- (void)apply {
    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);

    NSLog(@"apply---begin");
    dispatch_apply(6, queue, ^(size_t index) {
        NSLog(@"%zd---%@",index, [NSThread currentThread]);
    });
    NSLog(@"apply---end");
}
```

因为是在并发队列中异步执行任务，所以各个任务的执行时间长短不定，最后结束顺序也不定。但是 `apply---end` 一定在最后执行。这是因为 `dispatch_apply` 方法会等待全部任务执行完毕。

### 调度组

有时候需要在多个异步任务都执行完成之后继续做某些事情，比如下载歌曲，等所有歌曲都下载完毕之后，转到主线程提醒用户。

- 调用队列组的 `dispatch_group_async` 先把任务放到队列中，然后将队列放入队列组中。或者使用队列组的 `dispatch_group_enter`、`dispatch_group_leave` 组合来实现 `dispatch_group_async`。

- 调用队列组的 `dispatch_group_notify` 回到指定线程执行任务。或者使用 `dispatch_group_wait` 回到当前线程继续向下执行（会阻塞当前线程）。

#### dispatch_group_notify

```objc
/**
 * 队列组 dispatch_group_notify
 */
- (void)groupNotify {
    NSLog(@"currentThread---%@",[NSThread currentThread]);  // 打印当前线程
    NSLog(@"group---begin");

    dispatch_group_t group =  dispatch_group_create();

    dispatch_group_async(group, dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        // 追加任务 1
        [NSThread sleepForTimeInterval:2];              // 模拟耗时操作
        NSLog(@"1---%@",[NSThread currentThread]);      // 打印当前线程
    });

    dispatch_group_async(group, dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        // 追加任务 2
        [NSThread sleepForTimeInterval:2];              // 模拟耗时操作
        NSLog(@"2---%@",[NSThread currentThread]);      // 打印当前线程
    });

    dispatch_group_notify(group, dispatch_get_main_queue(), ^{
        // 等前面的异步任务 1、任务 2 都执行完毕后，回到主线程执行下边任务
        [NSThread sleepForTimeInterval:2];              // 模拟耗时操作
        NSLog(@"3---%@",[NSThread currentThread]);      // 打印当前线程

        NSLog(@"group---end");
    });
}
```

当所有任务都执行完成之后，才会执行`dispatch_group_notify`相关 block 中的任务。

#### dispatch_group_wait

- 暂停当前线程（阻塞当前线程），等待指定的 group 中的任务执行完成后，才会往下继续执行。

```objc
/**
 * 队列组 dispatch_group_wait
 */
- (void)groupWait {
    NSLog(@"currentThread---%@",[NSThread currentThread]);  // 打印当前线程
    NSLog(@"group---begin");

    dispatch_group_t group =  dispatch_group_create();

    dispatch_group_async(group, dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        // 追加任务 1
        [NSThread sleepForTimeInterval:2];              // 模拟耗时操作
        NSLog(@"1---%@",[NSThread currentThread]);      // 打印当前线程
    });

    dispatch_group_async(group, dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        // 追加任务 2
        [NSThread sleepForTimeInterval:2];              // 模拟耗时操作
        NSLog(@"2---%@",[NSThread currentThread]);      // 打印当前线程
    });

    // 等待上面的任务全部完成后，会往下继续执行（会阻塞当前线程）
    dispatch_group_wait(group, DISPATCH_TIME_FOREVER);

    NSLog(@"group---end");

}
```

从`dispatch_group_wait`相关代码运行输出结果可以看出：当所有任务执行完成之后，才执行 `dispatch_group_wait`之后的操作。但是，使用`dispatch_group_wait`会阻塞当前线程。

#### dispatch_group_enter、dispatch_group_leave

- `dispatch_group_enter` 标志着一个任务追加到 group，执行一次，相当于 group 中未执行完毕任务数 +1

- `dispatch_group_leave` 标志着一个任务离开了 group，执行一次，相当于 group 中未执行完毕任务数 -1。

- 当 group 中未执行完毕任务数为0的时候，才会使 `dispatch_group_wait` 解除阻塞，以及执行追加到 `dispatch_group_notify` 中的任务。

```objc
/**
 * 队列组 dispatch_group_enter、dispatch_group_leave
 */
- (void)groupEnterAndLeave {
    NSLog(@"currentThread---%@",[NSThread currentThread]);  // 打印当前线程
    NSLog(@"group---begin");
    
    dispatch_group_t group = dispatch_group_create();
    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    dispatch_group_enter(group);
    dispatch_async(queue, ^{
        // 追加任务 1
        [NSThread sleepForTimeInterval:2];              // 模拟耗时操作
        NSLog(@"1---%@",[NSThread currentThread]);      // 打印当前线程

        dispatch_group_leave(group);
    });
    
    dispatch_group_enter(group);
    dispatch_async(queue, ^{
        // 追加任务 2
        [NSThread sleepForTimeInterval:2];              // 模拟耗时操作
        NSLog(@"2---%@",[NSThread currentThread]);      // 打印当前线程
        
        dispatch_group_leave(group);
    });
    
    dispatch_group_notify(group, dispatch_get_main_queue(), ^{
        // 等前面的异步操作都执行完毕后，回到主线程.
        [NSThread sleepForTimeInterval:2];              // 模拟耗时操作
        NSLog(@"3---%@",[NSThread currentThread]);      // 打印当前线程
    
        NSLog(@"group---end");
    });
}
```

从 `dispatch_group_enter、dispatch_group_leave` 相关代码运行结果中可以看出：当所有任务执行完成之后，才执行 `dispatch_group_notify` 中的任务。这里的`dispatch_group_enter`、`dispatch_group_leave` 组合，其实等同于`dispatch_group_async`。

## NSOperation

- 是OC语言基于GCD的面向对象的封装
- 使用起来比GCD更加简单
- 提供了一些GCD不好实现的功能
- 苹果推荐使用，使用NSOperation不用关心线程以及线程的生命周期

NSOperation是一个抽象类，提供了NSInvocationOperation和NSBlockOperation两个子类。

使用NSOperation和NSOperationQueue实现多线程的具体步骤：

1. 先将需要执行的操作封装到一个NSOperation对象中。
2. 然后将NSOperation对象添加到NSOperationQueue中
3. 系统会自动将NSOperationQueue中的NSOperation取出来
4. 将取出的NSOperation封装的操作放到一条新线程中执行

```objc
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    NSInvocationOperation *op = [[NSInvocationOperation alloc]initWithTarget:self selector:@selector(demo) object:nil];
    NSLog(@"%d", op.isFinished);
    // start方法更新操作的状态，调用main方法
    // 不会开启新线程
    [op start];
}

- (void) demo {
    NSLog(@"%@",[NSThread currentThread]);
}
```

添加队列的方式

```objc
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    NSInvocationOperation *op = [[NSInvocationOperation alloc]initWithTarget:self selector:@selector(demo) object:nil];
    NSOperationQueue *queue = [[NSOperationQueue alloc]init];
    [queue addOperation:op];
}

- (void) demo {
    // 2022-06-20 22:58:56.865857+0800 geektime[31610:2682704] <NSThread: 0x60000047af40>{number = 7, name = (null)}
    NSLog(@"%@",[NSThread currentThread]);
}
```

NSOperation可以调用start方法来执行任务，但默认是同步执行的。如果将NSOperation添加到NSOperationQueue（操作队列）中，系统会自动异步执行NSOperation中的操作。

### NSBlockOperation

```objc
- (void)demo1 {
    NSOperationQueue *queue = [[NSOperationQueue alloc]init];
    NSBlockOperation *op = [NSBlockOperation blockOperationWithBlock:^{
        NSLog(@"hello %@", [NSThread currentThread]);
    }];
    [queue addOperation:op];
}
```

也可以直接向队列中添加闭包

```objc
- (void)demo2 {
    NSOperationQueue *queue = [[NSOperationQueue alloc]init];
    [queue addOperationWithBlock:^{
        NSLog(@"hello %@", [NSThread currentThread]);
    }];
}
```

也可以设置完成闭包`completionBlock`，或使用`addExecutionBlock`方法继续添加block到列表中。

```objc
- (void)demo1 {
    NSOperationQueue *queue = [[NSOperationQueue alloc]init];
    NSBlockOperation *op = [NSBlockOperation blockOperationWithBlock:^{
        NSLog(@"hello %@", [NSThread currentThread]);
    }];
    [op addExecutionBlock:^{
        NSLog(@"task 1");
    }];
    [op setCompletionBlock:^{
        NSLog(@"finished");
    }];
    [queue addOperation:op];
}
```

### 线程间通信

```objc
[self.queue addOperationWithBlock:^{
        NSLog(@"异步下载图片");
        // 线程间通信，回到主线程更新UI
        [[NSOperationQueue mainQueue]addOperationWithBlock:^{
            NSLog(@"%@ 更新UI", [NSOperationQueue currentQueue]);
        }];
    }];
```

### 最大并发数

```objc
- (NSOperationQueue*) queue {
    if(_queue == nil) {
        _queue = [[NSOperationQueue alloc]init];
        // 设置最大并发数
        _queue.maxConcurrentOperationCount = 2;
    }
    return _queue;
}
```

### 队列的暂停、取消、恢复

- 取消队列的所有操作`cancelAllOperations`，也可以使用NSOperation的cancel方法取消单个操作。
- 暂停和恢复，`setSuspended`和`isSuspended`

```objc
#import "ViewController.h"

@interface ViewController ()
@property (nonatomic, strong) NSOperationQueue *queue;
@end

@implementation ViewController

- (NSOperationQueue*) queue {
    if(_queue == nil) {
        _queue = [[NSOperationQueue alloc]init];
        // 设置最大并发数
        _queue.maxConcurrentOperationCount = 2;
    }
    return _queue;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.title = @"Home";
    self.view.backgroundColor = [UIColor systemBackgroundColor];
    [self.navigationController.navigationBar setPrefersLargeTitles:true];
    
    for(int i = 0; i < 20; i++) {
        [[self queue]addOperationWithBlock:^{
            [NSThread sleepForTimeInterval:2.0];
            NSLog(@"%@", [NSThread currentThread]);
        }];
    }
}

// 取消所有操作，当前正在执行的操作会执行完毕，取消后续的所有操作
- (IBAction)cancel:(UIButton *)sender {
    [self.queue cancelAllOperations];
    NSLog(@"取消");
}

// 暂停操作 当前正在执行的操作，会执行完毕，后续的操作会暂停
- (IBAction)suspend:(UIButton *)sender {
    self.queue.suspended = YES;
    NSLog(@"暂停");
}

// 继续操作
- (IBAction)resume:(UIButton *)sender {
    self.queue.suspended = NO;
    NSLog(@"继续");
}

// 当操作执行完毕，会从队列中移除
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    // 队列中的操作数
    NSLog(@"%zd", self.queue.operationCount);
}

@end
```

### 操作的优先级

设置NSOperation在queue中的优先级，可以改变操作的执行优先级。

```objc
    NSBlockOperation *op1 = [NSBlockOperation blockOperationWithBlock:^{
        for(int i = 0;i < 10; i++) {
            NSLog(@"op1 %d", i);
        }
    }];
    // 设置高优先级
    op1.qualityOfService = NSQualityOfServiceUserInteractive;
    [self.queue addOperation:op1];
    
    NSBlockOperation *op2 = [NSBlockOperation blockOperationWithBlock:^{
        for(int i = 0;i < 10; i++) {
            NSLog(@"op2 %d", i);
        }
    }];
    // 低优先级
    op2.qualityOfService = NSQualityOfServiceBackground;
    [self.queue addOperation:op2];
```

先执行op1，再执行op2，只能保证op1执行的概率更大，但不能保证op1执行完再执行op2

### 操作依赖

NSOperation之间可以设置依赖来保证执行顺序，比如一定要让操作A执行完之后，才能执行操作B

```objc
[operationB addDependency:operationA]; // 操作B依赖于A
```

可以在不同的queue的NSOperation之间创建依赖关系，可以用于模拟软件升级的过程：下载-解压-升级完成

```objc
    NSBlockOperation *op1 = [NSBlockOperation blockOperationWithBlock:^{
        NSLog(@"下载");
    }];
    NSBlockOperation *op2 = [NSBlockOperation blockOperationWithBlock:^{
        NSLog(@"解压");
    }];
    NSBlockOperation *op3 = [NSBlockOperation blockOperationWithBlock:^{
        NSLog(@"升级完成");
    }];
    [op2 addDependency:op1];
    [op3 addDependency:op2];
    
    [self.queue addOperations:@[op1,op2] waitUntilFinished:NO];
    // 依赖关系可以跨队列执行
    [[NSOperationQueue mainQueue]addOperation:op3];
```

在使用依赖时要避免出现循环依赖的情况，此外，依赖关系是可以跨队列执行的。

### GCD和NSOperation的区别

1. GCD是一种轻量级的方法来实现多线程。控制起来比较麻烦，比如取消和暂停一个线程。
2. NSOperation和NSOperationQueue相对于GCD效率上要低一点，他们是面向对象的方式，从Mac OS X v10.6和iOS4开始，NSOperation底层也是用的GCD来实现的。可以在多个操作中添加附属，也可以重用操作，取消或者暂停。NSOperation和KVO是兼容，也就是说，可以在NSOperation中使用KVO，例如，你可以通过NSNotificationCenter去让一个操作开始执行。
3. NSOperation的使用方法
   【1】、继承NSOperation类
   【2】、重写“main”方法
   【3】、在“main”方法中创建一个autoreleasepool
   【4】、将自己的代码放在autoreleasepool中
   注意：创建自动释放池的原因是，你不能访问主线程的自动释放池，所以需要自己创建一个。

4. NSOperation的常用方法
   - start：开始方法，当把NSOperation添加到NSOperationQueue中去后，队列会在操作中调用start方法。
   - addDependency，removeDependency：添加从属性，删除从属性，比如说有线程a，b，如果操作a从属于b，那么a会等到b结束后才开始执行。
   - setQueuePriority：设置线程的优先级。例：[a setQueuePriority:NSOperationQueuePriorityVeryLow];一共有四个优先级：NSOperationQueuePriorityLow，NSOperationQueuePriorityNormal，NSOperationQueuePriorityHigh，NSOperationQueuePriorityVeryHigh。
     当你添加一个操作到一个队列时，在对操作调用start之前，NSOperationQueue会浏览所有的操作，具有较高优先级的操作会优先执行，具有相同优先级的操作会按照添加到队列中顺序执行。
   - setCompletionBlock：设置回调方法，当操作结束后，会调用设置的回调block。这个block会在主线程中执行。

什么时候使用GCD？什么时候使用NSOperation？

项目中使用NSOperation的优点是NSOperation是对线程的高度抽象，在项目中使用它，会使项目的程序结构更好，子类化NSOperation的设计思路，是具有面向对象的优点(复用，封装)，使得实现是多线程支持，而接口简单，建议在复杂的项目中使用。

项目中使用GCD的优点是GCD本身比NSOperation简单、易用，对于不复杂的多线程操作，会节省代码量，而Block参数的使用，会使代码更为易读，建议在简单的项目中使用
