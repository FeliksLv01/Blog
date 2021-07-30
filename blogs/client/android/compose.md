---
title: JetPack Compose入门
date: 2021-05-15
categories:
 - 客户端
tags:
 - Android
 - JetPack Compose
---

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width="100%" height=86 src="//music.163.com/outchain/player?type=2&id=1357774614&auto=0&height=66"></iframe>

## 相关资源

- [入门路线](https://developer.android.google.cn/courses/pathways/compose)
- [视频资料](https://list.youku.com/albumlist/show/id_59672719)
- [CodeLab](https://developersummit.googlecnapps.cn/)
- [中文文档](https://docs.compose.net.cn/)

## 使用Compose写一个计数器Demo

Flutter的默认demo就是一个计数器，下面使用Compose实现一个这个效果。

### 编写AppBar

文档中关于Title的描述如下：
>This TopAppBar has slots for a title, navigation icon, and actions. Note that the title slot is inset from the start according to spec - for custom use cases such as horizontally centering the title, use the other TopAppBar overload for a generic TopAppBar with no restriction on content.

可以通过将`Text`的`modifier`需要设置成`Modifier.fillMaxWidth()`，来实现居中效果。

```kotlin
@Composable
fun AppBar() {
    TopAppBar(
        title = {
            Text(
                modifier = Modifier.fillMaxWidth(),
                text = "Compose Demo",
                color = Color.Black,
                textAlign = TextAlign.Center
            )
        },
        backgroundColor = Color.White,
    )
}
```

### 编写页面Body

```kotlin
@Composable
fun Body(num: Int) {
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text(
            modifier = Modifier.fillMaxWidth(),
            text = "$num",
            color = Color.Black,
            textAlign = TextAlign.Center,
            fontSize = 60.sp
        )
    }
}
```

### 编写页面整体结构

`Compose`提供了`Scaffold`这样的一些基本组件。

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Scaffold(
                    topBar = { AppBar() },
                    content = { Body(0) }
                )
            }
        }
    }
}
```

## 状态更新

现在这个页面是不会发生改变，我们需要添加一个按钮来实现更新`count`。但是数值的更新如何引起页面的更新，这就需要了解一下`Compose`的状态概念。文档如下：

>To add internal state to a composable, use the mutableStateOf function, which gives a composable mutable memory. To not have a different state for every recomposition, remember the mutable state using remember. And, if there are multiple instances of the composable at different places on the screen, each copy will get its own version of the state.

根据文档，我需要使用`mutableStateOf`这个函数。

```kotlin
var count by remember { mutableStateOf(0) }
```

之后再添加一下`FloatingButton`。完整代码如下：

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            var count by remember { mutableStateOf(0) }
            MaterialTheme {
                Scaffold(
                    topBar = { AppBar() },
                    floatingActionButton = {
                        FloatingActionButton(
                            backgroundColor = Color(0xff47c7dc),
                            onClick = { count++ },
                            content = {
                                Icon(
                                    imageVector = Icons.Outlined.Add,
                                    contentDescription = "Add Button"
                                )
                            }
                        )
                    },
                    content = { Body(count) }
                )
            }
        }
    }
}
```
