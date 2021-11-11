---
title: React入门笔记
date: 2021-09-21
publish: false
categories:
  - 前端
tags:
  - React
---

## 使用 vite 创建项目

```shell
yarn create vite my-app --template react-ts
```

## 虚拟 DOM

关于虚拟 DOM：

1. 本质是 Object 类型的对象（一般对象）
2. 虚拟 DOM 比较“轻”，真实 DOM 比较“重”，因为虚拟 DOM 是 React 内部在用，无需真实 DOM 上那么多的属性。
3. 虚拟 DOM 最终会被 React 转化为真实 DOM，呈现在页面上。

### 虚拟 DOM 的两种创建方式

使用 tsx 创建

```js
//1.创建虚拟DOM
const VDOM = (
  /* 此处一定不要写引号，因为不是字符串 */
  <h1 id='title'>
    <span>Hello,React</span>
  </h1>
)
//2.渲染虚拟DOM到页面
ReactDOM.render(VDOM, document.getElementById('test'))
```

使用 js 创建

```js
//1.创建虚拟DOM
const VDOM = React.createElement('h1', { id: 'title' }, React.createElement('span', {}, 'Hello,React'))
//2.渲染虚拟DOM到页面
ReactDOM.render(VDOM, document.getElementById('test'))
```

## tsx 语法规则

::: v-pre

1. 定义虚拟 DOM 时，不要写引号。
2. 标签中混入 JS 表达式时要用`{}`。
3. 样式的类名指定不要用 `class`，要用 `className`。
4. 内联样式，要用`style={{key:value}}`的形式去写。
5. 只有一个根标签
6. 标签必须闭合
7. 标签首字母
   (1).若小写字母开头，则将该标签转为 html 中同名元素，若 html 中无该标签对应的同名元素，则报错。
   (2).若大写字母开头，react 就去渲染对应的组件，若组件没有定义，则报错。

:::

```js
const myId = 'aTgUiGu'
const myData = 'HeLlo,rEaCt'

//1.创建虚拟DOM
const VDOM = (
  <div>
    <h2 className='title' id={myId.toLowerCase()}>
      <span style={{ color: 'white', fontSize: '29px' }}>{myData.toLowerCase()}</span>
    </h2>
    <h2 className='title' id={myId.toUpperCase()}>
      <span style={{ color: 'white', fontSize: '29px' }}>{myData.toLowerCase()}</span>
    </h2>
    <input type='text' />
  </div>
)
//2.渲染虚拟DOM到页面
ReactDOM.render(VDOM, document.getElementById('test'))
```

## React 定义组件

### 函数式组件

```js
//1.创建函数式组件
function MyComponent() {
  console.log(this) //此处的this是undefined，因为babel编译后开启了严格模式
  return <h2>我是用函数定义的组件(适用于【简单组件】的定义)</h2>
}
//2.渲染组件到页面
ReactDOM.render(<MyComponent />, document.getElementById('test'))
```

执行了 ReactDOM.render(`<MyComponent/>`.......之后，发生了什么？

1. React 解析组件标签，找到了 MyComponent 组件。
2. 发现组件是使用函数定义的，随后调用该函数，将返回的虚拟 DOM 转为真实 DOM，随后呈现在页面中。

### 类式组件

```js
import { Component } from 'react'

class MyComponent extends Component {
  render() {
    return <h1>Hello World</h1>
  }
}
```

执行了 ReactDOM.render(`<MyComponent/>`.......之后，发生了什么？

1. React 解析组件标签，找到了 MyComponent 组件。
2. 发现组件是使用类定义的，随后 new 出来该类的实例，并通过该实例调用到原型上的 render 方法。
3. 将 render 返回的虚拟 DOM 转为真实 DOM，随后呈现在页面中。

```tsx
import { Component } from 'react'

interface IMyComponentState {
  isHot: boolean
}

class MyComponent extends Component<{}, IMyComponentState> {
  constructor(props: {}) {
    super(props)
    this.state = { isHot: true }
    // 解决this指向问题
    this.changeWeather = this.changeWeather.bind(this)
  }

  render() {
    const { isHot } = this.state
    return <h1 onClick={this.changeWeather}>今天天气很{isHot ? '炎热' : '凉爽'}</h1>
  }

  changeWeather() {
    //changeWeather放在哪里？ ———— Weather的原型对象上，供实例使用
    //由于changeWeather是作为onClick的回调，所以不是通过实例调用的，是直接调用
    //类中的方法默认开启了局部的严格模式，所以changeWeather中的this为undefined

    console.log('changeWeather')
    //获取原来的isHot值
    const isHot = this.state.isHot
    //严重注意：状态必须通过setState进行更新,且更新是一种合并，不是替换。
    this.setState({ isHot: !isHot })
    console.log(this)

    //严重注意：状态(state)不可直接更改，下面这行就是直接更改！！！
    //this.state.isHot = !isHot //这是错误的写法
  }
}

export default MyComponent
```

**状态必须通过 setState 进行更新,且更新是一种合并，不是替换。**

### state 简写

因为箭头函数没有自己的 this。如果我们在这样的函数中引用 this，this 值取决于外部"正常的"函数。

```tsx
class MyComponent extends Component<{}, IMyComponentState> {
  state = { isHot: true }
  render() {
    const { isHot } = this.state
    return <h1 onClick={this.changeWeather}>今天天气很{isHot ? '炎热' : '凉爽'}</h1>
  }

  changeWeather = () => {
    const isHot = this.state.isHot
    this.setState({ isHot: !isHot })
  }
}
```

- 组件中 render 方法里的 this 为组件实例对象
- 组件自定义方法中的 this 为 undefined，可以通过强制绑定 this（使用函数对象的 bind 方法）或者使用箭头函数来解决
- 状态数据不能直接修改或赋值

**setState**

```js
this.setState({comment: 'Hello'});
// 不可以直接使用state对象属性进行更改

// 依赖state和props进行更新时，不能给setState传入对象参数，应该传入函数
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```



### 展开运算符

```js
let arr1 = [1, 3, 5, 7, 9]
let arr2 = [2, 4, 6, 8, 10]
console.log(...arr1) //展开一个数组
let arr3 = [...arr1, ...arr2] //连接数组

//在函数中使用
function sum(...numbers) {
  return numbers.reduce((preValue, currentValue) => {
    return preValue + currentValue
  })
}
console.log(sum(1, 2, 3, 4))

//构造字面量对象时使用展开语法
let person = { name: 'tom', age: 18 }
let person2 = { ...person }
//console.log(...person); //报错，展开运算符不能展开对象
person.name = 'jerry'
console.log(person2)
console.log(person)

//合并
let person3 = { ...person, name: 'jack', address: '地球' }
console.log(person3)
```

在 React 中可以使用展开运算符来传递标签参数

```tsx
function Test() {
  const person: IPersonProps = { name: 'tom', age: 12, sex: '男' }
  return <PersonCeil {...person} />
}
```

## refs 和事件处理

### 回掉形式

```tsx
import { Component } from 'react'

export class Demo extends Component {
  input1: any
  input2: any
  showData = () => {
    const { input1 } = this
    alert(input1.value)
  }

  showData1 = () => {
    const { input2 } = this
    alert(input2.value)
  }

  render() {
    return (
      <div>
        <input ref={c => (this.input1 = c)} type='text' placeholder='点击按钮提示数据' />
        <button onClick={this.showData}>点击提示左侧的数据</button>
        <input ref={c => (this.input2 = c)} onBlur={this.showData1} type='text' placeholder='失去焦点提示' />
      </div>
    )
  }
}
```

### createRef

`createRef`调用后可以返回一个容器，该容器可以存储被 ref 所标识的节点，该容器是“专人专用”

```tsx
import { Component, createRef } from 'react'

export class Demo extends Component {
  input1 = createRef<HTMLInputElement>()
  input2 = createRef<HTMLInputElement>()

  showData = () => {
    alert(this.input1.current?.value)
  }

  showData1 = () => {
    alert(this.input2.current?.value)
  }

  render() {
    return (
      <div>
        <input ref={this.input1} type='text' placeholder='点击按钮提示数据' />
        <button onClick={this.showData}>点击提示左侧的数据</button>
        <input onBlur={this.showData1} ref={this.input2} type='text' placeholder='失去焦点提示' />
      </div>
    )
  }
}
```

## 事件处理

(1).通过 onXxx 属性指定事件处理函数(注意大小写)
a.React 使用的是自定义(合成)事件, 而不是使用的原生 DOM 事件 —————— 为了更好的兼容性
b.React 中的事件是通过事件委托方式处理的(委托给组件最外层的元素) ————————为了的高效
(2).通过 event.target 得到发生事件的 DOM 元素对象 ——————————不要过度使用 ref

```tsx
```
