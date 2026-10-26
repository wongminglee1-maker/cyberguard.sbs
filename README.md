# CyberGuard 官方网站与网络连接服务指南

CyberGuard（域名：cyberguard.sbs）企业级科技品牌官方网站，基于 **Enterprise Dark Security** UI 框架与 **Cyber Command** 模板构建的高端网络连接与数字访问服务平台。

---

## 🌟 核心特性

- **国际企业级科技视觉体系**：
  - 精准深色科技色调：主背景 `#080B10`、次级背景 `#111722`、品牌青 `#00D9D0`、辅助蓝 `#477BFF`。
  - 原创 3D 抽象网络核心模型（HTML5 Canvas 60fps 斐波那契螺旋节点网、多轴轨道光脉冲与视差交互）。
  - 全屏毛玻璃导览（Glassmorphism）与青色霓虹微发光按键。
- **全平台多设备适配**：
  - 响应式布局覆盖 Desktop、Tablet 与 Mobile（320px–1920px+）。
  - Windows、macOS、Android、iOS 四端客户端分流与配置指南。
- **透明资费方案体系**：
  - 月付、季付、半年付、年付周期切换。
  - 包含 100GB 入门、200GB 主力推荐与 1000GB 团队高配方案。
- **7 篇原创深度技术知识库**：
  - 全文涵盖现代网络连接架构、VPN vs 代理辨析、节点时延选优、流量预算测算、四端客户端规范、故障排查手册与 BGP/IPLC 物理专线全景对比。
- **搜索引擎友好（SEO & Performance）**：
  - 完整 Semantic HTML5、Open Graph、Twitter Card。
  - 全站嵌入 Schema.org（`WebSite`、`FAQPage`、`TechArticle`）结构化数据。
  - 自动化 XML Sitemap 与规范 Robots.txt。

---

## 📁 目录结构

```text
cyberguard.sbs/
├── index.html                                    # 官方主页（10 大核心板块）
├── 404.html                                      # Cyber Command 404 错误页
├── privacy.html                                  # 官方隐私权保护政策
├── terms.html                                    # 官方服务条款
├── favicon.svg                                   # 矢量品牌 LOGO 图标
├── favicon.ico                                   # 标准浏览器图标
├── favicon.png                                   # 高分辨率图标
├── sitemap.xml                                   # XML 站点地图
├── robots.txt                                    # 爬虫抓取规则
├── server.js                                     # 本地轻量化预览服务
├── css/
│   ├── style.css                                 # UI 框架与核心样式
│   └── article.css                               # 知识库文章与目录排版
├── js/
│   ├── main.js                                   # 交互与分流控制逻辑
│   └── cyber-core.js                             # 3D 核心可视化引擎
└── articles/                                     # 7 篇原创深度技术文档
    ├── modern-network-architecture.html          # 网络连接架构入门
    ├── vpn-vs-proxy-differences.html             # VPN 与代理区别辨析
    ├── node-selection-guide.html                 # 节点选择与延迟质量
    ├── plan-selection-analysis.html              # 套餐选型与流量预算
    ├── client-configuration-guide.html           # 四端客户端配置知识
    ├── troubleshooting-guide.html                # 网络故障排查手册
    └── bgp-iplc-transit-comparison.html          # BGP、IPLC 与中转架构
```

---

## 🚀 本地运行与预览

本项目为原生零依赖的高性能现代静态网站，可通过任意 HTTP 服务器或内置轻量服务器运行：

```bash
# 使用内置 Node.js 服务
node server.js
```

启动后在浏览器访问：`http://localhost:8088`

---

## 📄 部署指引

支持一键推送到任意静态站点托管平台：
- **Cloudflare Pages**：直接连接 GitHub 仓库，Build Command 留空，Output Directory 填写根目录 `/`。
- **GitHub Pages**：在 Repository Settings -> Pages 中选择 `main` 分支根目录 `/` 即可。
- **Vercel / Netlify**：直接导入仓库部署。

---

© 2026 CyberGuard (cyberguard.sbs). All Rights Reserved.
