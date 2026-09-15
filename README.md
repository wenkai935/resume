# 简历 · 张文凯（产品经理）

本仓库是张文凯「产品经理」简历的**静态网页源文件**，托管在 GitHub Pages，公网地址：

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
| **添加微信** | 弹出加好友卡片：显示微信二维码 + 微信号（15889482136），点「复制」可复制号码 |

> 两个按钮都是蓝色主按钮样式。
> 微信二维码：把微信个人二维码图片存为仓库根目录的 `wechat-qr.png` 即可自动显示；
> **图片缺失时会自动降级**为「微信与手机号同号，直接搜索添加」的文字提示，不会出现裂图。
> 弹层里也保留了「微信号 + 复制」兜底，键盘 `Esc` 或点遮罩可关闭。

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

## 照片与二维码
- **照片**：`photo.jpg` 已就位，`index.html` 头部通过 `<img src="photo.jpg" alt="张文凯 证件照">` 引用。
  换照片只需覆盖同名文件（建议 JPG，压到 300KB 内），无需改代码。头部展示尺寸为 `.avatar` 里的 `96px × 120px`。
- **微信二维码**：把微信个人二维码图存为根目录 `wechat-qr.png`，「添加微信」弹层会自动显示；
  没有该文件则显示文字兜底提示（见上文按钮说明）。

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
