---
title: Kotlin笔记
date: 2021-05-15
sidebar: 'auto'
categories:
  - 客户端
tags:
  - Kotlin
---

## 变量

使用`var`声明变量，`val`声明常量。

```kotlin
var a: Int = 10
```

kotlin 完全抛弃了 java 中的基本类型，全部使用了对象数据类型。

## 数组

|          |    Kotlin     | Java        |
| :------: | :-----------: | ----------- |
|   整型   |   IntArray    | int[]       |
| 整型装箱 |  Array<Int>   | Integer[]   |
|   字符   |   CharArray   | char[]      |
| 字符装箱 |  Array<Char>  | Character[] |
|  字符串  | Array<String> | String[]    |

数组的创建

```kotlin
val c0 = intArrayOf(1, 2, 3, 4)
val c1 = IntArray(5) { it + 1 }
println(c1.contentToString()) // [1, 2, 3, 4, 5] 便捷打印
```

 数组遍历

```kotlin
val e = floatArrayOf(1f, 2f, 3f)
for(element in e) {
        println(element)
}
e.forEach { element -> println(element) }
e.forEach { println(it) }

if( 1f in e ) { 
  // ...
}
```

## 集合框架

集合实现类复用与类型别名

```kotlin
typealias ArrayList<E> = java.util.ArrayList<E>
typealias LinkedHashMap<K, V> = java.util.LinkedHashMap<K, V>
typealias HashMap<K, V> = java.util.HashMap<K, V>
typealias LinkedHashSet<E> = java.util.LinkedHashSet<E>
typealias HashSet<E> = java.util.HashSet<E>
```

集合修改

```kotlin
for(i in 0..10) {
    stringList += "num:$i"
    stringList1 -= "num:$i"
}
stringList[5] = "Hello"

val map = HashMap<String, Int>()
map["Hello"] = 10
```

Pair

```kotlin
val pair = "Hello" to "Kotlin"
val pair2 = Pair("Hello", "Kotlin")
val first = pair.first
val second = pair.second
val (x,y) = pair // 解构赋值
```

Triple

```kotlin
val triple = Triple("x", 2, 3.0)
val first = triple.first
val second = triple.second
vail third = triple.third
val(x, y, z) = triple
```



## 函数

当一个函数里只有一行代码的时候，kotlin 允许我们不必写函数体。

```kotlin
fun largerNumber(num1: Int, num2: Int): Int = max(num1, num2)
```

函数类型

```kotlin
fun foo(){}  // () -> Unit
fun foo(p0:Int): String {}   // (Int) -> String

// Foo 是 bar方法的receiver
class Foo {
    fun bar(p0: String, p1: Long): Any{}   // Foo.(Stirng, Long) -> Any
}									   //  (Foo, String, Long) -> Any
```

函数引用

函数引用类似于C语言中的函数指针，可用于函数传递

```kotlin
fun foo() {}			// ::foo  val f:()-> Unit = :for
fun foo(p0:Int): String {}	// ::foo val g: (Int) -> String = :foo

class Foo {
    fun bar(p0: String, p1: Long): Any{} // Foo::bar val h: (Foo, String, Long)-> Any = Foo::bar
}
```

默认参数

```kotlin
fun defaultParameter(x:Int, y:String, z:Long = 0L) {
    // TODO()
}
```



## 程序的逻辑控制

### if 条件语句

Kotlin 里的 if 语句相对于 java 中的有一个额外的功能，它是可以有返回值的。

```kotlin
fun largerNumber(num1: Int, num2: Int): Int {
    return if (num1 > num2) {
        num1
    } else {
        num2
    }
}
```

### when 条件语句

when 有点类似于 java 里的 switch，但是又远比 switch 强大的多。

```kotlin
fun getScore(name: String) = when (name) {
    "Tom" -> 86
    "Jim" -> 77
    "Jack" -> 95
    else -> 0
}
```

when 语句允许传入一个任意类型的数据，参数，然后再 when 的结构体中定义一系列的条件，格式为`匹配值 -> { 执行逻辑 }`，逻辑只有一行时，`{}`可以省略。

除了进行精准匹配，when 还可以进行类型匹配。

```kotlin
fun checkNum(num: Number) {
    when (num) {
        is Int -> println("Int")
        is Double -> println("Double")
        else -> println("not support")
    }
}
```

is 相当于 java 中的 instanceof 关键字。Number 是 kotlin 里的一个抽象类，Int、Double、Long 等都是它的子类。

when 还有一种不带参数的用法。

```kotlin
fun getScore(name: String) = when {
    name.startsWith("Tom") -> 86
    name == "Jim" -> 77
    name == "Jack" -> 95
    else -> 0
}
```

## 循环

在 kotlin 中表示一个区间

双端闭区间

```kotlin
val range = 0..10
val charRange = 'a'..'z'
val longRange = 1L..100L // 连续区间
```

单端闭区间

```kotlin
var range = 0 util 10
```

降序区间

```kotlin
var range = 10 downTo 1
```

区间的应用

```kotlin
val array = intArrayOf(1, 3, 5, 7)
for(i in 0 until array.size) {
    println(array[i])
}
// indices返回[0, array.size)
for(i in array.indices) {
    println(array[i])
}
```

基本 for-in 循环的使用

```kotlin
fun main(args: Array<String>) {
    for (i in 0..10) {
        println(i)
    }
	for (i in 0 util 10 step 2) {
      	println(i)
    }
}
```

## 中缀表达式

```kotlin
infix fun String.rotate(count: Int): String {
    val index = count % length
    return this.substring(index) + this.substring(0, index)
}
```

加上`infix`关键词之后，可以通过以下方式调用`rotate`函数

```kotlin
println("HelloWorld" rotate 5)
```

## 面向对象编程

### 类与对象

```kotlin
// 默认都是public
class Person {
  var name = ""
  var age = 0

  fun eat() {
    println(name + " is eating. He is " + age + " years old.")
  }
}

fun main() {
  val p = Person()
  p.name = "Jack"
  p.age = 19
  p.eat()
}
```

构造方法

```kotlin
class SimpleClass {
    var x:Int
    constructor(x:Int) {
        this.x = x
    }
}
```



### 继承

默认所有的非抽象类都是不可继承的。抽象类本身是无法创建实例的，一定要子类去继承它才能创建实例，因此抽象类必须被继承才行，不然就没有意义。通过给 Person 添加`open`关键词，才可以被继承。

```kotlin
open class Person {
  // ...
}
```

让 Student 类继承 Person 类

```kotlin
class Student : Person() {
  var sno = ""
  var grade = 0
}
```

### 构造函数

kotlin 里的构造函数分为两种：主构造函数和次构造函数。

主构造函数就是最常用的构造函数，每个类默认都有一个不带参数的主构造函数，当然也可以显示的给它指明参数。主构造函数没有函数体，直接定义在类名后面即可。

```kotlin
class Student(val sno: String, val grade: Int) : Person() {

}

val student = Student("a123", 5)
```

由于主构造函数没有函数体，如果我们需要在主构造函数里写一些逻辑的话，需要使用`init`函数。

```kotlin
class Student(val sno: String, val grade: Int) : Person() {
  init {
    println("sno is " + sno)
    println("grade is " + grade)
  }
}
```

根据继承特性的规定，子类的构造函数必须调用父类的构造函数，子类的主构造函数调用父类中的哪个构造函数，在继承的时候通过括号指定。

次构造函数是通过 constructor 关键词定义，它是有函数体的。当一个类既有主构造函数又有次构造函数的时候，所有的次构造函数都必须调用主构造函数（包括间接调用）。

```kotlin
class Student(val sno: String, val grade: Int, name: String, age: Int) : Person(name, age) {
  constructor(name: String, age: Int) : this("", 0, name, age){
  }
}
```

### 接口

kotlin 允许在接口中定义的函数里进行默认实现，jdk1.8 之后也开始支持这个功能了。

```kotlin
interface Study {
  fun readBooks()

  fun doHomeWork() {
    println("do homework default")
  }
}

class Student(name: String, age: Int): Person(name, age), Study {
  override fun readBooks() {
    println(name + " is reading.")
  }
}
```

### 数据类和单例类

创建数据类

```kotlin
data class Cellphone(val brand: String, val price: Double)
```

添加`data`关键字之后，kotlin 会根据主构造函数中的参数帮我们将`equals()`、`hashCode()`、`toString()`等固定方法自动生成。

创建单例类

```kotlin
object Singleton {}
```

只需要把 class 关键字换成 object 就可以创建一个单例类

### lambda 编程

初始化集合

```kotlin
val list = listOf("Apple", "Banana", "Orange")
for( fruit in list) {
  println(fruit)
}
```

`listOf()`函数创建的集合是不可变的，也就是它只能用于读取操作。如果想创建可变集合，可以使用`mutableListOf()`函数。set 的基本使用和 list 相似。

map 的基本使用

```kotlin
val map = mapOf("Apple" to 1, "Orange" to 2)
for((fruit, number) in map) {
  // ...
}
```

#### 集合的函数式 API

```kotlin
val list = listOf("Apple", "orange", "Pear", "Grape")
val maxLengthFruit = list.maxByOrNull { it.length }
println(maxLengthFruit)
```

lambda 表达式结构

> {参数名 1: 参数类型, 参数名 2: 参数类型 -> 函数体 }

```kotlin
val maxLengthFruit = list.maxBy({ fruit: String -> fruit.length })
```

然后 Kotlin 规定，当 Lambda 参数是函数的最后一个参数时，可以将 Lambda 表达式移到函数括 号的外面，如下所示:

```kotlin
val maxLengthFruit = list.maxBy() { fruit: String -> fruit.length }
```

接下来，如果 Lambda 参数是函数的唯一一个参数的话，还可以将函数的括号省略:

```kotlin
val maxLengthFruit = list.maxBy { fruit: String -> fruit.length }
```

当 Lambda 表达式的参数列表中只有一个参数时，也不必声明参数名，而是可以使用 it 关键字来代替，那么代码就变成了:

```kotlin
val maxLengthFruit = list.maxBy { it.length }
```

## 高阶函数

参数类型包含函数类型或返回值类型为函数类型的函数为高阶函数

接收函数类型

```kotlin
fun cost(block: () -> Unit) {
    val start = System.currentTimeMillis()
    block()
    println(System.currentTimeMillis() - start)
}

fun main() {
    cost{
        for (i in 0..10) {
            println(i)
        }
    }
}
```

返回函数类型

```kotlin
```

