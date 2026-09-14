---
title: "一篇排版测试"
date: 2026-08-02
categories: ["随笔"]
tags: ["随笔"]
summary: "故意塞进长代码、宽表格和长链接，检查卡片和正文在极端内容下会不会被撑破。"
---

这篇什么都不讲，只放几个容易把布局撑坏的极端内容。

## 超长代码行

```bash
hugo --gc --minify --baseURL "https://example.com/" --destination public --cleanDestinationDir --printPathWarnings --templateMetrics --templateMetricsHints
```

代码块应该横向滚动，而不是把卡片顶宽。

## 宽表格

| 列一 | 列二 | 列三 | 列四 |
| --- | --- | --- | --- |
| 内容内容内容 | 内容内容内容 | 内容内容内容 | 内容内容内容 |
| 一段比较长的内容用来把表格撑开 | 一段比较长的内容 | 一段比较长的内容 | 一段比较长的内容 |

## 超长链接

[Hugo 的模板查找顺序文档](https://gohugo.io/templates/lookup-order/) 这种长链接也不应该溢出。

## 图片

图片会自动居中、加圆角，并限制在卡片宽度内。本地图片放进文章目录，用相对路径引用即可：

```markdown
![说明文字](cover.png)
```
