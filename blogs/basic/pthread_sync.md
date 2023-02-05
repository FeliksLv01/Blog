---
title: 基于POSIX进行线程同步
date: 2023-01-14
publish: false
categories:
  - 公共基础
---

POSIX 提供了三种方式进行线程同步，即互斥锁、读写锁和条件变量。

## 互斥锁

互斥锁是线程同步的一种机制，用来保护多线程的共享资源。同一时刻，只允许一个线程对临界区进行访问。

互斥锁的工作流程：初始化一个互斥锁，在进入临界区之前把互斥锁加锁（防止其他线程进入临界区），退出临界区的时候把互斥锁解锁（让别的线程有机会进入临界区），最后不用互斥锁的时候就销毁它。

POSIX 库中用类型 pthread_mutex_t 来定义一个互斥锁。

### 互斥锁初始化

动态初始化使用 pthread_mutext_init 函数进行初始化。

```c
int pthread_mutex_init(pthread_mutex_t *__mutex, const pthread_mutexattr_t *__mutexattr);
```

使用动态初始化创建的互斥锁需要调用 pthread_mutex_destroy 函数进行销毁。

静态初始化使用宏 PTHREAD_MUTEX_INITIALIZER 来初始化，这是一个常量。静态初始化的互斥锁是不需要销毁的。

```c
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
```

如果 mutex 是指针，则不能用这种静态方式，因为 PTHREAD_MUTEX_INITIALIZER 相当于一组常量，它只能对 pthread_mutex_t 的变量进行赋值，而不能对指针赋值，即使这个指针已经分配了内存空间。如果要对指针进行初始化，可以用函数 pthread_mutex_init。

### 互斥锁上锁和解锁

上锁是为了防止其他线程进入临界区，解锁则允许其他线程进入临界区。用于上锁的函数是 pthread_mutex_lock 或 pthread_mutex_trylock。

```c
int pthread_mutex_lock(pthread_mutex_t *mutex);​​

​​​​​​​int pthread_mutex_trylock(pthread_mutex_t *mutex);​​
```

这两个函数的主要区别在互斥锁被其他线程上锁后，调用 pthread_mutex_lock 函数的线程会被阻塞（即让出 CPU，避免进程出现“忙等”现象）。

而调用 pthread_mutex_trylock 在调用时，如果互斥锁已经上锁了，则并不阻塞，而是直接返回，返回 EBUSY 错误码。

当线程退出临界区后，要对互斥锁进行解锁，使用 pthread_mutex_unlock 函数来实现。

```c
int pthread_mutex_unlock(pthread_mutex_t *mutex);​​
```

### 互斥锁的销毁

当互斥锁用完后，最终要销毁，用于销毁互斥锁的函数是 pthread_mutex_destroy，声明如下：

```c
​​​​​​​int pthread_mutex_destroy(pthread_mutex_t *mutex);​​
```

其中参数 mutex 是指向 pthread_mutex_t 变量的指针，它是已初始化的互斥锁。函数成功时返回 0，否则返回错误码。

### 互斥锁使用实例

```cpp
#include <iostream>
#include <pthread.h>

pthread_mutex_t mutex;
int count = 0;

int main() {

    pthread_t thread1;
    pthread_t thread2;

    pthread_mutex_init(&mutex, nullptr);

    auto threadFunc1 = [](void *arg) {
        for (int i = 0; i < 10000; ++i) {
            pthread_mutex_lock(&mutex);
            count++;
            pthread_mutex_unlock(&mutex);
        }
        return (void *)nullptr;
    };

    auto threadFunc2 = [](void *arg) {
        for (int i = 0; i < 10000; ++i) {
            pthread_mutex_lock(&mutex);
            count++;
            pthread_mutex_unlock(&mutex);
        }
        return (void *)nullptr;
    };

    for (int i = 0; i < 10; ++i) {
        int err;
        err = pthread_create(&thread1, nullptr, threadFunc1, nullptr);
        if (err != 0) {
            printf("create new thread1 error: %s\n", strerror(err));
            exit(0);
        }

        err = pthread_create(&thread2, nullptr, threadFunc2, nullptr);
        if (err != 0) {
            printf("create new thread2 error: %s\n", strerror(err));
            exit(0);
        }

        err = pthread_join(thread1, nullptr);
        if (err != 0) {
            printf("wait thread1 done error:%s\n", strerror(err));
            exit(1);
        }

        err = pthread_join(thread2, nullptr);
        if (err != 0) {
            printf("wait thread2 done error:%s\n", strerror(err));
            exit(1);
        }

        printf("count = %d\n", count);
        count = 0;
    }
    pthread_mutex_destroy(&mutex);
    return 0;
}
```

## 读写锁

互斥锁只有加锁和不加锁两种状态，线程 A 在对共享变量进行读取的时候，因为不确定是否有其他线程会对它进行写操作，会对共享变量进行加锁，如果这时 B 线程也想要读取的时候，那么它必须等待 A 线程释放锁才能获得锁并读取变量的值。但是两个读取操作即使是同时发生也并不会像写操作那样造成竞争，因为它们不修改变量的值。所以我们期望如果是多个线程试图读取共享变量的值的话，那么它们应该可以立刻获取因为读而加的锁，而不需要等待前一个线程释放。读写锁解决了上面的问题。

读写锁将资源的访问方式分为可共享的读模式和独占的写模式，这样可以大大提高并发效率，读写锁比互斥锁有更高的适用性和并行性。但是在速度上并不一定比互斥锁快，因为读写锁会更加复杂，且系统开销也更大。读写锁有以下特点：

1. 如果一个线程用读锁锁定了临界区，那么其他线程也可以用读锁来进入临界区，这样就可以有多个线程并行操作。但这个时候，如果再进行写锁加锁就会发生阻塞，写锁请求阻塞后，后面如果继续有读锁请求，这些后来的读锁都会被阻塞。这样避免了读锁长期占用资源，也避免了写锁饥饿。

2. 如果一个线程用写锁锁住了临界区，那么其他线程不管是读锁还是写锁都会发生阻塞。

### 读写锁初始化

读写锁的初始化与互斥锁基本一致，也分为动态和静态，动态初始化需要在使用完成之后调用销毁函数。

```cpp
pthread_rwlock_t rwlock = PTHREAD_RWLOCK_INITIALIZER;

pthread_rwlock_t rwlock1;
pthread_rwlock_init(&rwlock1, nullptr);
```

### 读写锁的上锁、解锁和销毁

使用基本上与互斥锁一致，lock 会阻塞，trylock 会直接返回 EBUSY 错误码。

读模式的上锁

```cpp
​​​​​​​int pthread_rwlock_rdlock(pthread_rwlock_t *rwlock);​​

​​​​​​​int pthread_rwlock_tryrdlock(pthread_rwlock_t *rwlock);​​
```

写模式上锁

```cpp
int pthread_rwlock_wrlock(pthread_rwlock_t *rwlock);​​

​​​​​​​int pthread_rwlock_trywrlock(pthread_rwlock_t *rwlock);​​
```

除了上述上锁函数外，还有两个不常用的上锁函数，它们可以设定在规定的时间内等待读写锁，如果等不到就返回 ETIMEDOUT。

```cpp
int pthread_rwlock_timedrdlock(pthread_rwlock_t *restrict rwlock, const￼struct timespec *restrict abs_timeout);

int pthread_rwlock_timedwrlock(pthread_rwlock_t *restrict rwlock, const￼struct timespec *restrict abs_timeout);​
```

当线程退出临界区后，要对读写锁进行解锁，解锁的函数是 pthread_rwlock_unlock，声明如下：

```cpp
​​​​​​​int pthread_rwlock_unlock(pthread_rwlock_t *rwlock);​​
```

销毁读写锁：

```cpp
​​​​​​​int pthread_rwlock_destroy(pthread_rwlock_t *rwlock);​​
```

## 条件变量
