# 图片说明

八张菜品图已经接入页面，`index.html` 里用 `<img class="dish-photo" src="images/xxx.jpg" alt="菜名">` 引用，样式由 `.dish-photo` 控制（4:3 裁切、粗描边、圆角）。

| 文件名 | 对应菜品 |
| --- | --- |
| `roujiamo.jpg` | 肉夹馍 |
| `yangrou-paomo.jpg` | 羊肉泡馍 |
| `biangbiang.jpg` | biangbiang 面 |
| `saozi-mian.jpg` | 岐山臊子面 |
| `liangpi.jpg` | 凉皮 |
| `hulutou.jpg` | 葫芦头泡馍 |
| `zenggao.jpg` | 甑糕 |
| `shizibing.jpg` | 黄桂柿子饼 |

## 图标文件

| 文件 | 用途 |
| --- | --- |
| `favicon.svg` / `favicon.ico` | 浏览器标签页图标；`.ico` 还用于 Windows 桌面快捷方式 |
| `icon-192.png` / `icon-512.png` | PWA 安装后的桌面/任务栏图标 |
| `icon-maskable-512.png` | Android 自适应图标（不会被裁掉） |
| `apple-touch-icon.png` | iOS「添加到主屏幕」的图标 |

## 想换图

**用同名文件直接覆盖即可**，不用改任何代码。比如换肉夹馍，就把新图命名为 `roujiamo.jpg` 覆盖进去。

## 图片要求

- 格式 `.jpg` 或 `.webp`，宽 800px 左右，单张别超过 300KB（仓库太大会很慢）。
- 比例最好是 **4:3**；其他比例也能用，页面会按 `object-fit: cover` 居中裁切，不会拉变形。
- 版权：用自己拍的，或明确可免费商用的图库（Pexels / Unsplash）的图。不要用带水印、或来自小红书 / 视觉中国 / 花瓣等平台的图。
