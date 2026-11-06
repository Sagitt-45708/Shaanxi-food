# 陕西美食 · 三秦味道

一个介绍陕西美食的静态网页，纯 HTML + CSS + 原生 JavaScript，**不需要服务器**，双击 `index.html` 就能看。

课程：Web Technologies　｜　完成时间：2026 年 11 月

---

## 一、怎么预览

1. 在文件夹里双击 `index.html`，用浏览器打开即可。
2. （可选）用 VSCode 打开整个 `shaanxi-food` 文件夹，安装 "Live Server" 插件，右键 → Open with Live Server，改代码会自动刷新。

> 页面不加载任何外部字体、图片或 CDN，断网也能正常显示。

## 二、目录结构

```
shaanxi-food/
├── index.html          页面结构（唯一页面）
├── css/
│   └── style.css       全部样式，按 1~13 节注释分区
├── js/
│   └── main.js         三个小功能：筛选 / 弹窗 / 导航高亮
├── images/
│   ├── favicon.svg     站点小图标
│   ├── 8 张菜品实拍图   roujiamo.jpg 等，见 images/README.md
│   └── README.md       图片文件名与尺寸约定
└── README.md
```

## 三、页面里有什么

| 区块 | 内容 |
| --- | --- |
| 顶部导航 | 固定顶栏、品牌标记、三项锚点导航、开吃按钮 |
| 首屏 | 主标题 + 马克笔高亮 + 三张漂浮菜品卡 + 圆形贴纸 |
| 滚动条幅 | 纯 CSS 无缝滚动展示招牌菜名 |
| 数据条 | 4 个数字：8 道菜、3000 年、50+ 画、1 座碳水之都 |
| 美食列表 | 8 道菜卡片，可筛选「全部 / 面食 / 馍类 / 小吃」，点卡片弹出详情 |
| 文化 | 掰馍、biang 字、三秦套餐 3 张卡 |
| 一日食单 | 从 07:00 到 22:00 的时间线 |
| 页脚 | 课程信息、回到顶部 |

技术点：语义化标签（header/main/section/article/footer）、CSS 变量、Grid + Flex 布局、媒体查询响应式、`:focus-visible` 键盘焦点、`prefers-reduced-motion`、原生 `<dialog>`、`IntersectionObserver` 导航高亮、`<template>` 存详情内容、纯 CSS 滚动条幅与漂浮动画、图片懒加载（`loading="lazy"`）。

视觉风格：**年轻活泼**——奶油底色、粗黑描边、硬阴影（贴纸感）、马克笔高亮标题、橙 / 黄 / 绿 / 紫撞色。

## 四、怎么改

- **改文字**：直接改 `index.html` 里对应卡片的中文。
- **加一道菜**：复制一个 `<article class="dish-card" data-cat="mo">…</article>`，改 `data-cat`、emoji、标题、简介和 `<template>` 里的详情。
- **换图**：直接用同名文件覆盖 `images/` 里的图片即可（文件名见 `images/README.md`），不用改代码。想新增一道菜并配图，复制一张图进来，把 `<img class="dish-photo" src="images/xxx.jpg" alt="菜名">` 里的路径改掉。
- **改配色**：只改 `css/style.css` 开头 `:root` 里的变量，全站跟着变。

## 五、Git 提交规范

考核看的是 **commit 历史**，所以每个 commit 只做一件事，信息写清楚。

格式：

```
<类型>: <一句话说明>

<可选的详细说明，写清楚改了什么、为什么>
```

| 类型 | 用在哪 |
| --- | --- |
| `feat` | 新增功能或区块 |
| `fix` | 修 bug |
| `style` | 只改样式 / 格式，不改功能 |
| `content` | 只改文字内容 |
| `docs` | README 等文档 |
| `chore` | 配置、杂项 |

### 提交记录

| # | 提交信息 | 内容 |
| --- | --- | --- |
| 1 | `chore: 初始化项目结构` | 目录骨架、`.gitignore`、README、HTML 模板 |
| 2 | `style: 建立设计变量与基础样式` | 配色变量、重置、排版、按钮 |
| 3 | `feat: 添加顶部导航` | 固定顶栏、品牌、导航、开吃按钮 |
| 4 | `feat: 搭建首屏与漂浮卡片` | 主标题高亮、引导按钮、漂浮卡片 |
| 5 | `feat: 添加滚动条幅与数据条` | 无缝滚动条幅、四个数据卡 |
| 6 | `feat: 添加 8 道美食卡片` | 卡片网格 + 详情 template |
| 7 | `feat: 实现分类筛选` | 按分类过滤、更新计数 |
| 8 | `feat: 实现美食详情弹窗` | `<dialog>` 打开 / 关闭 |
| 9 | `feat: 添加文化介绍与一日食单` | 文化卡 + 时间线 |
| 10 | `style: 完成页脚与响应式适配` | 页脚、两个断点、减少动效 |
| 11 | `feat: 导航随滚动高亮` | IntersectionObserver |
| 12 | `docs: 完善 README 与站点图标` | 文档、favicon、图片说明 |
| 13 | `feat: 使用实拍图替换图形占位` | 8 张实拍图接入卡片 |
| 14 | `docs: 更新图片使用说明` | 目录结构、换图方式 |

### 常用命令

```bash
git status                     # 看改了什么
git add index.html css/ js/    # 暂存
git commit -m "feat: 添加美食卡片"
git push                       # 推到 GitHub
git log --oneline --graph      # 看提交历史
```

## 六、验收清单

- [ ] 双击 `index.html` 能正常显示，无外部依赖
- [ ] 三个筛选按钮都能正确过滤卡片
- [ ] 点任意卡片能弹出详情，Esc / 点遮罩能关闭
- [ ] 手机宽度（< 600px）下不横向滚动
- [ ] GitHub 仓库公开可访问，commit 信息可读
- [ ] README 在线显示正常
