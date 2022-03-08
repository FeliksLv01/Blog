---
title: 让代码更Dart
date: 2022-03-08
categories:
  - 客户端
tags:
  - dart
---

## Dart 印象

- 它是一门面向对象的语言
- 它是强类型语言
- 也有静态类型分析，类型推断这些 Dart 编译器的特性

## Dart 2.1

- 没有接口（interface），但有 implements（一类两用）
- 支持 mixin（混入）

### 抽象类

我们可以将抽象类作为接口使用，以策略模式的实现为例：

```dart
abstract class IOpenBookStrategy {
  void openBook();
}

class EpubBookStrategy implements IOpenBookStrategy {
  @override
  void openBook() {
    print("open local book");
  }
}

class PdfBookStrategy implements IOpenBookStrategy {
  @override
  void openBook() {
    print("open net book");
  }
}

class TxtBookStrategy implements IOpenBookStrategy {
  @override
  void openBook() {
    print("open txt book");
  }
}

void main() {
  IOpenBookStrategy openBookStrategy = new EpubBookStrategy();
  openBookStrategy.openBook();
}
```

extends 和 implements 一个抽象类，它们之间是有区别的，可以看下下面的例子：

我们的`AbsClass`是一个抽象类，它有两个方法，一个有默认实现，一个没有。

- extends 时，默认只需要实现没有默认实现的方法
- implements 时，所有的方法都必须实现

```dart
abstract class AbsClass {
  void operator();

  void dosomething() {
    print("something");
  }
}

class AbsClassImpl extends AbsClass {
  @override
  void operator() {
    // TODO: implement operator
  }
}

class AbsClassImpl2 implements AbsClass {
  @override
  void dosomething() {
    // TODO: implement dosomething
  }

  @override
  void operator() {
    // TODO: implement operator
  }
}
```

### Mixin

- Mixin 是一种面向对象特性
- 「继承」的含量比较重

```dart
abstract class Animal {}

abstract class Mammal extends Animal {}

abstract class Bird extends Animal {}

abstract class Fish extends Animal {}

mixin Walker {
  void walk() {
    print("walk");
  }
}

mixin Swimmer {
  void swim() {
    print("swim");
  }
}

mixin Flyer {
  void fly() {
    print("fly");
  }
}
```

我们定义了三个抽象类，都继承自 Animal 类，还有三个 mixin。

当我们去具体实现一个动物，例如 Dolphin，它是哺乳类，但是它也会游泳，如果我们把 swim 方法放在了 Fish 类的内部，那么就会造成它需要的方法在两个不同的类里，因此我们可以通过 mixin 将行为抽离出来。

```dart
class Dolphin extends Mammal with Swimmer {}

class Bat extends Mammal with Walker, Flyer {}

class Duck extends Bird with Walker, Swimmer, Flyer {}
```

#### 方法覆盖问题

有了 mixin 这种类似于多继承的机制之后，就会带来方法覆盖的问题，两个 mixin 有同样的方法的话，怎么办。

```dart
class P {
  void printMsg() => print('A');
}

mixin B {
  void printMsg() => print('B');
}

mixin C {
  void printMsg() => print('C');
}

class BC extends P with B, C {}

class CB extends P with C, B {}

void main() {
  var bc = BC();
  // C
  bc.printMsg();

  var cb = CB();
  // B
  cb.printMsg();
}
```

#### TimerMixin 案例

在编写 Flutter 的过程中，经常需要计算一些 widget 的曝光时间。可以将相关功能编写成一个 mixin。

```dart
import 'dart:async';

mixin TimerMixin {
  String hoursStr = '00';
  String minutesStr = '00';
  String secondsStr = '00';

  List<int> timerData = [];

  startTimer() {
    Timer.periodic(Duration(seconds: 1), (timer) {
      timerData.clear();
      timerData.add(timer.tick.toInt());
    });
    return timerData;
  }

  void disposeTimer() {
    hoursStr = ((timerData[0] / (60 * 60)) % 60).floor().toString().padLeft(2, "0");
    minutesStr = ((timerData[0] / 60) % 60).floor().toString().padLeft(2, "0");
    secondsStr = (timerData[0] % 60).floor().toString().padLeft(2, "0");
    print("$hoursStr:$minutesStr:$secondsStr");
  }
}
```

How to use?

```dart
class _DemoPageState extends State<DemoPage> mixin TimerMixin{

  @override
  void initState() {
    startTimer();
    super.initState();
  }

  @override
  void dispose() {
    disposeTimer();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

## Dart 2.2 ~ 2.3

- 展开操作符
- 控制流集合

### 展开操作符

没有展开操作符之前，我们往往是使用级联操作符来实现列表添加

```dart
Widget build(BuildContext context) {
  return CupertinoPageScaffold(
    child: ListView(
      children: [
        Tab2Header(),
      ]..addAll(buildTab2Conversation()),
    ),
  );
}
```

有了展开操作符之后，可以这样写

```dart
Widget build(BuildContext context) {
  return CupertinoPageScaffold(
    child: ListView(
      children: [
        Tab2Header(),
        ..buildTab2Conversation(),
      ],
    ),
  );
}
```

### 控制流集合

生成列表组件的时候，我们常常会这样写，来处理动态的 children

```dart
Widget build(BuildContext context) {
  return Row(
    children: [
      IconButton(icon: Icon(Icons.menu)),
      Expanded(child: title),
      ...isAndroid ? [IconButton(icon: Icon(Icons.search))] : [],
    ],
  );
}
```

但是这样还是不太方便，我们希望不是 android 平台就直接不添加任何元素，那么有了控制流集合之后，我们可以这样写：

```dart
Widget build(BuildContext context) {
  return Row(
    children: [
      IconButton(icon: Icon(Icons.menu)),
      Expanded(child: title),
      if (isAndroid)
        IconButton(icon: Icon(Icons.search))
      else
        IconButton(icon: Icon(Icons.about)),
    ],
  );
}
```

除了 if-else，我们还可以在列表使用 for

```dart
Widget build(BuildContext context) {
  return Row(
    children: [
      IconButton(icon: Icon(Icons.menu)),
      Expanded(child: title),
      for(var line in lines.sublist(0, lines.length - 1))
        Text(line),
      Text(lines.last)
    ],
  );
}
```

同样，我们也可以在 Map 中使用

```dart
var map = Map<String, WidgetBuilder>.fromIterable(
  kAllGalleryDemos,
  key: (demo) => '${demo.routeName}',
  value: (demo) => demo.buildRoute,
);
```

可以将上面的代码转换成下面这种：

```dart
return {
  for (var demo in kAllGalleryDemos)
    '${demo.routeName}' : demo.buildRoute,
}
```

## Dart 2.7

- 拓展方法

### 拓展方法

如何让一个类有更多的方法供我们去调用？很多时候我们是不能直接修改那个类的，有几种方法：

- 写一个工具类
- 写一个包状态（装饰器模式）
- extension

具体代码如下：

```dart
class Helper {
  static String getStringFirstChar(String source) {
    return source.substring(0, 1);
  }
}

class WrapperString {
  String source;

  WrapperString({required this.source});

  String getFirstChar() {
    return source.substring(0, 1);
  }
}

extension UsableElsewhere on String {
  String get firstChar => substring(0, 1);
}
```

同样，在 Flutter 中，我们可以来拓展一个 Widget。

```dart
extension ExtendedText on Widget {
  alignAtStart() {
    return Align(
      alignment: AlignmentDirectional.centerStart,
      child: this,
    );
  }

  alignAtEnd() {
    return Align(
      alignment: AlignmentDirectional.centerEnd,
      child: this,
    );
  }
}
```

## Dart 2.12

- 健全的空安全

[视频资源](https://www.bilibili.com/video/BV19S4y1Q73X)

## Dart 2.13

- 类型别名

原先我们可以使用`typedef`来给方法取别名

```dart
typedef IntOperation<int> = int Function(int a, int b);
```

在 Dart 2.13，我们可以给类型取别名

```dart
typedef Integer = int;
typedef Json = Map<String, dynamic>;

print(int == Integer); // true

var j = Json();
j['name'] = 'felikslv';

typedef MapToList<X> = Map<X, List<X>>;

MapToList<int> m = {};
m[7] = [7];
m[8] = [2, 2, 2];
```

## Dart 2.15

- 构造函数拆分（tear offs）

首先回顾下正常的函数拆分，我们将 greet 方法拆分出来，赋值给 greet，还可以将它传给 forEach。

```dart
class Greeter {
  final String name;
  Greeter(this.name);

  void greet(String who) {
    print('$name says: Hello $who!');
  }
}

void main() {
  final m = Greeter('Michael');
  final greet = m.greet;

  greet('Leaf');

  ['Lasse', 'Bob', 'Erik'].forEach(m.greet);
}
```

Dart 2.15 之后，我们也可以对构造函数进行拆分。

```dart
Widget build(BuildContext context) {
  return Row(children: ['Apple', 'Orange'].map(Text.new).toList());
}
```
