---
title: Golang常用库使用
date: 2022-05-09
categories:
  - 后端
tags:
  - Go
---

## 字符串操作

```go
func main() {
 a := "Hello"
 fmt.Println(strings.Contains(a, "ll"))                // true
 fmt.Println(strings.Count(a, "l"))                    // 2
 fmt.Println(strings.HasPrefix(a, "he"))               // false
 fmt.Println(strings.HasSuffix(a, "lo"))               // true
 fmt.Println(strings.Index(a, "ll"))                   // 2
 fmt.Println(strings.Join([]string{"he", "llo"}, "-")) // he-llo
 fmt.Println(strings.Repeat(a, 2))
 fmt.Println(strings.Replace(a, "e", "E", -1))
 fmt.Println(strings.Split("a-b-c", "-"))
 fmt.Println(strings.ToUpper(a))
 fmt.Println(strings.ToLower(a))
 fmt.Println(len(a))
}
```

## 格式化操作

```go
func main() {
 s := "hello"
 n := 123
 p := point{n, 2}
 fmt.Println(s, n) // hello 123
 fmt.Println(p)    // {123 2}

 fmt.Printf("s=%v\n", s)  // s=hello
 fmt.Printf("n=%v\n", n)  // n=123
 fmt.Printf("p=%v\n", p)  // p={123 2}
 fmt.Printf("p=%+v\n", p) // p={x:123 y:2}
 fmt.Printf("p=%#v\n", p) // p=main.point{x:123, y:2}

 f := 3.141592653
 fmt.Println(f)
 fmt.Printf("%.2f\n", f)
}
```

## JSON 处理

```go
import (
 "encoding/json"
 "fmt"
)

type userInfo struct {
 Name  string
 Age   int `json:"age"`
 Hobby []string
}

func main() {
 a := userInfo{Name: "wang", Age: 18, Hobby: []string{"Golang", "Typescript"}}
 buf, err := json.Marshal(a)
 if err != nil {
  panic(err)
 }
 fmt.Println(buf)
 fmt.Println(string(buf))

 buf, err = json.MarshalIndent(a, "", "\t")
 if err != nil {
  panic(err)
 }
 fmt.Println(string(buf))

 var b userInfo
 err = json.Unmarshal(buf, &b)
 if err != nil {
  panic(err)
 }
 fmt.Printf("%#v\n", b)
}
```

## 时间处理

```go
import (
 "fmt"
 "time"
)

func main() {
 now := time.Now()
 // now: 2022-05-13 20:31:52.23901 +0800 CST m=+0.000067767
 fmt.Printf("now: %v\n", now)
 t := time.Date(2022, 3, 27, 1, 25, 36, 0, time.UTC)
 t2 := time.Date(2022, 3, 27, 2, 30, 36, 0, time.UTC)
 // t: 2022-03-27 01:25:36 +0000 UTC
 fmt.Printf("t: %v\n", t)
 // 2022 March 27 1 25
 fmt.Println(t.Year(), t.Month(), t.Day(), t.Hour(), t.Minute())
 // format参数为解析的格式 2022-03-27 01:25:36
 fmt.Println(t.Format("2006-01-02 15:04:05"))
 diff := t2.Sub(t)
 // 1h5m0s
 fmt.Println(diff)
 // 65 3900
 fmt.Println(diff.Minutes(), diff.Seconds())
 // 第一个参数是layout，第二个才是需要解析的时间
 t3, err := time.Parse("2006-01-02 15:04:05", "2022-03-27 01:25:36")
 if err != nil {s
  panic(err)
 }
 fmt.Println(t3 == t)    // true
 fmt.Println(now.Unix()) // 1652445112
}
```

## 数字解析

```go
import (
 "fmt"
 "strconv"
)

func main() {
 f, _ := strconv.ParseFloat("1.234", 64)
 fmt.Printf("f: %v\n", f) //1.234

 // 第二个参数表示进制，第三个参数表示几位
 n, _ := strconv.ParseInt("111", 10, 64)
 fmt.Printf("n: %v\n", n) // 111

 n, _ = strconv.ParseInt("0x1000", 0, 64)
 fmt.Printf("n: %v\n", n) // 4096

 n2, _ := strconv.Atoi("123")
 fmt.Printf("n2: %v\n", n2) // 123

 _, err := strconv.Atoi("AAA")
 fmt.Printf("err: %v\n", err) // err: strconv.Atoi: parsing "AAA": invalid syntax
}
```

## 进程信息

```go
import (
 "fmt"
 "os"
 "os/exec"
)

func main() {
 // [/var/folders/s1/ljcj92w94055qsdfm_2q6_5r0000gn/T/go-build874355458/b001/exe/main]
 fmt.Println(os.Args)
 fmt.Println(os.Getenv("PATH"))
 fmt.Println(os.Setenv("AA", "BB"))
 buf, err := exec.Command("grep", "127.0.0.1", "etc/hosts").CombinedOutput()
 if err != nil {
  panic(err)
 }
 fmt.Println(string(buf))
}
```
