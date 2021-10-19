---
title: Android文件存储
date: 2021-10-17
categories:
 - 客户端
tags:
 - Android
---

在android里头，可以分为内部存储和外部存储。外部存储也就是SD卡存储，或者说是扩展卡存储，而内部存储的则是/data/data/包名/files、caches、databases、shared_prefs，它们用于存储文件，存储缓存，存储数据库，也用于存储设置的内容，也就是偏好。

## 内部存储

```kotlin
val file = File(this.filesDir, "info.txt") // 获取系统 files 文件夹路径
if (file.exists()) {
    println(file.readLines().joinToString(" "))
}
file.writeText("Text")

val file = File(this.cacheDir, "info.txt") // 获取缓存文件夹
```

## SD卡

获取SD卡路径

```kotlin
val externalStorage = this.getExternalFilesDir(null)
// /storage/emulated/0/Android/data/com.felikslv.myapplication/files
```

判断SD卡是否已经挂载

```kotlin
val state = Environment.getExternalStorageState()
if (state == Environment.MEDIA_MOUNTED) {
	Log.d("test", "SD卡已经挂载,也就是可用的!")
} else if (state == Environment.MEDIA_UNMOUNTED) {
	Log.d("test", "SD卡已经删除了...")
}
```

去获取SD卡相关的信息，比如：可用空间。

```kotlin
val externalStorage = this.getExternalFilesDir(null)
val freeSpace = externalStorage?.freeSpace ?: 0L
val size: String = Formatter.formatFileSize(this, freeSpace)
println(size)
```

## SharedPreferences

