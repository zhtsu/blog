---
title: 使用游戏引擎时的细节和规范
date: 2024-12-19
image: geass.png
tags: 
    - Unreal
categories:
    - Dev
---

## UE

### 细节

#### UMG

- 在场景内使用了3DUI（WidgetComponent）时，并且将3DUI的渲染空间设置为Screen，如果在运行时有任何DrawDebug函数同时在运行，会导致3DUI在屏幕空间的位置计算出现非常严重的偏移

- UUserWidget 中用 C++ 编写的 Construct 和 Tick 会覆盖蓝图中对应的生命周期函数，而不是像其他 Actor 一样同时运行

## Godot

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
  
- 打包后的安卓程序无法正常获取安卓插件实例

  可能的原因：Godot 中的安卓导出插件的 _get_name 方法与安卓插件的 getPluginName 的返回值不同
