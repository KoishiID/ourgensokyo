# Ourgensokyo 平台

> 基于 Vue 3 + Express.js 的全栈 BBS 论坛系统，含 Minecraft 服务器联动规划。

## 技术栈

| 层 | 技术 | 说明 | 状态 |
|---|------|------|------|
| 前端框架 | Vue 3 + Vite + Pinia | SPA 单页应用 | ✅ 已落地 |
| UI 组件库 | Element Plus | 后台风格组件 | ✅ 已落地 |
| 后端框架 | Express.js 5 (CommonJS) | REST API 服务 | ✅ 已落地 |
| ORM | Prisma 7 | 数据库操作（SQLite → PostgreSQL） | 🚧 迁移中 |
| 数据库 | PostgreSQL（目标） | 当前使用 SQLite | 🚧 迁移中 |
| 认证 | JWT + bcryptjs + CloudFlare Access | 令牌签发与密码哈希 | ✅ 已落地 |
| 文件上传 | Multer | 图片/头像上传 | ✅ 已落地 |
| 缓存 | Redis | 缓存/会话/在线状态 | 🔲 待接入 |
| 文档中心 | Wiki.js | 文档管理 + 语义检索 | 🔲 待集成 |
| AI 检索 | 阿里云 LightRAG | 文档语义搜索与问答 | 🔲 待接入 |
| 安全 | Rate Limiting + CF Access | 请求限流 + 二次验证 | 🔲 待接入 |
| 类型系统 | JS → TS | 前后端迁移 | 🔲 待迁移 |
| 容器化 | Docker Compose | 5 容器编排 | 🔲 待实施 |
| MC 联动 | MCDReorged HTTP | 游戏-Web 桥接 | 🔲 待开发 |
| 管理后台 | Vue 3 Admin | 用户管理/内容审核 | 🔲 待开发 |
| CI/CD | GitHub Actions | 自动测试构建部署 | 🔲 待实施 |
| 部署 | 阿里云 ECS + HTTPS | 域名 + SSL | 🔲 待实施 |

## 目录结构

```
ourgensokyo/
├── CLAUDE.md                     ← AI 上下文说明书
├── start.cmd                     ← 一键启动
├── docs/                         ← 架构文档
│   ├── ARCHITECTURE.md           ← 架构图
│   ├── API.md                    ← API 参考
│   ├── DB.md                     ← 数据库设计
│   └── CONVENTIONS.md            ← 代码规范
├── bbs-client/src/               ← Vue 3 前端
│   ├── api/index.js              ← Axios 封装
│   ├── router/index.js           ← 路由
│   ├── stores/auth.js            ← Pinia 状态
│   └── views/                    ← 页面组件
├── bbs-server/src/               ← Express 后端
│   ├── index.js                  ← 入口
│   ├── routes/                   ← 路由层
│   ├── controllers/              ← 控制器
│   ├── middleware/               ← 中间件
│   └── utils/                    ← 工具
├── prisma/schema.prisma          ← 数据库模型
└── .omo/plans/                   ← 开发计划
```

## 关键约定

| 约定 | 说明 |
|------|------|
| API 前缀 | 所有 API 以 `/api/*` 开头 |
| 鉴权方式 | JWT Bearer Token |
| Token 有效期 | 7 天（可配置） |
| 密码存储 | bcrypt 10 轮哈希 |
| 图片上传 | Multer, 5MB(帖子)/2MB(头像), jpg/png/gif/webp |
| 数据库变更 | 必须通过 `prisma migrate dev` |
| 新增功能 | 先写计划 → 审批 → 编码 |

## 功能状态

### ✅ 已实现
- 用户注册/登录/JWT 签发
- 帖子 CRUD（分页 + 分类筛选）
- 评论创建与删除（仅作者）
- 分类管理
- 头像上传与更新
- 文件上传
- 用户个人主页

### 🚧 进行中
- Redis 缓存接入
- Rate Limiting 请求限流
- CloudFlare Access 二次验证
- PostgreSQL 数据库迁移
- TypeScript 类型迁移

### 🔲 待实现
- 博客模块 + Markdown 编辑器
- 暗黑模式
- 头像裁剪（vue-advanced-cropper 已装）
- 评论树形回复
- RAS 评价系统（点赞/评分/热门排序）
- 管理后台（用户管理/内容审核/服务器监控）
- Wiki.js 文档中心
- 阿里云 LightRAG 语义检索
- MCDReorged 桥接 + MC 实时面板
- Docker Compose 容器化编排
- GitHub Actions CI/CD
- 阿里云 ECS 部署 + HTTPS + 域名

## 开发命令

```bash
start.cmd                          # 一键启动
cd bbs-server && npm run dev       # 后端 :3000
cd bbs-client && npm run dev       # 前端 :5173
npx prisma migrate dev             # 数据库迁移
npx prisma generate                # 生成 Client
npx prisma studio                  # 可视化 DB
```

## 文档索引

| 文档 | 路径 |
|------|------|
| 架构图 | docs/ARCHITECTURE.md |
| API 参考 | docs/API.md |
| 数据库设计 | docs/DB.md |
| 代码规范 | docs/CONVENTIONS.md |
| 平台蓝图 | .omo/plans/ourgensokyo-platform-plan.md |

