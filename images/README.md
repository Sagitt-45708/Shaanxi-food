# Images

Eight dish photos are already wired into the page through `<img class="dish-photo" src="images/xxx.jpg" alt="...">`. The `.dish-photo` rule crops them to 4:3, adds the stencil border and rounds the corners.

| File | Dish |
| --- | --- |
| `roujiamo.jpg` | Roujiamo |
| `yangrou-paomo.jpg` | Yangrou paomo |
| `biangbiang.jpg` | Biangbiang noodles |
| `saozi-mian.jpg` | Qishan saozi noodles |
| `liangpi.jpg` | Liangpi |
| `hulutou.jpg` | Hulutou paomo |
| `zenggao.jpg` | Zenggao |
| `shizibing.jpg` | Persimmon cakes |

## Swapping a photo

Overwrite the file with the same name — no code changes needed. For a new dish, drop the image in here and point an `<img>` at it.

## Requirements

- `.jpg` or `.webp`, around 800px wide, under 300KB each.
- 4:3 is ideal; other ratios are fine — cropped from the centre, never stretched.
- Copyright: use your own photos, or images explicitly free for reuse (Pexels / Unsplash). Avoid watermarked images and pictures lifted from social platforms.

## Icons

| File | Used for |
| --- | --- |
| `favicon.svg` / `favicon.ico` | Browser tab; the `.ico` also works for Windows shortcuts |
| `icon-192.png` / `icon-512.png` | Home-screen icon after installing the PWA |
| `icon-maskable-512.png` | Android adaptive icon (not cropped) |
| `apple-touch-icon.png` | iOS "Add to Home Screen" |
| `og-cover.jpg` | Share preview (Open Graph) |
