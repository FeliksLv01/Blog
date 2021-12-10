---
title: iOS项目无StoryBoard设置
date: 2021-12-10
categories:
  - 客户端
tags:
  - iOS
---

Xcode 13.1

首先将Main.Storyboard Move To Trash

## info.plist

删除`Storyboard Name`这一项

## General

点击侧边的项目名称，进入`General`，将Deployment Info里的Main Interface改成Launch

## 代码设置

### AppDelegate

```swift
var window: UIWindow?

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    let window = UIWindow(frame: UIScreen.main.bounds)
    let navVC = UINavigationController(rootViewController: ViewController())
    window.rootViewController = navVC
    window.makeKeyAndVisible()
    self.window = window
    return true
}
```

### SceneDelegate

```swift
var window: UIWindow?

func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
    // Use this method to optionally configure and attach the UIWindow `window` to the provided UIWindowScene `scene`.
    // If using a storyboard, the `window` property will automatically be initialized and attached to the scene.
    // This delegate does not imply the connecting scene or session are new (see `application:configurationForConnectingSceneSession` instead).
    guard let windowScene = (scene as? UIWindowScene) else { return }
    let window = UIWindow(windowScene: windowScene)
    let navVC = UINavigationController(rootViewController: ViewController())
    window.rootViewController = navVC
    window.makeKeyAndVisible()
    self.window = window
}
```

### 测试

LaunchScreen之后自动进入ViewController

```swift
import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Home"
        view.backgroundColor = .blue
    }
}
```
