---
title: iOS开发记录
date: 2022-03-24
publish: false
categories:
  - 客户端
tags:
  - iOS
---

## UICollectionView 自定义分割线

[参考链接](https://stackoverflow.com/questions/28691408/uicollectionview-custom-line-separators)

实现一个分割线类，在init中设置它的背景色。

```swift
private final class SeparatorView: UICollectionReusableView {
    
    static let separatorDecorationView = "separator"
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.backgroundColor = UIColor(light: UIColor(red:0.898, green:0.898, blue:0.898, alpha:1.0), dark: UIColor(red:0.177, green:0.173, blue:0.172, alpha:1.0))
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func apply(_ layoutAttributes: UICollectionViewLayoutAttributes) {
        self.frame = layoutAttributes.frame
    }
}
```

自定义一个FlowLayout，继承自`UICollectionViewFlowLayout`。在`init`方法中，注册分割线。在`layoutAttributesForElements`方法中设置分割线的frame等。

```swift
final class CustomFlowLayout: UICollectionViewFlowLayout {

    override init() {
        super.init()
        register(SeparatorView.self, forDecorationViewOfKind:  SeparatorView.separatorDecorationView)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func layoutAttributesForElements(in rect: CGRect) -> [UICollectionViewLayoutAttributes]? {
        let layoutAttributes = super.layoutAttributesForElements(in: rect) ?? []
        
        var decorationAttributes: [UICollectionViewLayoutAttributes] = []
        // 每组最后一个cell不添加分割线
        for layoutAttribute in layoutAttributes where layoutAttribute.indexPath.item != (collectionView?.numberOfItems(inSection: layoutAttribute.indexPath.section) ?? 0) - 1 {
            let separatorAttribute = UICollectionViewLayoutAttributes(forDecorationViewOfKind: SeparatorView.separatorDecorationView, with: layoutAttribute.indexPath)
            let cellFrame = layoutAttribute.frame
            separatorAttribute.frame = CGRect(x: cellFrame.origin.x + 60,
                                              y: cellFrame.origin.y + cellFrame.size.height - 1,
                                              width: cellFrame.size.width - 60,
                                              height: 1)
            separatorAttribute.zIndex = Int.max
            decorationAttributes.append(separatorAttribute)
        }
        return layoutAttributes + decorationAttributes
    }

}
```
