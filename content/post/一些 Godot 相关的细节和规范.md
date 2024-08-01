---
title: 一些 Godot 相关的细节和规范
date: 2024-06-08
tags: 
    - Godot
categories:
    - Dev
---

### 规范

- 脚本内的 set 方法总是遵循以下写法：

```python
var variable : type:
    set(new_value):
        # 首先更新 variable 的值
        variable = new_value
        # 之后的代码中均使用更新后的 variable，而不是 new_value
```

### 细节

#### 动画状态机

- AnimationTree 节点的 Expression 只能检查目标脚本内的类型以及变量
  
  我遇到的情况是，将枚举类型定义在其他脚本，则 Expression 无法正确识别类型，导致无法正确判断对应的条件

#### 安卓导出

- Android Studio 设置代理后仍然无法下载依赖（依赖缺失会直接导致安卓导出失败）
  
  解决方法：将项目和用户本地的 gradle.properties 文件中的代理配置移除掉

- 导出到模拟器运行时闪退
  
  解决方法：将渲染模式改为兼容模式（Compatibility）


