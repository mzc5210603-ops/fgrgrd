# 多语言电子书目录网站部署指南

## 项目概述

基于 Vue3 + Vite 的纯静态电子书目录网站，具备以下特性：
- 英文/日语双语界面切换（i18n）
- 集成在线阅读器（iframe嵌入方式，稳定可靠）
- 深色/浅色模式切换
- GitHub Actions 定时自动采集公版电子书元数据
- Cloudflare Pages 自动部署
- 适配 PC 与移动端
- SEO 优化

## 合规声明

本项目仅采集**公版（Public Domain）和开源授权**的电子书元数据：
- **Project Gutenberg** - 全球最大的英文公版图书库（6万+图书）
- **青空文庫** - 日本最大的公版日文文学库

**不下载、不存储EPUB/PDF实体文件**，仅保存外部资源直链和在线阅读链接。

## 目录结构

```
├── src/                 # 前端源码
│   ├── components/      # 组件
│   ├── views/           # 页面视图（含Reader阅读器）
│   ├── lang/            # 多语言配置（en/ja）
│   ├── router/          # 路由配置
│   ├── utils/           # 工具函数
│   └── composables/     # 组合式函数
├── public/
│   ├── books/           # 图书JSON数据（自动生成）
│   └── _redirects       # Cloudflare Pages SPA路由
├── scripts/             # 图书采集脚本
│   ├── fetcher.js       # OPDS/RSS采集模块
│   ├── cleanup.js       # 数据清洗去重
│   └── main.js          # 主脚本
├── config.js            # 采集配置（电子书源）
├── .github/workflows/   # GitHub Actions配置
│   └── book-scraper.yml # 定时采集任务
└── DEPLOYMENT.md        # 本部署文档
```

---

## 部署步骤

### 1. 创建GitHub仓库并上传代码

1. 登录 [GitHub](https://github.com/)，点击 "New" 创建新仓库
2. 仓库名称：`ebook-library`（或自定义）
3. 不要勾选 "Initialize this repository"（保持空仓库）

在本地终端执行：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Multilingual ebook library"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/your-username/ebook-library.git

# 推送
git branch -M main
git push -u origin main
```

### 2. GitHub Actions 权限配置

> **注意**：GitHub Actions 默认提供 `GITHUB_TOKEN`，**无需手动创建令牌**。

但需要确保仓库允许 Actions 提交代码：

1. 进入仓库 → **Settings** → **Actions** → **General**
2. 滚动到 **Workflow permissions**
3. 选择 **Read and write permissions**
4. 勾选 **Allow GitHub Actions to create and approve pull requests**
5. 点击 **Save**

### 3. Cloudflare Pages 部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **Create application** → **Pages**
3. 选择 **Connect to Git**
4. 授权并选择你的 GitHub 仓库
5. 配置构建设置：
   - **Framework preset**: Vue
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version** (环境变量): `NODE_VERSION = 20`
6. 点击 **Save and Deploy**

### 4. 验证自动化流程

部署完成后，自动化流程如下：

```
GitHub Actions 定时触发（每12小时）
    ↓
运行采集脚本 → 抓取图书元数据
    ↓
数据清洗、去重 → 生成 books.json
    ↓
Git commit & push 到仓库
    ↓
Cloudflare Pages 自动检测到 push
    ↓
自动重新构建部署 → 网站更新
```

---

## 配置说明

### 修改定时抓取频率

编辑 [.github/workflows/book-scraper.yml](file:///I:/网站搭建编码/fgrgrd/.github/workflows/book-scraper.yml)：

```yaml
schedule:
  - cron: '0 */12 * * *'  # 每12小时
```

常用 cron 表达式：

| 表达式 | 说明 |
|--------|------|
| `0 */6 * * *` | 每6小时 |
| `0 */12 * * *` | 每12小时 |
| `0 0 * * *` | 每天午夜 |
| `0 8 * * *` | 每天早上8点（UTC） |

### 新增电子书源

编辑 [config.js](file:///I:/网站搭建编码/fgrgrd/config.js)，在 `BOOK_SOURCES` 数组中添加：

```javascript
{
  name: '你的资源名称',
  type: 'opds',           // 支持: 'opds' | 'opds-xml' | 'aozora-new'
  url: 'https://...',     // OPDS/RSS源地址
  category: 'classic',    // 分类: fiction/nonfiction/classic/poetry/history/philosophy/science/children/adventure/romance/mystery/drama
  language: 'en',         // 语言: 'en' | 'ja'
  maxBooks: 20,           // 最多采集数量
}
```

**支持的采集类型：**
- `opds` - Project Gutenberg JSON API 格式
- `opds-xml` - Standard Ebooks OPDS XML 格式
- `aozora-new` - 青空文庫日文图书

### 修改最大图书数量

编辑 `config.js`：

```javascript
export const MAX_TOTAL_BOOKS = 300  // 仓库保存的最大图书数量
```

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 手动运行采集脚本
node scripts/main.js
```

---

## 技术栈

- **Vue 3.5+** - 前端框架
- **Vite 6.0+** - 构建工具
- **Vue Router 4** - 路由管理
- **Vue I18n 9** - 国际化（英文/日语）
- **Tailwind CSS 3** - 样式框架
- **GitHub Actions** - CI/CD 自动化采集
- **Cloudflare Pages** - 静态部署

---

## 故障排查

### GitHub Actions 失败
1. 检查 Actions 日志：仓库 → Actions → 点击失败的 workflow
2. 常见问题：
   - **权限不足**：确保 Settings → Actions → Workflow permissions 设为 Read and write
   - **网络超时**：检查电子书源是否可访问
   - **依赖安装失败**：确认 Node.js 版本为 20

### 图书数据不更新
1. 手动触发 workflow：Actions → Ebook Scraper → Run workflow
2. 检查采集脚本日志是否有报错
3. 检查 `public/books/books.json` 是否有变化

### Cloudflare Pages 部署失败
1. 检查构建日志
2. 确认 `npm run build` 能正常执行
3. 确认 `dist` 目录正确生成

### 阅读器无法加载
- 部分网站（如某些外部阅读页面）可能设置了 `X-Frame-Options` 禁止 iframe 嵌入
- Project Gutenberg 和青空文庫支持 iframe 嵌入，可以正常阅读
- 如果遇到 iframe 被阻止，点击图书详情页的 "Download" 链接下载后本地阅读
