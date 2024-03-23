---
title: CPP 局部静态变量
date: 2022-07-09
tags: 
    - CPP
categories:
    - Dev
---

看几个例子：

连续调用 PrintCount 函数 3 次，会输出什么结果？

## 第一个例子

```cpp
// 例子一

void PrintCount()
{
    int count = 0;
    count++;
    std::cout << count << " ";
}

// 输出结果：1 1 1
```

## 第二个例子

```cpp
// 例子二

void PrintCount()
{
    static int count = 0;
    count++;
    std::cout << count << " ";
}

// 输出结果：1 2 3
```

纳尼！？

在变量面前加了 static 关键字修饰居然会变成这样，这难道不是和以下代码一样么？

```cpp

int count = 0;

void PrintCount()
{
    count++;
    std::cout << count << " ";
}

// 输出结果：1 2 3
```

然而，事实是

完全不一样！

## 结论

例子一不多赘述。

例子二中的 count 是全局变量，也是显而易见的。

例子三呢？也是个全局变量吗？

哒咩❌

例子三中的 count 仍然是个局部变量，也就是说这个 count 的作用域仍然只在 PrintCount 函数中。

不一样的是，这个 count 会一直存在，而不会像例子一中那样每一次函数调用都会被重新定义，也不会在函数调用完成时被释放。

其中比较迷惑的一点，是这个变量的初始化操作，只会进行一次，也就是说，例子三中的 “ = 0” 这个操作，只会发生在函数第一次被调用时，以进行初始化操作。
