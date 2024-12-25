---
title: 一些Unreal相关的细节和规范
date: 2024-12-19
image: geass.png
tags: 
    - Unreal
categories:
    - Dev
---

### 细节

#### UMG

- 在场景内使用了3DUI（WidgetComponent）时，并且将3DUI的渲染空间设置为Screen，如果在运行时有任何DrawDebug函数同时在运行，会导致3DUI在屏幕空间的位置计算出现非常严重的偏移

- UUserWidget 中用 C++ 编写的 Construct 和 Tick 会覆盖蓝图中对应的生命周期函数，而不是像其他 Actor 一样同时运行
