---
title: Element树的一些使用方法
date: 2021-08-06
categories:
 - 客户端
tags:
 - flutter
---

`Element树`桥接了Widget与实际渲染的RenderObject，是Flutter UI体系中最重要的部分，通过遍历的`Element`树，我们可以得到许多有用的数据。这里记录下在实习期间学习到的`Element`的使用方法。

## 案例

### 页面重新绘制

这是一个很实用的例子，当我们旋转屏幕的时候，我们可能为了适配横屏，去单独写了一套UI，那么如何触发重绘呢，对于当前页面，我们可以只做一次`setState`就行了，但是如果要重绘整个app，那就稍微有一点点麻烦。

可以在根Widget加一个`OrientationBuilder`，在它的旋转回掉调用我们的重绘函数。重绘函数如下

```dart
void rebuildAllChildren(BuildContext context) {
  void rebuild(Element el) {
    el.markNeedsBuild();
    el.visitChildren(rebuild);
  }

  (context as Element).visitChildren(rebuild);
}
```

### 子组件获取父组件中的方法

一般来说，我们要写页面UI的时候，都会将页面的UI封装成很多的子组件，这些子组件很多和父组件(Page)都不在一个文件，要访问父组件`state`里定义的方法和数据，可以借助`context`来获取。

那么`context`是什么呢，可以看下下面的代码。

```dart
class StatelessElement extends ComponentElement
...
abstract class ComponentElement extends Element
...
abstract class Element extends DiagnosticableTree implements BuildContext 
```

可以看到`BuildContext`是一个接口，而`Element`实现了这个接口，最终被`StatelessElement`继承。`BuildContext`对象实际上就是`Element`对象，`BuildContext`接口用于阻止对`Element`对象的直接操作。

那么我们就可以这样来实现我们的目的。通过使用`findAncestorStateOfType`方法，它可以找到距离最近的`StatefulWidget`的`State`对象。

```dart
class TestPage extends StatefulWidget {
  TestPage({Key key}) : super(key: key);

  @override
  _TestPageState createState() => _TestPageState();

  static _TestPageState of(BuildContext context) {
    assert(context != null);
    return context.findAncestorStateOfType<_TestPageState>();
  }
}

class _TestPageState extends State<TestPage> {
  void printLog() {
    print('test');
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

这样我们就可以在子组件里通过以下代码来实现调用`printLog`。

```dart
TestPage.of(context).printLog();
```
