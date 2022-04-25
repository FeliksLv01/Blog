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

- 一个程序运行后，默认会开启一个主线程，称为“主线程”或“UI线程”。
- 主线程一般用来刷新UI界面，处理UI事件（比如点击、滚动、拖拽
- 别把耗时操作放到主线程，那样会卡住主线程，影响UI流畅度

## iOS多线程技术方案

| 技术方案    | 简介                                                         | 语言 | 线程生命周期 | 使用频率 |
| ----------- | ------------------------------------------------------------ | ---- | ------------ | -------- |
| pthread     | 一套通用的多线程API，适用于Linux/Uninx/Windows等系统，跨平台、可移植，使用难度较大 | C    | 程序员管理   | 几乎不用 |
| NSThread    | 使用更加面向对象，简单易用，直接操作线程对象                 | OC   | 程序员管理   | 偶尔不用 |
| GCD         | 旨在替代NSThread等多线程技术，充分利用设备的多核             | C    | 自动管理     | 经常使用 |
| NSOperation | 基于GCD，比GCD多了一些更简单实用的功能，使用更加面向对象     | OC   | 自动管理     | 经常使用 |

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

### 传递oc字符串

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

### NSThread生命周期

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

swift中已经移除了`@synchronized`，可以通过以下代码来实现:

```swift
func synchronized(_ lock: AnyObject, closure: ()->()) {
    objc_sync_enter(lock)
    defer { objc_sync_exit(lock) }
    closure()
}
```

#### 互斥锁原理

每一个对象(NSObject)内部都有一个锁（变量），当有线程进入synchronized到代码块中会先检查对象的锁是打开还是关闭状态，默认锁打开状态是1，如果是线程执行到代码块内部会先上锁0，如果锁被关闭，再有线程要执行代码块就先等待，直到锁打开才可以进入。

线程执行到synchronized：

1. 检查锁状态，如果是开锁状态（1），转到2，如果上锁（0）转到5
2. 上锁（0）
3. 执行代码块
4. 执行完毕，开锁（1）
5. 线程等待（就绪状态）

加锁后程序执行的效率比不加锁的时候要低，因为要线程等待锁，但是锁保证了多个线程同时操作全局变量的安全性。

### 原子属性

属性中的修饰符

- nonatomic 非原子属性，非线程安全
- atomic 原子属性(线程安全)，针对多线程设计，为默认值，需要消耗大量资源

atomic保证同一时间只有一个线程能够写入，但是同一时间多个线程都可以取值。atomic本身就有一把锁（自旋锁）。

ios开发建议：

- 所有属性都声明为nonatmoic
- 尽量避免多线程抢夺同一块资源
- 尽量将加锁、资源抢夺的业务逻辑交给服务端解决，减小移动客户端的压力

#### 互斥锁和自旋锁的区别

互斥锁：

- 如果发现其他线程正在执行锁定代码，线程就会进入休眠（就绪状态），等其它线程事件片到打开锁后，线程就会被唤醒（执行）

自旋锁：

- 如果发现有其他线程正在锁定代码，线程会用死循环的方式，一直等待锁定的代码执行完成，自旋锁更适合执行不耗时的代码

## 消息循环

- Runloop就是消息循环，每一个线程内都有一个消息循环
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

如果这里将runloop的模式设置成`NSDefaultRunLoopMode`模式的话，在滚动textview的时候，不会输出任何信息，因为在滚动的时候，currentRunLoop的模式为`UITrackingRunLoopMode`，与设置的模式不符。而`NSRunLoopCommonModes`模式包含了`NSDefaultRunLoopMode`和`NSDefaultRunLoopMode`。

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

全称Grand Central Dispatch，使用C语言开发，提供了非常多的强大的函数。

优势：

- GCD是苹果公司为多核的并行运算提出的解决方案
- GCD会自动利用更多的CPU内核（比如双核、四核
- GCD会自动管理线程的生命周期（创建线程、调度任务、销毁线程

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

这里的队列指执行任务的等待队列，即用来存放任务的队列。采用先进先出的原则。GCD中有**『串行队列』** 和 **『并发队列』**两种队列。

**串行队列（Serial Dispatch Queue）**：

- 每次只有一个任务被执行。让任务一个接着一个地执行。（只开启一个线程，一个任务执行完毕后，再执行下一个任务）

**并发队列（Concurrent Dispatch Queue）**：

- 可以让多个任务并发（同时）执行。（可以开启多个线程，并且同时执行任务）

> 注意：**并发队列** 的并发功能只有在异步（dispatch_async）方法下才有效。

### GCD的使用步骤

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

### Barrier阻塞

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

原理：判断静态全局变量的值，默认是0，执行完成后，设置成-1，once内部会判断，是0才会执行。
