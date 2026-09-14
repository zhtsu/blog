---
title: "这个主题怎么用"
date: 2026-09-14
lastmod: 2026-09-15
categories: ["开发"]
tags: ["Hugo", "前端"]
pinned: true
recommend: true
summary: "一篇演示用的说明文，顺便把代码块、表格、引用、目录这些正文元素的样式都跑一遍。"
---

这是一篇演示文章，用来验证正文页的排版，同时也是这个主题的快速上手说明。

## 目录从哪来

正文页的目录由 Hugo 的 `.TableOfContents` 生成，配置在 `config/_default/markup.toml`：

```toml
[tableOfContents]
  startLevel = 2
  endLevel = 4
  ordered = false
```

滚动时右侧目录项会高亮，逻辑在 `assets/js/toc.js`。

## 新建一篇文章

在 `content/post/` 下建一个目录，里面放 `index.md`：

```bash
hugo new content/post/我的新文章/index.md
```

front matter 支持的字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | string | 标题，显示在卡片和正文页 |
| `date` | date | 发布日期 |
| `lastmod` | date | 最后更新，与 `date` 不同时会额外显示一行 |
| `categories` | array | 分类，会生成 `/categories/xxx/` |
| `tags` | array | 标签，会生成 `/tags/xxx/` |
| `pinned` | bool | 置顶，卡片上有角标，并进入侧栏「推荐文章」 |
| `recommend` | bool | 只进侧栏「推荐文章」，不加角标 |
| `summary` | string | 手动指定卡片摘要，不写则由 Hugo 自动截取 |
| `description` | string | 用于 `<meta name="description">` 和 og 标签 |

## 代码块

行内代码长这样：`hugo server -D`。围栏代码块带语法高亮，配色由 `hugo gen chromastyles` 生成：

```go
package main

import "fmt"

// 一个没什么用的例子
func main() {
	names := []string{"摆", "大", "新", "青", "年"}
	for i, n := range names {
		fmt.Printf("%d: %s\n", i, n)
	}
}
```

## 引用和列表

> 卡片的视觉语言来自原站：`#f8f8f8` 底色、5px 圆角、`0 3px 7px rgb(0 0 0 / 15%)` 阴影。
> 暗色模式下只是把令牌换掉，组件层一行没改。

无序列表：

- 响应式断点 768px，低于此宽度侧栏折到正文下方
- 导航栏在该断点变成汉堡菜单
- 看板娘在低于 `params.live2d.minWidth` 时不加载

有序列表：

1. 改 `config/_default/params.toml` 里的站点信息
2. 替换 `static/favicon.png`
3. 写文章，`hugo server` 本地预览

## 搜索

搜索索引是构建产物 `/search.json`，模板在 `layouts/_default/index.searchindex.json`。
输出格式 `SearchIndex` 定义在 `config/_default/config.toml`，baseName 设为 `search`，所以文件名是 `search.json` 而不是默认的 `index.json`。
索引字段包含标题、标签、分类、摘要和正文纯文本。前端在 `assets/js/search.js` 里按权重打分：标题 10 分、标签 4 分、分类 2 分、正文 1 分，多个关键词必须全部命中。
