---
title: POSIX多线程API使用
date: 2023-01-14
publish: false
categories:
  - 公共基础
---

## 线程的创建

在 POSIX API 中，创建线程的函数式 pthread_create。

```c
int pthread_create(pthread_t *pid, const pthread_attr_t *attr,void￼ *(*start_routine)(void *),void *arg);
```

- pid 指针，指向创建成功后的线程 id，pthread_t 其实就是 unsigned long int
- attr 线程属性结构 pthread_attr_t 的指针，为 NULL 时使用默认属性
- start_routine 指向线程函数的地址，线程函数就是线程创建后要执行的函数
- arg 指向传给线程函数的参数

如果创建成功，函数会返回 0。

通常我们都希望主线程在子线程任务执行完成后再退出，这就需要我们在主线程等待子线程的运行，POSIX 提供了函数`pthread_join`来等待子线程结束。子线程的线程函数执行完毕后，pthread_join 才返回，因此 pthread_join 是个阻塞函数。函数 pthread_join 会让主线程挂起（即休眠，让出 CPU），直到子线程都退出，同时 pthread_join 能让子线程所占资源得到释放。子线程退出后，主线程会接收到系统的信号，从休眠中恢复。

```c
int pthread_join(pthread_t pid, void **value_ptr);
```

- Pid, 所等待的线程的 id
- value_ptr 如果不为 NULL，该函数会复制一份线程退出值到一个内存区域，并让 value_ptr 指向该内存区域

可以使用 pthread_join 函数能获得子线程的返回值。函数成功会返回 0，否则返回错误码。下面看一个 demo，传递结构体参数给线程函数。

```cpp
#include <iostream>
#include <pthread.h>

using namespace std;

typedef struct {
    int n;
    char *str;
}MyStruct;

int main() {
    printf("Hello World\n");

    MyStruct myStruct;
    myStruct.n = 100;
    myStruct.str = (char *)"ok";

    pthread_t thread;
    int error;

    auto testFunc = [](void *arg) {
        auto param = (MyStruct *)arg;
        cout << "testFunc : n = " << param->n << " str = " << param->str << endl;
        return (void *)nullptr;
    };

    error = pthread_create(&thread, nullptr, testFunc, (void *)&myStruct);

    if (error) {
        printf("thread create failed\n");
        return -1;
    }

    pthread_join(thread, nullptr);
    printf("main thread finished\n");

    return 0;
}
```

## 线程的属性

POSIX 标准的线程主要属性：

- 分离状态（Detached State）
- 调度策略和参数（Scheduling Policy and Parameters）
- 作用域（Scope）
- 栈尺寸（Stack Size）
- 栈地址(Stack Address)
- 优先级(Priority)等

在 Linux 中，线程属性定义是一个联合体 pthread_attr_t。

```c
union pthread_attr_t
{
  char __size[__SIZEOF_PTHREAD_ATTR_T];
  long int __align;
};
```

属性值存放在数组`__size`中，需要使用函数`pthread_getattr_np`来获取。

```c
int pthread_getattr_np(pthread_t thread, pthread_attr_t *attr);​​
```

当函数 `pthread_getattr_np` 获得的属性结构体变量不再需要的时候，应该用函数 `pthread_attr_destroy` 进行销毁。

之前我们在使用`pthread_create`创建线程的时候，属性结构传的是 NULL，此时创建的线程具有默认属性，即为非分离、大小为 1MB 的堆栈，与父进程具有同样级别的优先级。如果要创建非默认属性的线程，可以在创建线程之前用函数 pthread_attr_init 来初始化一个线程属性结构体，再调用相应 API 函数来设置相应的属性，接着把属性结构体的指针作为参数传入 pthread_create。

```c
​​​​​​​int pthread_attr_init(pthread_attr_t *attr);​​
```

需要注意的是，使用 pthread_attr_init 初始化线程属性，使用完（即传入 pthread_create）后需要使用 pthread_attr_destroy 进行销毁，从而释放相关资源。函数 pthread_attr_destroy 声明如下:

```c
​​​​​​​int pthread_attr_destroy(pthread_attr_t *attr);​​
```

### 分离状态
