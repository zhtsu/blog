---
title: 重装电脑系统时我会做这些事情
date: 2024-06-08
image: cover-01.png
tags: 
    - Essay
categories:
    - Dev
---

#### 确保用户名不包含中文

用户名中包含中文时，可能会在未来的某个时刻给开发带来难以解决的问题，所以必须避免，如果用户名中已经包含了中文，也不用担心，不用重装系统，可以通过新建用户来更名，不过新建的用户配置跟刚重装系统差不多，所以还是一开始就不包含中文比较好

#### 合并磁盘分区

合并所有能够合并的磁盘分区，如果电脑只有一块固态，并且被分为了C盘和D盘，那么我会将D盘移除，合并到C盘中，许多人喜欢使用磁盘分区来管理自己的文件，比如分出“文件盘”和“游戏盘”这样子功能特化的盘，我并不喜欢这样做，我更喜欢使用文件夹来做这件事

#### 建立可移动的用户根目录

在将硬盘合并后，需要使用文件夹来管理自己的文件，我喜欢在C盘根目录下新建一个root目录，然后再在这里面放置各种文件，比如我会新建一个path目录，用来存放各种非安装版本的电脑环境，然后新建一个portable目录用来存放各种非安装版本的软件，总之会确保这个root目录不会对电脑产生任何依赖，这样子就可以确保这个root目录在被移动或拷贝到其他电脑后，不会产生任何损坏

至于只有安装版本的环境或软件，我会在C盘根目录下新建一个installed目录，然后在安装时选择自定义安装，安装到这个installed目录

#### 设置Win+R快捷键目录

我还会在C盘根目录新建一个shortcuts目录，然后将需要添加到环境的快捷方式存放在这里，我会将这些快捷方式用简短的字母命名，最后将这个目录添加到环境变量中，这样一来，就可以使用Win+R唤出运行窗口，然后键入快捷方式的名字，回车，就启动了对应的快捷方式

#### 固定常用软件到开始屏幕

虽然可以将常用的软件或目录全部存放到shortcuts目录中，但是我还是会将一些固定到开始屏幕，没有什么特别的原因，只是我个人认为这样做会更加方便，比如计算器，记事本什么的，我会固定到开始屏幕

#### 固定常用软件到任务栏

将需要频繁使用的软件固定到任务栏，方便直接使用鼠标左键点击打开，我通常只会固定两个软件：文件资源管理器和Chrome

#### 更换桌面壁纸

壁纸是电脑的门面，一定程度上影响着用户的使用体验，我一般会使用一张自己喜欢的图片作为壁纸，很多人喜欢使用WallpaperEngine来设置更酷炫的壁纸，我也很想，不过笔记本性能不允许，所以就一直保持着使用图片作为壁纸的习惯

WallpaperEngine在开机启动时会延迟一会才显示壁纸，我感觉这点也不太好

如果可以的话，把锁屏界面改成和桌面壁纸相同的图片，也是不错的选择

#### 桌面开启小图标

在小分辨率的电脑桌面上，大图标或中等图标占据了不小的面积，我个人不喜欢这些图标太过抢眼，我的桌面的图标数量通常接近于零，只留必要的几个（通常是一个，我的电脑）

#### 设置桌面默认显示图标

系统默认桌面有一些无法直接移除的图标，回收站、控制面板、我的电脑等，我通常只会保留我的电脑，因为经常需要对我的电脑使用鼠标右键，放在其他位置也不方便

#### 设置文件资源管理器

文件扩展名和隐藏的项目是必须要查看的

最经常用什么的是绝对不显示的



> 到这基本上设置完成了，每个人使用电脑的习惯不同，仁者见仁，智者见智
