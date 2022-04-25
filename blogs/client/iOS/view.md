---
title: UIKit入门笔记
date: 2021-11-17
sidebar: "auto"
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

### UIView 生命周期

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

### UIViewController 的生命周期

选择合适的函数处理不同的业务

- init
- viewDidLoad
- viewWillAppear
- viewDidAppear
- viewWillDisappear
- viewDidDisappear
- Dealloc

## UILabel

```swift
let label2 = UILabel(frame: CGRect(x: 20, y: 160, width: 200, height: 30))
label2.text = "自定义便签"
// 设置字体
label2.font = UIFont.boldSystemFont(ofSize: 20)
// 设置字体颜色
label2.textColor = .red
// 设置阴影颜色
label2.shadowColor = .green
// 设置阴影的位置偏移
label2.shadowOffset = CGSize(width: 2, height: 2)
// 设置文字对齐
label2.textAlignment = .center
```

多行文本

```swift
let label3 = UILabel(frame: CGRect(x: 20, y: 210, width: 200, height: 150))
label3.text = "我是长文本我是长文本我是长文本我是长文本我是长文本我是长文本我是长文本我是长文本我是长文本我是长文本我是长文本我是长文本我是长文本我是长文本我是长文本我是长文本我是长文本我是长文本"
label3.numberOfLines = 7
```

个性化文本

```swift
let label4 = UILabel(frame: CGRect(x: 20, y: 390, width: 200, height: 30))
let attri = NSMutableAttributedString(string: "我是个性化文本")
attri.addAttributes([.font: UIFont.boldSystemFont(ofSize: 20), .foregroundColUIColor.blue], range: NSRange(location: 3, length: 3))
label4.attributedText = attri
```

使用`NSMutableAttributedString`配置个性化字符串，`addAttributes(_:,range:)`用于追加个性化设置，第一个参数是个性化设置字典，第 2 个参数为此个性化这是在字符串的生效范围。

个性化字典，系统给我们提供了许多属性键

- font 字体，UIFont
- paragraphStyle 段落风格，NSParagraphStyle
- foregroundColor 文本颜色，UIColor
- backgroundColor 背景颜色，UIColor
- underlineStyle 下划线风格，NSNumber
- shadow 阴影，NSShadow
- link 超链接，对应值可以是 NSURL 或 NSString
- underlineColor 下划线颜色，UIColor

### sizeToFit

```swift
label.sizeToFit()
```

通过设置 sizeToFit，UILabel 的大小会根据文字进行自适应，而不是按照设置的 frame 来

## UIButton

```swift
let button = UIButton(type: .system)
button.backgroundColor = .link
button.setTitle("input", for: .normal)
button.setTitleColor(.white, for: .normal)
```

### UIButton 添加点击事件

UIButton 采用 Target-Action

- 当某个事件触发时，调用对应 target 对象的相应方法
- 传值的限制比较多

```swift
extension ViewController {
    @objc private func goImageView() {
        let vc = ImageViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
}

button.addTarget(self, action: #selector(goImageView), for: .touchUpInside)
```

- UIButton 通过 Target-Action 的模式，处理点击逻辑
- 系统封装用户操作事件
- 对应事件开发者实现自定义的⽅法

### UIControl

- UIControl 作为父类，集成了所有子类可能用到的事件
- 系统级封装的可交互视图，都继承⾃ UIControl

UIView -----> UIControl ------> UIButton、UISwitch、UISlider

### UIButton 其他设置

设置圆角

```swift
button.layer.cornerRadius = 15.0
```

设置 button 文字大小

```swift
button.titleLabel?.font = UIFont.systemFont(ofSize: 20.0)
```

## UIImage 和 UIImageView

### UIImage

使⽤场景

- 通过 UIImageView 视图展示
- 系统封装视图的图⽚展示
- 在上下⽂中绘制

常见的图片类型：png、jpeg、pdf，在 iOS 中，图片数据都会被系统封装成 UIImage

```swift
// 通过图片素材名称创建
let image = UIImage(named: "imageName")
// 通过文件路径创建
let image2 = UIImage(contentsOfFile: "filePath")
// 通过Data数据创建UIImage实例
let image3 = UIImage(data: Data())

let imageView = UIImageView(image: image)
```

### 使用 UIImageView 播放动画

```swift
var imageArray = Array<UIImage>()
for index in 1...18 {
    let image = UIImage(named: "loading-\(index)")
    imageArray.append(image!)
}
let loadingImageView = UIImageView(frame: CGRect(x: 30, y: 250, width: 2, height: 250))
// 设置动画数组
loadingImageView.animationImages = imageArray
// 设置播放时长
loadingImageView.animationDuration = 1.5
// 设置播放次数，0是循环播放
loadingImageView.animationRepeatCount = 0
view.addSubview(loadingImageView)
// 开始播放
loadingImageView.startAnimating()
```

### UIViewContentMode

当图⽚尺⼨和 UIImageView 尺⼨不符的时候，⾃定义填充⽅式

```swift
    public enum ContentMode : Int {
        case scaleToFill = 0
        case scaleAspectFit = 1 // contents scaled to fit with fixed aspect. remainder is transparent
        case scaleAspectFill = 2 // contents scaled to fill with fixed aspect. some portion of content may be clipped.
        case redraw = 3 // redraw on bounds change (calls -setNeedsDisplay)
        case center = 4 // contents remain same size. positioned adjusted.
        case top = 5
        case bottom = 6
        case left = 7
        case right = 8
        case topLeft = 9
        case topRight = 10
        case bottomLeft = 11
        case bottomRight = 12
    }
```

## UIGestureRecognizer

识别⽤户在屏幕中的触摸，常用手势封装如下：

- UITapGestureRecognizer
- UIPinchGestureRecognizer
- UIRotationGestureRecognizer
- UISwipeGestureRecognizer
- UIPanGestureRecognizer
- UILongPressGestureRecognizer

可以在任何视图上，增加一个或者多个⼿势，系统⾃动识别⼿势，开发者自定义响应逻辑，采⽤ Target - Action 的⽅式进⾏处理

### UIGestureRecognizerDelegate

通过 Delegate 的方式 扩展在手势识别过程中的自定义操作

- 是否响应手势
- 是否支持多手势
- 多个手势冲突时如何处理

```swift
extension RecommendVC: UIGestureRecognizerDelegate {
    func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
        return false
    }
}
```

## UITextField

```swift
let textField: UITextField = {
    let textField = UITextField()
    textField.borderStyle = .roundedRect
    textField.textColor = .black
    textField.textAlignment = .center
    textField.placeholder = "请输入姓名"
    return textField
}()
```

borderStyle 有四种:

- none 无边框
- line 直线边框
- bezel 贝塞尔风格边框
- roundRect 圆角边框

设置左右视图

```swift
//创建左视图
let imageView1 = UIImageView(image: UIImage(named: "image"))
imageView1.frame = CGRect(x: 0, y: 0, width: 30, height: 30)
//创建右视图
let imageView2 = UIImageView(image: UIImage(named: "image"))
imageView2.frame = CGRect(x: 0, y: 0, width: 30, height: 30)
//设置UITextField控件的左右视图
textField.leftView = imageView1
textField.rightView = imageView2
//设置UITextField控件的左右视图显示模式
textField.leftViewMode = UITextField.ViewMode.always
textField.rightViewMode = UITextField.ViewMode.always
```

### UITextField 代理方法

设置 UITextField 控件的代理为当前视图控制器实例

```swift
textField.delegate = self
```

进行代理方法的实现

```swift
extension InputViewController: UITextFieldDelegate {

    //这个方法在输入框即将进入编辑状态时被调用
    func textFieldShouldBeginEditing(_ textField: UITextField) -> Bool {
        return true
    }

    //这个方法在输入框已经开始编辑时被调用
    func textFieldDidBeginEditing(_ textField: UITextField){

    }

    //这个方法在输入框即将结束编辑时被调用
    func textFieldShouldEndEditing(_ textField: UITextField) -> Bool{
        return true
    }

    //这个方法在输入框已经结束编辑时被调用
    func textFieldDidEndEditing(_ textField: UITextField){

    }

    //这个方法在输入框中文本发生变化时被调用
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool{
        //如果输入框中的文字已经等于11位 则不允许再输入
        if (textField.text?.count)! >= 11 {
            return false
        }
        //只有0～9之间的数字可以输入
        if (string.first)! >= "0" && (string.first)! <= "9" {
            return true
        }else{
            return false
        }

    }

    //这个方法用户点击输入框中清除按钮会被调用
    func textFieldShouldClear(_ textField: UITextField) -> Bool{
        return true
    }

    //这个方法用户点击键盘上Return按钮会被调用
    func textFieldShouldReturn(_ textField: UITextField) -> Bool{
      // textField一旦进入编辑状态，不会自动结束编辑，需要手动注销第一响应
        textField.resignFirstResponder()
        return true
    }
}
```

设置清除按钮的显示模式

```swift
textField.clearButtonMode = UITextField.ViewMode.always
```

## UISwitch

```swift
let swi: UISwitch = {
   let swi = UISwitch()
    // 开启状态的颜色
    swi.onTintColor = .green
    // 普通状态的颜色
    swi.tintColor = .red
    // 开关滑块的颜色
    swi.thumbTintColor = .gray
    // 设置开关的初始状态
    swi.isOn = false
    return swi
}()
```

添加交互操作

```swift
swi.addTarget(self, action: #selector(change), for: .valueChanged)

@objc private func change(swi: UISwitch) {
    print("\(swi.isOn)")
}
```

## UIWindow

- 特殊形式的 UIView，提供 App 中展示内容的基础窗口
- 只作为容器，和 ViewController 一起协同工作
- 通常屏幕上只存在、展示一个 UIWindow
- 使用 storyboard 会帮我们自动创建

## UITabBarController

UITabBarController 功能就是管理多个 ViewController 切换，通过点击底部对应按钮，选中对应需要展示的 ViewController

TabBarViewController

```swift
import UIKit

class TabBarViewController: UITabBarController {

    override func viewDidLoad() {
        super.viewDidLoad()

        let vc1 = HomeViewController()
        let vc2 = SearchViewController()
        let vc3 = LibraryViewController()

        vc1.title = "Browse"
        vc2.title = "Search"
        vc3.title = "Library"

        vc1.navigationItem.largeTitleDisplayMode = .always
        vc2.navigationItem.largeTitleDisplayMode = .always
        vc3.navigationItem.largeTitleDisplayMode = .always

        let nav1 = UINavigationController(rootViewController: vc1)
        let nav2 = UINavigationController(rootViewController: vc2)
        let nav3 = UINavigationController(rootViewController: vc3)

        nav1.navigationBar.tintColor = .label
        nav2.navigationBar.tintColor = .label
        nav3.navigationBar.tintColor = .label

        nav1.tabBarItem = UITabBarItem(title: "Home", image: UIImage(systemName: "house"), tag: 1)
        nav2.tabBarItem = UITabBarItem(title: "Search", image: UIImage(systemName: "magnifyingglass"), tag: 1)
        nav3.tabBarItem = UITabBarItem(title: "Library", image: UIImage(systemName: "music.note.list"), tag: 1)

        nav1.navigationBar.prefersLargeTitles = true
        nav2.navigationBar.prefersLargeTitles = true
        nav3.navigationBar.prefersLargeTitles = true

        setViewControllers([nav1, nav2, nav3], animated: false)
    }

}
```

AppDelegate

```swift
var window: UIWindow?

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // Override point for customization after application launch.
    let window = UIWindow(frame: UIScreen.main.bounds)
    window.rootViewController = TabBarViewController()
    window.makeKeyAndVisible()
    self.window = window
    return true
}
```

## UITableView

`UITableView`作为视图，只负责展示，协助管理，不管理数据，需要开发者为 UITableView 提供展示所需要的数据及 Cell，通过 Delegate 模式，开发者需要实现`UITableViewDataSource`。

- numberOfRowsInSection
- cellForRowAt

UITableViewDelegate

- 提供滚动过程中，UITableViewCell 的出现、消失时机
- 提供 UITableViewCell 的高度、headers 以及 footers 设置
- 提供 UITableViewCell 各种行为的回调（点击、删除等）

```swift
class TableViewController: UIViewController {
    // 数据源
    var dataArray = Array(repeating: "测试", count: 25)

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        title = "Table View"
        // 创建UITableView
        let tableView = UITableView(frame: view.frame, style: .insetGrouped)
       // 注册cell
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "table")
        tableView.delegate = self
        tableView.dataSource = self
        view.addSubview(tableView)
    }
}

extension TableViewController: UITableViewDelegate, UITableViewDataSource {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }

    func numberOfSections(in tableView: UITableView) -> Int {
        return dataArray.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
       // 获取cell，这里的cell也可以使用自定义的
        let cell = tableView.dequeueReusableCell(withIdentifier: "table", for:  indexPath)
        cell.textLabel?.text = dataArray[indexPath.section]
        cell.imageView?.image = UIImage(systemName: "gear")
        // 添加右边的箭头>
        cell.accessoryType = .disclosureIndicator
        return cell
    }
}
```

UITableViewCell 默认提供展示文字和图片，`cell.textLabel`、`cell.detailTextlabel`、`cell.imageView`、`cell.contentView`

### Cell 复用

系统提供复⽤用回收池，根据 reuseIdentifier 作为标识，划出去的 cell 会被回收，作为新 cell 填充到底部，通过使用`dequeueReusableCellWithIdentifier`即可实现 cell 的复用

### 顶部 20px 问题

UITableView 和 navigationBar 之间会有 20px 的距离

解决方案如下：

```swift
if #available(iOS 11.0, *) {
  tableView.contentInsetAdjustmentBehavior = .never
} else {
  automaticallyAdjustsScrollViewInsets = false
}
tableView.scrollIndicatorInsets = tableView.contentInset
tableView.contentInset = UIEdgeInsets(top: 64, left: 0, bottom: 0, right: 0)
```

## UICollectionView

- 提供列表展示的容器
- 内置复用回收池
- 支持横向+纵向布局
- 更加灵活的布局方式
- 更加灵活的动画
- 更多的装饰视图
- 布局之间的切换

### UICollectionViewCell

- 不提供默认样式

  - 不是以行为设计基础
  - 只有 contentView / backgroundView
  - 继承自 UICollectionReusableView

- 必须先注册 Cell 类型用于重用

简单 demo

```swift
class LibraryVC: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Library"
        let collectionLayout = UICollectionViewFlowLayout()
        let collectionView = UICollectionView(frame: view.bounds, collectionViewLayout: collectionLayout)
        collectionView.register(UICollectionViewCell.self, forCellWithReuseIdentifier: "cell")
        collectionView.delegate = self
        collectionView.dataSource = self
        view.addSubview(collectionView)
    }

}


extension LibraryVC: UICollectionViewDelegate, UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return 20
    }

    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "cell", for: indexPath)
        cell.backgroundColor = .systemBlue
        return cell
    }
}
```

### UICollectionViewLayout

用于生成 UICollectionView 布局信息的抽象类

- UICollectionView 提供基本的容器、滚动、复用功能
- 布局信息完全交给开发者
- 作为抽象类，业务逻辑需要继承
- 实现 UICollectionViewLayout(UISubClassingHooks)中的方法
- 开发者可以自定义生成 attribute，系统通过此进行布局
- 系统提供默认的流式布局 Layout

FlowLayout 提供有三个可配置的属性

- minimumLineSpacing 行与行之前的间隔
- minimumInteritemSpacing 一行里之间的间隔
- itemSize 每个 cell 的大小

通过遵守`UICollectionViewDelegateFlowLayout`，可实现不同位置显示不同大小的 cell

```swift
extension LibraryVC: UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        if(indexPath.item % 3 == 0) {
            return CGSize(width: view.frame.width, height: 100)
        } else {
            return CGSize(width: (view.frame.width-10)/2, height: 300)
        }
    }
}
```

## UIScrollView

UITableView、UICollectionView、UIPageViewController 等都是基于 UIScollView 扩展出来的高级视图控件。

需要设置 UIScrollView 的 contentSize 属性来控制滚动视图的可滚动范围。

```swift
class SearchVC: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Search"
        let scrollView = UIScrollView(frame: view.bounds)
        scrollView.backgroundColor = .lightGray
        scrollView.contentSize = CGSize(width: view.bounds.width*5, height: view.bounds.height)
        let colors: [UIColor] = [.red, .blue, .green, .purple, .orange]
        for i in 0..<5 {
            let subView = UIView(frame: CGRect(x: scrollView.bounds.size.width*CGFloat(i), y: 0, width: scrollView.bounds.size.width, height: scrollView.bounds.size.height))
            subView.backgroundColor = colors[i]
            scrollView.addSubview(subView)
        }
        scrollView.isPagingEnabled = true
        view.addSubview(scrollView)
    }

}
```

当用户手离开屏幕后，滚动视图会产生回弹效果，这是由 UIScrollView 的 bounces 属性决定的。

```swift
scrollView.bounces = false // 关闭回弹
```

当滚动视图的 contentSize 比其自身尺寸小时，默认不产生阻尼回弹效果，如果需要，可进行如下设置：

```swift
scrollView.alwaysBounceVertical = true
scrollView.alwaysBounceHorizontal = true
```

滚动条是否显示

```swift
scrollView.showsVerticalScrollIndicator = true
scrollView.showsHorizontalScrollIndicator = true
```

定位分页效果，可用于作为图片轮播图

```swift
scrollView.isPagingEnabled = true
```

### UIScrollViewDelegate

滚动视图滚动时被系统自动调用，可用于监听页面滚动，以及根据 Offset 做业务逻辑

```swift
optional public func scrollViewDidScroll(_ scrollView: UIScrollView)
```

拖拽，可用于中断一些业务逻辑，如视频/gif 播放

```swift
optional func scrollViewWillBeginDragging(_ scrollView: UIScrollView)
optional func scrollViewDidEndDragging(_ scrollView: UIScrollView, willDecelerate decelerate: Bool)
```

减速，页面停止时开始逻辑，如视频自动播放

```swift
optional func scrollViewWillBeginDecelerating(_ scrollView: UIScrollView) // called on finger up as we are moving

optional func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) // called when scroll view grinds to a halt
```

## WKWebView

WebKit 框架:

>WebKit 是一个开源的 Web 浏览器引擎。对于 iOS 中的 WebKit.framework 就是在 WebCore、底层桥接、JSCore 引擎等核心模块的基础上，针对 iOS 平台的项目封装。

基本加载:

>通过 configuration 进⾏基本设置，加载 URL & HTML，类⽐之前的 UIKit 提供基础的功能，在 delegate 中处理业务逻辑。configuration 可以实现基本的共享 Cookie 设置，播放视频设置，默认 js 注入等。

```swift
var webView: WKWebView!

override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = .systemBackground
    let navHeight = navigationController?.navigationBar.frame.size.height ?? 0
    webView = WKWebView(frame: CGRect(x: 0, y: navHeight, width: view.frame.size.width, height: view.frame.size.height - navHeight))
    // 设置背景色与主题色一致
    webView.isOpaque = false
    view.addSubview(webView)
    webView.load(URLRequest(url: URL(string: "https://blog.kcqnly.club")!))
    // 也可使用loadHtmlString加载本地文件
}
```

### WKNavigationDelegate

- decidePolicyForNavigationAction 是否加载请求 (scheme 拦截、特殊逻辑、JS 和 Native 通信)
- didFinishNavigation webView 完成加载(业务逻辑)
- didFailNavigation webView 加载失败 (loadingView 展示，重试按钮等)
- webViewWebContentProcessDidTerminate webView Crash 回调 (自动重新加载)

### WKUIDelegate

- runJavaScriptAlertPanelWithMessage
- runJavaScriptConfirmPanelWithMessage
- runJavaScriptTextInputPanelWithPrompt

处理 alert( ) / confirm( ) / prompt( ) ⾃定义样式

## KVO

观察者模式:

- 定义了一种一对多的关系，可以让多个观察者同时监听某一个对象或对象的属性变化
- 被监听的对象在状态变化时，会通知所有的观察者，使他们能够及时的处理理业务逻辑

注册监听

```swift
webView.addObserver(self, forKeyPath: "estimatedProgress", options: .new, context: nil)
```

- self 作为监听者，接受事件
- 监听 self.webview 的 estimatedProgress 属性
- 在 NSKeyValueObservingOptionNew 的时候发通知

移除监听

```swift
deinit {
  webView.removeObserver(self, forKeyPath: "estimatedProgress")
}
```

接收通知

```swift
override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
      // 业务逻辑
}
```

change 对应着上面的 options
