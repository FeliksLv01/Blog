---
title: TypeScript笔记
date: 2023-10-06
categories:
  - 前端
tags:
  - ts
---

typescript 的一些使用记录。

## PropsWithChildren

可以为你省去频繁定义 children 的类型，自动设置 children 类型为 ReactNode:

```js
type AppProps = React.PropsWithChildren<{ message: string }>

const App = ({ message, children }: AppProps) => (
  <div>
    {message}
    {children}
  </div>
)
```

## 获取未导出的 Type

某些场景下我们在引入第三方的库时会发现想要使用的组件并没有导出我们需要的组件参数类型或者返回值类型，这时候我们可以通过 ComponentProps/ ReturnType 来获取到想要的类型。

```js
// 获取参数类型
import { Button } from 'library' // 但是未导出props type

type ButtonProps = React.ComponentProps<typeof Button> // 获取props

type AlertButtonProps = Omit<ButtonProps, 'onClick'> // 去除onClick

const AlertButton: React.FC<AlertButtonProps> = props => <Button onClick={() => alert('hello')} {...props} />

// 获取返回值类型
function foo() {
  return { baz: 1 }
}

type FooReturn = ReturnType<typeof foo> // { baz: number }
```
