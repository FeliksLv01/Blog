---
title: Flutter图片预加载
date: 2020-07-20
publish: false
categories:
  - 客户端
tags:
  - flutter
---

## 问题

我们在给页面添加背景图片的时候，一般是用这样的一个 Container，之后使用 Stack 堆叠布局或者，直接在 Container 中添加 child。

```dart
  Container(
    decoration: BoxDecoration(
      image: DecorationImage(
        image: AssetImage("assets/images/background.jpg"),
        fit: BoxFit.cover,
      ),
    ),
    width: ScreenUtil.screenWidth,
    height: ScreenUtil.screenHeight,
  ),
```

但是这样做有一个问题，那就是当你的图片有点大的时候（我测试的结果是>48Kb）会有明显的白屏效果，用户体验非常不好。

## 解决方法

我们可以通过对图片进行预加载，来提前将图片资源读取到内存中，即拿即用。这里主要是使用`precacheImage`函数。

具体的使用方式是这样的。

```dart
Image myImage;

  @override
  void initState() {
    super.initState();
    myImage= Image.asset(path);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    precacheImage(myImage.image, context);
  }
```

或者是将它放到`main.dart`中。

```dart
class MyApp extends StatelessWidget {
  MyApp() {
    final router = Router();
    Routes.configureRoutes(router);
    Application.router = router;
  }
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    precacheImage(AssetImage("assets/images/background.jpg"), context);
    return MaterialApp(
      title: 'IWUT',
      theme: ThemeData(
        primaryColor: Colors.white,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      onGenerateRoute: Application.router.generator,
    );
  }
}
```

要使用时，这样使用。

```dart
ImageProvider imageProvider = AssetImage("path");
```

### 注意事项

但是并不是这样就 ok 了，通过查询 stackoverflow，我了解到，当预加载执行之后，又加载了其他的图片，那么预加载将会失效。所以说，最好的方式就是在前一个页面中的`didChangeDependencies`方法中使用`precacheImage`方法，这样预加载就能顺序进行。

## 清除缓存

```dart
imageCache.clear();
```
