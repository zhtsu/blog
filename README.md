# blog · latest

站点重构分支：**一套不依赖任何现成主题的 Hugo 模板**，视觉按 `temp/web/` 那版静态站还原，并在此之上做了扩展。

旧内容与 Stack 主题已在本分支移除，历史数据仍完整保留在 `main` 分支。

## 设计还原

原站（`temp/web/index.html` + `css/index-style.css`）是一份 Bootstrap 3 的手写静态页：`#dadada` 底色、`#f8f8f8` 卡片、`5px` 圆角、`0 3px 7px rgb(0 0 0 / 15%)` 阴影、`1040px` 定宽，左列文章卡片 + 右列标签/友链卡片。这些取值被原样搬进了 `assets/css/variables.css` 的 CSS 变量：

```css
--max-width: 1040px;
--card-color: #f8f8f8;
--card-font-color: #777777;
--card-radius: 5px;
--card-shadow: 0px 3px 7px 0px rgb(0 0 0 / 15%);
--card-hover-shadow: 0px 3px 7px 0px rgb(0 0 0 / 35%);
```

差异只有两处是刻意改的：

- 原站用 `float` 做左右分栏（79% + 20%），这里改成 flex + gap，避免那 1% 造成的对不齐，同时窄屏能直接降级为单列；
- 原站 `.article-item` 写死 `height: 100px`，有摘要/标签时会溢出，这里改成 `min-height` + `padding`，密度保持一致。

## 扩展的部分

| 功能 | 原站 | 现在 |
| --- | --- | --- |
| 响应式 | 无，1040px 定宽，手机上挤成一团 | 768px 断点，侧栏折到正文下方，导航变汉堡菜单 |
| 暗色模式 | 无 | CSS 变量整体切换，跟随系统或手动选择，localStorage 持久化，首屏无白闪 |
| 分页 | 7 个 `#` 假链接 | Hugo 真实分页器（首页/上页/页码/下页/末页） |
| 标签分类 | JS 里硬编码、页面是空壳 | Hugo taxonomy 真实页面 + 词条总览网格 |
| 文章详情页 | 无 | 完整正文排版、目录滚动高亮、上下篇、代码块横向滚动、宽表格自适应 |
| 搜索 | 死表单，无后端 | 构建期生成 `/search.json`，前端按权重全文检索 |
| 看板娘 | CDN 加载 | 资源本地 vendor 到 `static/live2d/`，离线可用，可一键关闭，尊重 reduced-motion |
| 图标 | font-awesome + glyphicons | 内联 SVG sprite，零字体依赖，可随主题换色 |

## 目录结构

```
config/_default/
  config.toml      站点基础 + taxonomy + 输出格式（SearchIndex）
  params.toml      所有可调参数：导航、友链、个人卡片、看板娘、暗色模式
  markup.toml      goldmark + 代码高亮 + 目录层级
layouts/
  _default/
    baseof.html            骨架：head / header / 主体 / footer / 脚本
    list.html              通用列表（含 taxonomy 总览与词条页）
    single.html            文章详情页
    archives.html          归档时间线
    search.html            搜索页
    index.searchindex.json 搜索索引模板（名字必须带输出格式名）
  index.html               首页
  post/list.html           文章栏目页
  partials/                head / header / footer / sidebar / article-card / pagination / toc / live2d …
assets/
  css/  variables → base → layout → components → content → dark → bootstrap-fix → chroma
  js/   theme / nav / toc / search / live2d-loader
static/
  live2d/              看板娘整套资源（含上游 LICENSE）
  favicon.png
content/
  _index.md            首页简介
  post/                文章（每篇一个目录 + index.md）
  archives/ search/ about/
```

## 本地开发

```bash
hugo server -D          # http://localhost:1313
hugo --gc --minify      # 生产构建
```

Hugo 版本：本仓库在 `0.108.0`（extended）上验证通过。注意 `hugo server` **没有** `--renderToMemory` 这个旗标，别照抄新版文档。

## 写文章

```bash
hugo new content/post/文章标题/index.md
```

front matter 可用字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | string | 标题 |
| `date` | date | 发布日期 |
| `lastmod` | date | 与 `date` 不同时会额外显示"最后更新" |
| `categories` | array | 分类，生成 `/categories/xxx/` |
| `tags` | array | 标签，生成 `/tags/xxx/` |
| `pinned` | bool | 置顶：卡片带角标，并进入侧栏"推荐文章" |
| `recommend` | bool | 只进侧栏"推荐文章" |
| `summary` | string | 卡片摘要，不写则由 Hugo 自动截取 |
| `description` | string | `<meta name="description">` 与 og 标签 |

参数都在 `config/_default/params.toml`，不需要改模板。

## 几个容易踩的坑（都已在代码里注释）

- **`assets/` 下的静态资源必须过 Hugo Pipes**。`assets/js/*.js` 不会自动出现在 `public/`，直接写 `<script src="/js/foo.js">` 会静默 404。`baseof.html` 里统一走 `resources.Concat | minify | fingerprint`。
- **搜索索引的模板名必须带输出格式名**。`config.toml` 里定义 `[outputFormats.SearchIndex]`（baseName = `search`），模板就得叫 `index.searchindex.json`，Hugo 才找得到；否则会退化成 `index.json`，而前端拿的是 `/search.json`。
- **索引正文用 `.RawContent` 而不是 `.Content`**。后者是渲染后的 HTML，代码块里的引号会先被转成 `&#34;` 再被 JSON 二次转义成 `&amp;#34;`。
- **dark chroma 配色靠模板作用域**。`assets/css/chroma-dark.css` 里带 `{{` 模板，由 `resources.ExecuteAsTemplate` 套上 `[data-theme="dark"]` 前缀；直接 `replaceRE` 加前缀在这版 Hugo 上不生效。

## 部署

`.github/workflows/hugo.yml` 目前只在 `main` 分支推送时触发。要让本分支发布，需要改 workflow 的 `on.push.branches`，并在仓库 Pages 设置里确认发布分支——这一步没动，留给你决定。

## 许可

看板娘资源来自 [live2d-widget](https://github.com/stevenjoezhang/live2d-widget)，其许可证随资源放在 `static/live2d/LICENSE`。
