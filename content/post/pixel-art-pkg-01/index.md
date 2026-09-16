---
title: 像素画合集（一）
date: 2022-12-08
slug: pixel-art-01
image: cover-08.png
description: 2022 到 2023 年画的像素画合集，有些做成了动图。
# 这批 sprite 是作品本身，保持原文件（不转 WebP、不缩放）：
# 转 q80 会在线条边缘留一圈杂色，overlord.png 甚至反而变大（1637 → 2074 字节）。
# GIF 不用列在这里，动图本来就不转（见 layouts/partials/img-convertible.html）。
# 这批图全在表格里，而表格单元格收不到 {.raw} 属性列表，所以只能用这个列表。
keepOriginal:
    - backpack-boy.png
    - elf.png
    - mr.mouse.png
    - overlord.png
    - placeholder.png
    - rabbit.png
# 原样输出后仍按 320 宽排版：elf.png 是 640px 的 2x 图，
# 不封顶会以两倍宽显示、把表格撑开。
pixelArt: true
img1x: 320
tags: 
    - PixelArt
categories:
    - Art
---

## 2023

| ![Horn](horn.gif)         | ![Insect Girl](insect_girl.gif) | ![Squid Hornet](squid_hornet.gif) | ![ELF](elf.png) |
| ------------------------- | ------------------------------- | --------------------------------- | --------------- |
| ![Overlord](overlord.png) |                                 |                                   |                                                   |

## 2022

| ![backpack-boy.png](backpack-boy.png) | ![mr.mouse.png](mr.mouse.png) | ![rabbit.png](rabbit.png) | ![Placeholder](placeholder.png) |
| ------------------------------------- | ----------------------------- | ------------------------- | ------------------------------- |

