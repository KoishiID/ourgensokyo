# SecPulse v2.0 — Ourgensokyo Platform

> 个人数字生态系统：情报聚合中心（SecPulse）+ 私人知识库（RAG）+ 开发者仪表板

## 技术栈

| 模块 | 技术栈 | 说明 | 状态 |
|------|--------|------|------|
| 前端框架 | Vue 3 + Vite + Pinia + TypeScript | SPA 单页应用 | ✅ 已实现 |
| UI 框架 | Element Plus | 后台管理风格 | ✅ 已实现 |
| 后端框架 | Express.js 5 + TypeScript | REST API 服务 | ✅ 已实现 |
| 类型系统 | TypeScript 7 (strict) | 前后端全量迁移完成 | ✅ 已实现 |
| ORM | Prisma 7 | 数据库抽象层(PostgreSQL) | ✅ 已实现 |
| 数据库 | PostgreSQL 16 + pgvector | 关系型数据库 + 向量扩展 | ✅ 已实现 |
| 认证 | JWT + bcryptjs | 用户登录/注册认证 | ✅ 已实现 |
| 文件上传 | Multer | 图片/头像上传 | ✅ 已实现 |
| 深色模式 | CSS 变量 + Element Plus dark | 明暗主题切换 | ✅ 已实现 |
| 头像裁剪 | vue-advanced-cropper | 裁剪并上传头像 | ✅ 已实现 |
| 速率限制 | express-rate-limit | 登录/注册 5次/分钟 | ✅ 已实现 |
| 容器化 | Docker Compose | 4 容器(PG/后端/前端/Nginx) | ✅ 已实现 |
| CI/CD | GitHub Actions | 自动构建部署到 Linux 服务器 | ✅ 已实现 |
| HTTPS | CloudFlare Flexible SSL | CF 反代自动签发 SSL | ✅ 已启用 |
| CloudFlare Tunnel | cloudflared 出站连接 | 零端口开放 | ✅ 已启用 |
| CDN/安全 | CloudFlare 代理 | DDoS 防护 + CDN 加速 | ✅ 已启用 |
| 文档中心 | Wiki.js | 文档管理 + 全站搜索 | ❌ 待集成 |
| AI RAG | DashScope + DeepSeek v4 | 知识库问答 + 私人日记 | ❌ 待实现 |
| 管理后台 | Vue 3 Admin | 用户管理/内容管理/订阅源管理 | ❌ 待实现 |
| Redis | Redis | 缓存/会话/在线状态 | ❌ 待实现 |
| MC 桥接 | MCDReorged HTTP | 游戏-Web 联动 | ❌ 待实现 |

## 设计哲学

- **Lab Aesthetic**：冷调/工业/CLI 风格，单色主调 + 高对比度荧光 accent
- **Atomized UI**：以日志流为核心，非卡片流
- **Human-AI 协作**：AI 构建功能 MVP → 用户自行设计美化 → 手动精调 CSS
- **前端极简**：严禁非必要插件

## 目录结构

```
ourgensokyo/
├── CLAUDE.md                      # AI 项目说明书（本文件）
├── start.cmd                      # 一键启动脚本
├── docs/                          # 架构文档
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DB.md
│   └── CONVENTIONS.md
├── bbs-client/                    # Vue 3 + TypeScript 前端
│   ├── src/
│   │   ├── api/index.ts           # Axios 封装 + 类型定义
│   │   ├── router/index.ts        # 路由
│   │   ├── stores/auth.ts         # Pinia 状态
│   │   ├── types/                 # 共享类型
│   │   └── views/                 # 页面组件 (lang="ts")
│   ├── tsconfig.json              # 前端 TS 配置
│   └── package.json
├── bbs-server/                    # Express.js 5 + TypeScript 后端
│   ├── src/
│   │   ├── index.ts               # 入口
│   │   ├── routes/                # 路由层 (.ts)
│   │   ├── controllers/           # 控制器 (.ts)
│   │   ├── middleware/            # 中间件 (.ts)
│   │   ├── utils/                 # 工具 (jwt.ts, prisma.ts)
│   │   └── types/                 # 类型扩展 (express.d.ts)
│   ├── tsconfig.json              # 后端 TS 配置
│   └── package.json
├── prisma/
│   ├── schema.prisma              # 数据库模型
│   └── seed.ts                    # 种子数据
├── docker-compose.yml             # 4 容器编排
└── .omo/plans/                    # 工作计划
```

## 关键约定

| 约定 | 说明 |
|------|------|
| 语言 | 全量 TypeScript (strict mode) |
| API 前缀 | 所有 API 以 `/api/*` 开头 |
| 鉴权方式 | JWT Bearer Token |
| Token 有效期 | 7 天(配置文件设定) |
| 密码存储 | bcrypt 10 轮哈希 |
| 图片上传 | Multer, 5MB(帖子)/2MB(头像), jpg/png/gif/webp |
| 数据库变更 | 通过 `prisma migrate dev` |
| 开发流程 | 写计划 → 编码 → 审查 |
| 后端运行 | `tsx watch src/index.ts` (dev) / `tsx src/index.ts` (start) |
| 类型检查 | `npx tsc --noEmit` (后端) / `npx vue-tsc --noEmit` (前端) |

## 功能状态

### ✅ 已完成
- 用户注册/登录/JWT 签发
- 帖子 CRUD(分页 + 分类筛选)
- 评论创建/删除(仅作者可删)
- 分类列表
- 头像上传与裁剪(vue-advanced-cropper)
- 文件上传(Multer)
- 用户个人主页
- 深色模式切换(Element Plus dark + CSS 变量)
- 速率限制(express-rate-limit, 登录/注册 5次/分钟)
- Docker Compose 容器编排(PostgreSQL / 后端 / 前端 / Nginx)
- GitHub Actions CI/CD 自动部署
- CloudFlare 代理 + Tunnel 接入
- **TypeScript 全量迁移(前后端 strict mode)**

### ❌ 待实现（SecPulse v2.0 Roadmap）
- SecPulse 情报聚合前端（替换现有 BBS 前端）
- 订阅源管理（RSS/API/网页抓取）
- AI 日记模块（DeepSeek v4 润色 + pgvector 存储）
- Wiki.js 文档中心（Docker 集成）
- 管理后台仪表板
- Redis 缓存集成
- CloudFlare Access 二次验证
- MCDR Minecraft 桥接
- DevSecOps（代码审查 + SAST 扫描 + CI/CD 安全门禁）

## 开发命令

```bash
start.cmd                              # 一键启动
cd bbs-server && npm run dev           # 后端 :3000 (tsx watch)
cd bbs-server && npm run typecheck     # 后端类型检查
cd bbs-client && npm run dev           # 前端 :5173
cd bbs-client && npx vue-tsc --noEmit  # 前端类型检查
npx prisma migrate dev                 # 数据库迁移
npx prisma generate                    # 生成 Client
npx prisma studio                      # 可视化 DB
```

## 文档索引

| 文档 | 路径 |
|------|------|
| 架构图 | docs/ARCHITECTURE.md |
| API 参考 | docs/API.md |
| 数据库设计 | docs/DB.md |
| 编码规范 | docs/CONVENTIONS.md |
| 平台蓝图 | .omo/plans/secpulse-v2-evolution.md |
