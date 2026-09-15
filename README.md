# 简历 · 涂装工艺工程师

本仓库是 [涂装工艺工程师] 简历的**静态网页源文件**，托管在 GitHub Pages，公网地址：

> https://wenkai935.github.io/resume/

页面完全由本仓库根目录的 `index.html` 决定，无任何外部依赖（内联样式、无 CDN / 脚本 / 统计代码），天然支持 HTTPS 且不触发混合内容告警。

---

## 目录结构

```
resume/
├── index.html          # 简历页面（单一源文件，所有内容都在这里）
├── resume.pdf          # 供下载的 PDF 简历（由 index.html 自动生成，勿手工编辑）
├── scripts/
│   └── build-pdf.mjs   # 由 index.html 渲染 A4 PDF 的脚本
├── .github/workflows/
│   └── build-resume-pdf.yml  # index.html 一变就自动重建 resume.pdf
├── package.json        # 仅用于构建 PDF（puppeteer-core）
├── robots.txt          # 屏蔽 /resume.pdf 的收录意图声明
├── README.md           # 本说明
└── .nojekyll           # 让 GitHub Pages 原样提供静态资源，不做 Jekyll 处理
```

---

## 如何更新简历（三种方式）

> 核心原则：**只改 `index.html` 一个文件**，GitHub Pages 会在约 10 秒~1 分钟内自动重新发布，公网链接不变。PDF 会在约 1~2 分钟内自动跟着重建，**不需要手工同步**。

### 方式一：直接告诉 AI 助手（最省事）
把新内容发给我，例如「把一次合格率改成 88%→96%」「新增一段 xx 项目」，我负责排版并推送，你什么都不用碰。

### 方式二：在 GitHub 网页直接改
1. 打开仓库 `https://github.com/wenkai935/resume`
2. 点击 `index.html` → 右上角铅笔图标编辑
3. 改完点页面底部「Commit changes」
4. 等约 1 分钟，刷新网页即可看到更新

### 方式三：本地 git
```bash
git clone https://github.com/wenkai935/resume.git
# 编辑 index.html
git add index.html
git commit -m "更新简历"
git push
```

---

## PDF 简历下载（自动构建）

页面上方有两个按钮：

| 按钮 | 行为 |
|---|---|
| **↓ 下载 PDF 简历** | 直接下载仓库里的 `resume.pdf`，一键到手，手机端同样可用 |
| **打印 / 另存为 PDF** | 调起浏览器打印对话框，用户自己选「另存为 PDF」；PDF 文件万一滞后时的兜底 |

### 自动化链路

```
git push（改了 index.html）
      ↓
GitHub Actions 触发 .github/workflows/build-resume-pdf.yml
      ↓
装中文字体 → scripts/build-pdf.mjs 用无头 Chrome 渲染（print media）
      ↓
提交新的 resume.pdf 回仓库 → 线上按钮即刻指向最新版本
```

- 纸张与页边距的**单一来源**是 `index.html` 里的 `@page { size: A4; margin: 12mm }`，浏览器打印与自动化构建共用同一套规则。
- `@media print` 里额外隐藏了操作按钮、并禁止 `.sec` / `.job` 被拦腰分页。
- 工作流只在 `resume.pdf` 内容真正变化时才提交，且提交信息带 `[skip ci]`，不会自我循环触发。

### 本地手动重建（可选）

```bash
npm install
npm run build:pdf            # 自动探测 Chrome / Edge
# 或指定浏览器：
CHROME_PATH="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" npm run build:pdf
```

---

## 添加照片
1. 把照片（建议 JPG/WebP，压到 300KB 内）命名为 `photo.jpg` 放进仓库根目录；
2. 在 `index.html` 头部找到「照片占位」处，把
   `<span>照片<br>占位</span>` 替换为 `<img src="photo.jpg" alt="个人照片">`；
3. 推送即可。照片随网页一起走 HTTPS，不会触发不安全警告。

---

## 安全说明（重要）

- **搜索引擎已关闭收录**：`index.html` 头部为
  `<meta name="robots" content="noindex, nofollow">`，搜索引擎不会收录本页，链接仍可正常分享给指定的人。
  > 注意：`robots.txt` 只对域名根目录生效，本项目是 GitHub 项目页
  > （`wenkai935.github.io/resume/`），故仓库里的 `robots.txt` 对 Googlebot 等不生效，
  > **真正的收录控制靠上面这行 meta**。
- **仍然完全公开**：关收录 ≠ 设权限。任何人拿到链接都能查看，页面与 PDF 里的**电话 / 邮箱全球可见**。
  发布前请确认联系方式已填写且你接受公开。
- **PDF 是第二份副本**：`resume.pdf` 里同样含联系方式，且 PDF 无法内嵌 `noindex`。
  目前靠「页面不被收录 → 链接不被爬虫发现」间接保护。若需更强保护，可考虑：
  - 把 PDF 文件名改成不易猜测的随机串；
  - 或 PDF 正文里对电话做部分打码。
- **无第三方追踪**：页面不加载任何外部脚本或统计，不会向第三方泄露访问数据。
- **如需加强保护**（二选一或都做）：
  - **加访问口令**：在 `index.html` 顶部加一段简单的密码校验脚本（我可帮你加）；
  - **脱敏**：把电话/邮箱打码或留空，需要时单独告知对方。
- **证书**：GitHub Pages 自动签发并续期受信任 TLS 证书，访客浏览器显示绿锁，无需你安装任何根证书。

---

## 回退
每次更新都是一个 git 提交，改错了可在仓库 「Commits」 里回退到上一版。
