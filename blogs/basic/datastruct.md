---
title: 数据结构
date: 2022-01-01
publish: false
categories:
  - 公共基础
tags:
  - 算法
---

## 数组

数组（Array）是一种线性表数据结构。它用一组连续的内存空间，来存储一组具有相同类型的数据。数组支持随机访问，根据下标随机访问的时间复杂度为 O(1)。但插入、删除操作比较低效，平均情况时间复杂度为 O(n)

当计算机需要随机访问数组中的某个元素时，它会首先通过下面的寻址公式，计算出该元素存储的内存地址：

```cpp
a[i]_address = base_address + i * data_type_size
```

使用 Java 实现的范型数组