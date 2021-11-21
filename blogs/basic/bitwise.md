---
title: 位运算
date: 2021-11-16
publish: false
categories:
  - 公共基础
tags:
  - 算法
---

刷题的时候用到的一些位运算技巧总结

## 前置知识

`n >> k` 右移 k 位，相当于$n/2^k$
`n << k` 左移 k 位，相当于$n*2^k$
还有`&`、`|`、`~`、`^`就不赘述了

## leetcode-231 2 的幂

**方法一**

```cpp
bool isPowerOfTwo(int n) {
    return n > 0 && (1 << 30) % n == 0;
}
```

int 的范围最多是 $2^{31}-1$，所有最大的 2 的幂就是$2^{30}$，只需要将 `1 << 30` 再判断余数是否是 0 即可

**方法二**

```cpp
bool isPowerOfTwo(int n) {
    return n > 0 && (n & -n) == n;
}
```

因为在计算机当中，负数是采用它绝对值的补码来表示的，而补码是`~x+1`
`n & -n`表示 n 从低位往高位数第一个 1，只有 n 是 2 的幂的时候，`n & -n`才会等于 n

## leetcode-762
