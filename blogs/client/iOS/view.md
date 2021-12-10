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

## UIButton

```swift
let button = UIButton(type: .system)
button.backgroundColor = .link
button.setTitle("input", for: .normal)
button.setTitleColor(.white, for: .normal)
```

添加点击事件

```swift
extension ViewController {
    @objc private func goImageView() {
        let vc = ImageViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
}

button.addTarget(self, action: #selector(goImageView), for: .touchUpInside)
```

## UIImage 和 UIImageView

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
