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

**只借用了设计令牌和整体骨架**（1040px 定宽居中、左列表右侧栏、卡片底色与圆角）。
组件本身按游戏 UI 的思路重做，不照搬原站那套 Bootstrap 默认态：

- **交互状态**：hover 只做 2px 位移 + 阴影加深 + 封面轻微推近，过渡 160ms；
  当前栏目用实心高亮；原站按钮那种"默认态 + 无位移反馈"的做法已全部移除。
- **文章卡片**：改为「封面在左、内容在右」的两栏卡片（窄屏自动上下堆叠）。
  信息按层级排：分类 → 日期 → 标题 → 摘要（两行截断）→ 阅读时长/标签。
  每张卡片用所属分类的配置色作为强调色 `--accent`（顶部细线、分类名、hover 时的标题与箭头）。
- **导航**：保留站名 + 菜单 + 搜索 + 暗色切换；滚动离开页首后底色收紧、阴影加深，
  把导航层和内容层分开。**已去掉原站那个「其他」下拉**——它只是照抄 Bootstrap 的默认交互。

两处骨架上的刻意改动：

- 原站用 `float` 做左右分栏（79% + 20%），这里改成 flex + gap，避免那 1% 造成的对不齐，同时窄屏能直接降级为单列；
- 封面图原站只用于详情页，这里同时用于卡片列表。

## 扩展的部分

| 功能 | 原站 | 现在 |
| --- | --- | --- |
| 响应式 | 无，1040px 定宽，手机上挤成一团 | 768px 断点，侧栏折到正文下方，卡片上下堆叠，导航变汉堡菜单 |
| 暗色模式 | 无 | CSS 变量整体切换，跟随系统或手动选择，localStorage 持久化，首屏无白闪 |
| 分页 | 7 个 `#` 假链接 | Hugo 真实分页器（首页/上页/页码/下页/末页） |
| 文章卡片 | 固定 `height: 100px` 的信息条 | 封面 + 层级化信息布局 + 分类强调色 + 2px 悬浮反馈 |
| 标签分类 | JS 里硬编码、页面是空壳 | Hugo taxonomy 真实页面 + 词条总览网格 |
| 文章详情页 | 无 | 完整正文排版、目录滚动高亮、上下篇、代码块横向滚动、宽表格自适应 |
| 搜索 | 死表单，无后端 | 构建期生成 `/search.json`，前端按权重全文检索 |
| 图标 | font-awesome + glyphicons | 内联 SVG sprite，零字体依赖，可随主题换色 |
| 动效偏好 | 忽略 | 交互与位移全部包在 `prefers-reduced-motion` 与 `(hover: hover)` 里 |

> 原站的 Live2D 看板娘**没有移植**（曾做过一版，后来按要求完整移除：
> `static/live2d/`、`assets/js/live2d-loader.js`、`partials/live2d.html` 及相关参数都已删除）。

## 目录结构

```
config/_default/
  config.toml      站点基础 + taxonomy + 输出格式（SearchIndex）
  params.toml      所有可调参数：导航、友链、个人卡片、暗色模式
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
  partials/                head / header / footer / sidebar / article-card / pagination / toc / cover …
assets/
  css/  variables → base → layout → nav → components → content → dark → bootstrap-fix → chroma
        （层叠顺序写死在 partials/head.html 的 slice 列表里，漏一个就是整层样式消失）
  js/   theme / nav / toc / search
static/
  favicon.png
content/
  _index.md            首页简介
  post/                文章（每篇一个目录 + index.md + 同目录图片）
  categories/          分类定义（含徽章配色）
  archives/ search/
```

## 间距只有一个令牌

`assets/css/variables.css` 里的 `--gap`（12px）是**全站唯一**的间距值：
文章卡片、侧栏卡片、词条横幅、栅格、两栏间隙、页脚全部用它。

曾经拆成 `--gap: 10px` 与 `--card-gap: 20px` 两个值，结果侧栏卡片和分类横幅
比文章卡片、两栏间隙大出一倍，页面看着忽宽忽窄。现在 `--card-gap` 只是
`var(--gap)` 的别名，**改 `--gap` 一处即可整体收放**。

## 顶部导航

顶栏只有「归档」一项，靠右显示（`.nav-menu { margin-left: auto }`）。
首页入口由左上角的站点名承担，不再占菜单项。

## 内容与 main 分支的关系

`latest` 的文章、分类、图片全部从 `main` 迁移而来（9 篇文章 / 9 个标签 / 3 个分类），沿用 main 原有的约定，没有改写 front matter：

- **URL 用 ASCII slug**：`config/_default/permalinks.toml` 里 `post = "/p/:slug/"`。
  每篇文章的 front matter 显式写 `slug`，URL 才是干净的英文路径，
  见下节「文章 URL 用 ASCII slug」。
- **封面图**：文章用 `image: cover-07.png` 指同目录的图片资源（page bundle），模板按页面资源解析
- **分类徽章配色**：`content/categories/<name>/_index.md` 里的 `style.background`，侧栏分类项前的色点直接读它
- **标签大小写**：taxonomy 词条页 URL 由 Hugo 生成（`C++` → `/tags/c++/`），模板里用 `partials/term-url.html` 反查真实地址，**不要自己拼** `tags/` + `urlize(name)`

`temp/web/` 那版静态站只是设计参考，不入库（已在 `.gitignore` 里）。

## 文章 URL 用 ASCII slug

文章按 `post = "/p/:slug/"` 生成路径。`:slug` 默认取**页面目录名**，
而目录是中文，URL 里就会变成 percent-encoding：

```
/p/%E4%BD%BF%E7%94%A8%E6%B8%B8%E6%88%8F%E5%BC%95%E6%93%8E%E6%97%B6%E7%9A%84%E7%BB%86%E8%8A%82%E5%92%8C%E8%A7%84%E8%8C%83/
```

这不影响访问（浏览器与搜索引擎会自动解码），但复制分享时很难看。
所以在每篇文章的 front matter 里显式写 `slug`：

```yaml
---
title: 使用游戏引擎时的细节和规范
date: 2024-12-19
slug: game-engine-notes        # ← 决定 URL，只用小写字母、数字、连字符
---
```

得到 `/p/game-engine-notes/`。**标题保持中文，两者互不影响。**

- **新建文章时务必加上 `slug`**，否则 URL 会退回中文编码形式。
- 目录名可以继续用中文（方便在文件管理器里辨认），也可以直接改成英文，随你。
- **改了 `slug` 等于改了 URL**，旧的链接会 404。本次迁移是主动接受的代价，
  未做跳转；若以后需要保留旧链接，可用 front matter 的 `aliases` 生成跳转页。

## 图片会在构建期自动处理

**你不需要手动压缩图片。** 往文章目录里丢原图即可，Hugo 在构建时负责
缩放、转 WebP、加懒加载。三层处理：

| 位置 | 处理者 | 目标尺寸 |
| --- | --- | --- |
| 卡片封面 | `partials/cover-src.html` | 240 / 480（显示宽 228，出 1x/2x） |
| 详情页封面 | 同上，参数更大 | 960 / 1920（`#main` 定宽 1040） |
| 分类头图 | `partials/term-cover.html` | 416（显示 208 的 2x） |
| 正文插图 | `layouts/_default/_markup/render-image.html` | 1040 / 1920 |

规则：

- **宽度只缩不放**。目标比原图宽时，仍按原宽转 WebP，绝不放大。
- 有 1x/2x 两档时输出 `srcset`，高分屏自动取大图。
- 正文插图一律加 `loading="lazy"`，不阻塞首屏。
- **外链图片原样保留**，不处理（拿不到文件）。
- 处理失败时回退原图，不会让构建挂掉。
- **GIF / APNG 动图不转 WebP**（Hugo 只保留第一帧，动画会丢），原样引用原文件。
  判定规则集中在 `partials/img-convertible.html`，上面三个处理入口都走它，
  以后要放行/挡住别的格式只改这一处。
- **单张图片可以按需保持原样**：`{.raw}` 或 front matter 的 `keepOriginal`，见下节。

### 单张图片保持原样：`{.raw}` / `keepOriginal`

默认所有正文插图都会转 WebP + 缩放。想让某张图**保持原文件**（不转格式、不缩放），
两种写法，效果完全一样：

**写法一：图旁边标 `{.raw}`（推荐）** —— 属性列表必须单独放在图片的**下一行**：

```markdown
![我的动画](horn.gif)
{.raw}
```

**写法二：front matter 列表** —— 图片在表格里、或想集中管理时用：

```yaml
keepOriginal:
    - horn.gif
    - elf.png
```

```markdown
| ![在表格里](horn.gif) |
| --- |
```

实测的几条边界（都踩过）：

- **属性列表只能放下一行，且图片必须独立成行。** 写成
  `前文 ![图](b.png){.raw} 后文` 不会生效，而且 `{.raw}` 会**原样显示在页面上**。
- **表格单元格里的图片收不到属性列表**：`| ![图](c.png){.raw} |` 会被静默忽略
  （连字面量都不剩）。表格里的图请用 `keepOriginal`。
- `keepOriginal` 里写了、但 page bundle 里找不到的条目会打印**构建警告**
  （拼错文件名、图片改过名都靠它兜底），不会静默地"照常压缩"。
- 这规则只管**正文插图**。封面（front matter 的 `image:`）不走渲染钩子，
  依旧按封面尺寸压缩。
- 「原样」指的是**文件**原样，不是按原尺寸铺满页面：排版宽度仍按 `img1x`
  （默认 1040）封顶、宽高按比例算。像素画那篇的 `elf.png` 是 640px 的 2x 图，
  仍然按 320px 排版——不封顶它会以两倍宽把表格撑开。
  读者右键存下来 / 新窗口打开拿到的仍是原文件。
- 效果可自证：产物里那张图的 `src` 直接指向原文件（如 `/p/xxx/horn.gif`），
  且不会为它生成任何 `*_resize_*.webp`。

> 写法一依赖 `config/_default/markup.toml` 里的
> `wrapStandAloneImageWithinParagraph = false`：不开这项，属性列表会挂到
> 外包的 `<p>` 上，渲染钩子只能收到空 map。全站影响已核对——
> 只有独立成行的图片少了一层多余的 `<p>` 包裹，间距不变
> （`p` 的 `margin: 0 0 1em` 本来就小于 `img` 的 `margin: 1.2em auto`，
> 折叠后取大者，包不包都是 `1.2em`）。

### 像素画页面：`pixelArt` + `img1x`

像素画的"细节"就是一个个色块，平滑插值会把它们糊成渐变色，
所以这类页面要多两个参数（见 `content/post/pixel-art-pkg-01/index.md`，
那篇同时还用 `keepOriginal` 把 6 张 sprite 的 PNG 原样留着）：

```yaml
pixelArt: true   # 正文插图加 .img-pixel 类 → image-rendering: pixelated（最近邻缩放）
img1x: 320       # 插图按 1x=320 / 2x=640 生成，并写 width="320" 排版
```

- `pixelArt` 只管渲染质量：高分屏把 320px 的 sprite 放大时，色块边缘保持硬边。
  代价是缩放到非整数倍时色块宽窄会略微不均——比糊掉好。
  封面不走渲染钩子（它由 `cover-src.html` 处理），所以大封面仍走平滑缩放。
- `img1x` 管排版宽度，顺带输出 `width`/`height`（浏览器能提前留位）。
  于是 640px 的 `elf.png` 显示成 320px、高分屏仍取 640 的 2x 图——
  比它原来那句 `<img src="elf.png" style="zoom:50%">` 更好：
  裸 HTML 完全绕过渲染钩子，图片既不会被压缩、也没有 2x 档。
- 宽度**只缩不放**，250px 的图配 `img1x: 320` 依然是 250px。

> 两个实测结论，别再走弯路：
> 1. 本版 Hugo 上 `Resize "… webp lossless"` **不生效**——不报错，但产物仍是
>    有损 VP8（文件名里退回默认 `q75`）。像素画要真正无损只能留 PNG。
> 2. 像素画转 q80 有损 WebP 不一定变小：`overlord.png` 1637 → 2074 字节
>    （调色板 PNG 本来就压得很好，WebP 头开销反而更大）。其余几张是变小的
>    （`elf.png` 4568 → 320px 4014 / 640px 5524 字节）。

### 实际收益

站内原始图片 21.1 MB，其中 9 张封面是 1920×1080 的 PNG、单张最大 4.5 MB，
而卡片上只显示 228px 宽。处理后的**实际下载量**：

```
首页（含第 2 页）       38 KB
全站去重后            1.08 MB
```

### 三个容易踩的坑（都已修）

1. **`gt` 与 `ge`**：判断「原图是否够大」必须用 `ge`。
   封面原宽 1920、2x 目标也是 1920 时，`gt` 为假会退回原始 PNG。
2. **中文文件名要解码**：`.Destination` 里中文是 percent-encoded
   （`python%E5%AE%89...`），直接拿去 `Resources.GetMatch` 匹配不到，
   会**静默**回退原图、且构建不报错。渲染钩子里先用 `urls.Parse`
   取 `.Path` 再匹配。
   同一种坑还有 `![图](./x.png)`：`.Path` 是 `./x.png`，也匹配不到 `x.png`。
   所以取到 `.Path` 之后还要 `path.Clean` 归一化一次（现在两种写法都正常）。
3. **动图转 WebP 会丢动画**：GIF/APNG 走 `Resize "… webp"` 只出第一帧。
   像素画合集（一）那篇的 3 张 GIF 一度被压成静态图——
   `horn.gif` 320×320、321 帧、78KB，产物是 3.1KB 的静态 WebP，
   动画整个消失；而构建成功、图片也能 200，光看构建日志发现不了。
   判定统一收在 `partials/img-convertible.html`：动图（以及不能让
   Hugo 栅格化的 SVG）原样输出，其余照旧转 WebP。

> 构建产物 `public/` 里仍保留一份未被引用的原图——Hugo 会复制 page bundle
> 的全部文件。**访客不会下载它们**，只影响发布产物体积。

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
| `image` | string | 封面图，填同目录下的文件名（如 `cover-07.png`），也支持外链 |
| `pixelArt` | bool | 像素画页面：正文插图按原生像素渲染，高分屏放大不糊色块 |
| `img1x` | int | 正文插图 1x 目标宽（默认 1040，2x 取其两倍），并据此写 `width`/`height` |
| `keepOriginal` | array | 这些正文插图保持原文件、不压缩（表格里的图只能用这个写法） |
| `categories` | array | 分类，生成 `/categories/xxx/` |
| `tags` | array | 标签，生成 `/tags/xxx/` |
| `pinned` | bool | 置顶：卡片上显示角标 |
| `summary` | string | 卡片摘要；同时写 `description` 时以后者优先 |
| `description` | string | 卡片摘要 + `<meta name="description">` + og 标签 |

封面图开关是 `params.toml` 里的 `showCover`。

### 「推荐文章」是特殊标签

侧栏「推荐文章」卡片由**标签**驱动，标签名在 `params.toml`：

```toml
[recommend]
  tag = "推荐文章"
```

给文章 front matter 的 `tags` 加上这个名字即可进卡片（按日期倒序，最多 5 条）：

```yaml
tags:
    - GameDev
    - 推荐文章
```

它被当作**内部标记**，而不是普通标签，所以：

- 不出现在文章卡片的标签 chip、正文页标签、侧栏「标签」列表、`/tags/` 总览页里
- 不出现在 `search.json` 的 `tags` 字段里
- `/tags/推荐文章/` 词条页虽然会被构建出来，但**站内没有任何入口链接到它**（保留可用，不对外暴露）

过滤逻辑集中在两个 partial：`rec-tag-name.html`（标签名唯一入口）与 `tags-public.html`（过滤列表）。
要换标签名，只改 `params.toml` 一处。

> 一篇都没打这个标签时，卡片回落显示**最新文章**，标题自动切换。

参数都在 `config/_default/params.toml`，不需要改模板。

## 几个容易踩的坑（都已在代码里注释）

- **`assets/` 下的静态资源必须过 Hugo Pipes**。`assets/js/*.js` 不会自动出现在 `public/`，直接写 `<script src="/js/foo.js">` 会静默 404。`baseof.html` 里统一走 `resources.Concat | minify | fingerprint`。
- **搜索索引的模板名必须带输出格式名**。`config.toml` 里定义 `[outputFormats.SearchIndex]`（baseName = `search`），模板就得叫 `index.searchindex.json`，Hugo 才找得到；否则会退化成 `index.json`，而前端拿的是 `/search.json`。
- **索引正文用 `.RawContent` 而不是 `.Content`**。后者是渲染后的 HTML，代码块里的引号会先被转成 `&#34;` 再被 JSON 二次转义成 `&amp;#34;`。
- **dark chroma 配色靠模板作用域**。`assets/css/chroma-dark.css` 里带 `{{` 模板，由 `resources.ExecuteAsTemplate` 套上 `[data-theme="dark"]` 前缀；直接 `replaceRE` 加前缀在这版 Hugo 上不生效。

### 改完样式务必核对产物，别只看构建是否成功

构建成功、页面 HTTP 200，**都不代表 CSS 真的生效**。曾经出过一次事故：写导航样式时路径误写成 `layout.css`，把布局层整个覆盖，`#main` 的 `max-width: 1040px` 和 `margin: 0 auto` 一起消失，页面变成铺满整个视口——但构建照样通过，路由照样 200。

所以改完 CSS 请确认两件事：

1. 每个 `assets/css/*.css` 都在 `head.html` 的 `slice` 列表里（漏一个就是整层样式消失）；
2. 关键规则真的进了产物：

```powershell
hugo --gc --minify
$css = Get-Content (Get-ChildItem public\css -Filter 'site.min.*')[0].FullName -Raw
[regex]::Matches($css, '[^{}]*\{[^}]*max-width:var\(--max-width\)[^}]*\}') | ForEach-Object { $_.Value }
```

期望看到 `.header-item,.nav-inner` / `#main` / `#footer` 三条带 `max-width:var(--max-width)` 与 `margin:...auto` 的规则——它们就是"1040px 定宽居中"的全部实现。

> 另外：无头 Chrome 在本机沙箱里跑不起来（`mojo platform_channel` 被拒绝，程序间命名管道被封），所以不要依赖浏览器截图做自动校验。

### 校验产物时小心 minify 改了写法

`hugo --minify` 会把 `style="--accent: #176B87"` 压成 `style=--accent:#176B87`（去掉引号、去掉空格）。
如果按带引号的原文去 grep，会得出"样式没生效"的错误结论——这个坑真实踩过。要断言就用能容忍压缩的写法，例如：

```powershell
[regex]::Matches((Get-Content public\index.html -Raw), 'style=--accent:([^ >]+)')
```

或者直接提取规则体判断，不要依赖属性引号。


## 部署

`.github/workflows/hugo.yml` 目前只在 `main` 分支推送时触发。要让本分支发布，需要改 workflow 的 `on.push.branches`，并在仓库 Pages 设置里确认发布分支——这一步没动，留给你决定。

## 许可

站点代码与内容归仓库作者所有。前端不依赖任何第三方运行时资源
（Bootstrap 3 的 CSS 从 CDN 引入，用于保留原站栅格观感；其余样式、脚本、图标全部自建）。
