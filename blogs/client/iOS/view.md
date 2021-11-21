---
title: iOS入门笔记
date: 2021-11-17
publish: false
categories:
  - 客户端
tags:
  - iOS
---

## UIView

- 最基础的视图类，管理屏幕上一定区域的内容展示
- 作为各种视图类型的父类，提供基础的能力
- 外观、渲染和动画
- 相应区域内的事件
- 布局和管理子视图

布局:

- 设置大小和位置（frame）
- addSubView

使用栈管理全部的子 view

- 位置重叠的展示最后入栈的
- 可以随时调整位置
- 插入到指定位置

```swift
class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        let view1 = UIView(frame: CGRect(x: 100, y: 100, width: 100, height: 100))
        view1.backgroundColor = UIColor.red
        self.view.addSubview(view1)

        let view2 = UIView(frame: CGRect(x: 150, y: 150, width: 100, height: 100))
        view2.backgroundColor = UIColor.green
        self.view.addSubview(view2)
    }

}
```

在上层的永远是最后添加的 view

**UIView 生命周期**

从类初始化之后，会依次经历下面四个过程

- willMoveToSuperview
- didMoveToSuperview
- willMoveToWindow
- didMoveToWindow

## UIViewController

视图控制器，管理视图 View 层级结构

- 自身包含 View，可以理解为⼀个容器
- 管理 View 视图的⽣命周期
- 响应⽤户操作
- 和 App 整体交互，视图的切换
- 作为⼀个 container 管理多个 Controller 和动画

**UIViewController 的生命周期**

选择合适的函数处理不同的业务

- init
- viewDidLoad
- viewWillAppear
- viewDidAppear
- viewWillDisappear
- viewDidDisappear
- Dealloc
