---
title: 深入理解计算机系统
date: 2022-05-23
categories:
  - 公共基础
---

## 计算机系统漫游

```shell
gcc hello.c -o hello
```

流程如下：

1. 预处理 hello.c --> hello.i (文本文件)
2. 编译 hello.i --> hello.s
3. 汇编 hello.s --> hello.o 汇编器根据指令集将汇编程序翻译成机器指令，并将机器指令按照固定的规则进行打包，得到可重定位目标文件。
4. 链接 hello.o+printf.o --> hello 可执行文件

### 计算机硬件组成

PC（Program Count）大小为1个字的存储区域，存放某一条指令的地址。从系统上电开始，直到系统断电，处理器就在不断执行PC指向的指令，然后更新PC，使其指向下一条要执行的指令。

寄存器文件（Register file）是CPU内部的一个存储设备，由一些单字长的寄存器构成，每个寄存器都有自己唯一的名字。寄存器可以理解成一个临时存放数据的空间。例如我们计算两个变量a+b的和，处理器从内存中读取a的值暂存在寄存器x中，读取b的值暂存在寄存器y中，这个操作会覆盖寄存器原来的数值，处理器完成加载之后，ALU(Arithmatic/logic Unit)会复制寄存器x和y中保存的数值。然后进行算数运算，得到的结果会保存在寄存器x或者y中。

处理器在执行程序的时候，内存主要存放程序指令以及数据。内存和处理器之间通过总线来进行数据传递。总线负责将信息从一个部件传递到另一个部件。通常总线被设计成传送固定长度的字节块，也就是字(word)。此外还有各种输入输出设备，每一个输入输出设备都通过一个控制器或者适配器与IO总线相连。

## 信息的表示和处理

### 信息的存储

#### 字数据大小

通常情况下，程序将内存视为一个非常大的数组，数组的元素是由一个个的字节组成的，每个字节都由一个唯一的数字来表示，我们称之为地址。这些所有地址的集合就称为虚拟地址空间。

每台机器都有一个字长。指明指针数据的标称大小。字长决定的最重要的系统参数就是虚拟地址空间的最大大小。对于一个字长尾 w 位的机器而言，虚拟地址的范围为 0 ～ 2^w-1。

32 位字长限制虚拟地址空间为 4GB，扩展到 64 位字长，虚拟地址空间为 16EB。

| 类型                 | 字节数/64位 |
| -------------------- | ----------- |
| char/unsigned char   | 1           |
| short/unsigned short | 2           |
| int/unsigned         | 4           |
| long/unsigned long   | 8           |
| int32_t/uint32_t     | 4           |
| int64_t/uint64_t     | 8           |
| char *               | 8           |
| float                | 4           |
| double               | 8           |

#### 寻地和字节顺序

排列一个对象的字节有两个通用规则，最低有效字节在最前面的方式称为`小端法`，同理，最高有效字节在最前面的为`大端法`。对于16进制数0x123456，它的最低有效字节为0x56，最高有效字节为0x12。可以使用以下代码进行验证。

```c
typedef unsigned char *byte_pointer;

void show_bytes(byte_pointer start, int len)
{
  for (int i = 0; i < len; i++)
  {
    printf("%.2x ", start[i]);
  }
  printf("\n");
}

void show_int(int val) { show_bytes((byte_pointer)&val, sizeof(int)); }

void show_float(float val) { show_bytes((byte_pointer)&val, sizeof(float)); }

void show_pointer(void *x) { show_bytes((byte_pointer)&x, sizeof(void *)); }

int main()
{
  int x = 0x123456;
  unsigned int y = (unsigned int)x;
  show_bytes((byte_pointer)&x, sizeof(int));
  show_pointer(&x);
}
```

对于字符串，使用ASCII码来表示字符，在任何系统上都会得到相同的结果。

```c
show_bytes((byte_pointer)str, strlen(str));
```

左移和右移，左移没什么问题，主要是右移，右移分为逻辑右移和算数右移。逻辑右移会在左侧补0，而算数右移是补符号位。几乎所有的编译器都是算数右移。

对于一个由w位组成的数据类型，如果要移动k>=w位，移位指令只考虑位移量的低log2w位，因此实际上上的位移量是通过计算k mod w得到的。

### 整数的表示

#### 无符号数的编码

$$
\overleftarrow{x} = [x_{w-1}, x_{w-2}, ..., x_0]
$$

$$
B2U_w(\overrightarrow{x}) = \sum_{i=0}^{w-1}x_i2^i
$$

#### 补码编码

最常见的有符号数的计算机表示方式就是补码。在这个定义中，将字的最高有效位解释为负权。对于向量
$$
\overleftarrow{x} = [x_{w-1}, x_{w-2}, ..., x_0]
$$

$$
B2T_w(\overrightarrow{x}) = -x_{w-1}2^{w-1}+\sum_{i=0}^{w-2}x_i2^i
$$

最高有效位xw-1也称为符号位，它的权重为-2w-1，是无符号表示中权重的负数。符号位为1，表示值为负。
$$
TMax_w = \sum_{i=0}^{w-2}x_i2^i = 2^{w-1}-1
$$
-1的补码和无符号数的最大值有着相同的二进制表示。

```c
int main()
{
  // mac 小端法
  short x = 12345;
  short mx = -x;
  // 39 30 ==> 0x3039 ==> 0011 0000 0011 1001
  show_bytes((byte_pointer)&x, sizeof(short));
  // c7 cf ==> 0xcfc7 ==> 1100 1111 1100 0111
  show_bytes((byte_pointer)&mx, sizeof(short));
}
```

#### 有符号数和无符号数之间的转换

```c
short a = -12345;
unsigned short ua = (unsigned short)a;
printf("%u\n", ua); //53191
```

C语言处理同字长的有符号数和无符号数之间相互转换的一般规则是：数值可能会改变，但是位模式不变。
$$
T2U_w(x)= \begin{cases}
x+2^w, & x < 0 \\
x, & x \geq 0 \\
\end{cases}
$$

$$
U2T_w(u)= \begin{cases}
u, & u \leq TMax_w \\
u - 2^w, & u > TMax_w \\
\end{cases}
$$

在C语言中，如果两个运算数一个是有符号数，一个是无符号数，那么C语言会隐式的将有符号数强制转换成无符号数来执行运算。

```c
int main()
{
  int a = -1;
  unsigned int b = 0;
  if (a < b) // 2^32 - 1 > 0
    printf("-1 < 0\n");
  else
    printf("-1 > 0\n");
}
```

#### 扩展数位

要将一个无符号数扩展成一个更大的数据类型，我们只要简单的在前面添加0，这种运算叫做`零扩展`。

对于有符号数的扩展，采用符号位扩展，通过在前面添加符号位即可保持数值不变。

#### 截断数字

```c
int x = 53191;
short sx = (short) x; // -12345
int y = sx; // -12345
```

无符号数截断，相当于对2的k次方取余
$$
B2U_w([x_{w-1},x_{w-2},...,x_0]) \mod 2^k = B2U_k([x_{k-1},x_{k-2},...,x_0]) 
$$
有符号数截断，先使用无符号数相同的截断方式，得到最低k位，再将无符号数转换成有符号数。
$$
B2T_k([x_{k-1},x_{k-2},...,x_0])=U2T_w(B2U_w([x_{w-1},x_{w-2},...,x_0])\mod 2^k)
$$

```c
short int a = -12345;
unsigned short b = (unsigned short) a;
printf("a = %d, b = %u",a,b);
// a = -12345, b = 53191
```

### 整数运算

#### 无符号加法

```c
unsigned char a = 255;
unsigned char b = 1;
unsigned char c = a + b;
printf("c=%d\n", c); // 0
```

$$
x+^u_wy = \begin{cases}
x+y, & x+y < 2^w \qquad 正常\\
x+y - 2^w, & 2^w \leq x+y < 2^{w+1} \quad 溢出\\
\end{cases}
$$

检测无符号加法溢出

```c
int uadd_ok(unsigned x, unsigned y) {
  unsigned sum = x + y;
  return sum >= x;
}
```

#### 有符号数加法

