# Ourgensokyo 平台架构

> 系统架构图 + 模块职责说明 + 请求链路
> 对齐简历承诺：PostgreSQL / Redis / Docker / ECS / Wiki.js / LightRAG / MCDR / CF Access

---

## 一、架构总览

```mermaid
graph TB
    subgraph 用户层
        A[👤 用户<br/>访客 / 成员 / 管理员]
    end

    subgraph 客户端
        B[🖥️ Vue 3 SPA<br/>Element Plus + Pinia + Vue Router<br/>博客 / BBS / 管理后台]
    end

    subgraph 安全接入层
        C1[🌐 CloudFlare 代理<br/>CDN + DDoS 防护 + Flexible SSL]
        C2[🔗 CloudFlare Tunnel<br/>出站持久连接 / 零端口开放]
        C3[🌐 Nginx 反向代理<br/>多级路由: / → SPA /api → Express]
    end

    subgraph 后端服务
        D[⚡ Express.js 5 + TypeScript<br/>中间件链: CF → RateLimit → CORS → JSON → JWT]
        E[🔐 中间件层<br/>JWT 鉴权 / Rate Limiting / Multer 上传]
    end

    subgraph 领域模块
        F[📦 身份认证<br/>注册/登录/JWT/CF Access/密码更新]
        G[📦 社区论坛<br/>帖子 CRUD / 分页 / 分类筛选]
        H[📦 评论<br/>创建/删除/树形回复]
        I[📦 博客 + RAS<br/>Markdown / 点赞 / 评分 / 热门排序]
        J[📦 管理后台<br/>用户管理 / 内容审核 / 服务器监控]
        K[📦 上传 + 头像裁剪<br/>Multer / vue-advanced-cropper]
        L[📦 Wiki.js 文档中心<br/>文档管理 / LightRAG 检索]
    end

    subgraph 游戏联动
        M[📦 MCDReorged 桥接<br/>MCDR Python 插件 → HTTP → WebSocket]
        N[📦 MC 实时面板<br/>玩家状态 / TPS / 聊天同步]
    end

    subgraph 数据层
        O[(💾 PostgreSQL<br/>用户/帖子/评论/博客/评价)]
        P[(🗄️ Redis<br/>缓存 / 会话 / 在线状态)]
        Q[(🖼️ 文件存储<br/>头像 / 帖子图片)]
    end

    subgraph 基础设施
        R[🐳 Docker Compose<br/>前端 / 后端 / PG / Redis / Nginx / Wiki.js]
        S[☁️ 阿里云 ECS + HTTPS<br/>GitHub Actions CI/CD 自动部署]
    end

    %% 请求链路
    A -->|1. 访问| C1
    C1 -->|2. CF Tunnel| C2
    C2 -->|3. Nginx 反代| C3
    C3 -->|4. 静态资源| B
    C3 -->|5. /wiki/*| L
    C3 -->|6. /api/* 代理| D
    D -->|7. 中间件链| E
    E -->|8. 路由分发| F & G & H & I & J & K
    F & G & H & I & J -->|9. Prisma| O
    F & G & H & I & J -.->|10. Redis 缓存| P
    K --> Q
    M -->|HTTP 推送| D
    M -->|WebSocket| N
    N --> B
    D & C3 & O & P & L -.-> R
    R -.-> S

    %% 样式
    classDef user fill:#E8F5E9,stroke:#2E7D32
    classDef client fill:#E3F2FD,stroke:#1565C0
    classDef security fill:#FFEBEE,stroke:#C62828
    classDef proxy fill:#FFF3E0,stroke:#E65100
    classDef server fill:#F3E5F5,stroke:#6A1B9A
    classDef module fill:#E8EAF6,stroke:#283593
    classDef game fill:#FCE4EC,stroke:#880E4F
    classDef data fill:#E0F2F1,stroke:#00695C
    classDef infra fill:#FFF8E1,stroke:#F57F17

    class A user
    class B client
    class C1,C2,C3 security
    class C3 proxy
    class D server
    class E server
    class F,G,H,I,J,K,L module
    class M,N game
    class O,P,Q data
    class R,S infra
```

## 二、请求链路

| 步骤 | 说明 |
|------|------|
| 1 | 用户访问域名，DNS 解析到 CloudFlare |
| 2 | CF 边缘节点处理 HTTPS，通过 Tunnel 转发到服务器 |
| 3 | cloudflared 接收请求，转发到本地 Nginx:80 |
| 4 | Nginx 分发：静态资源 → Vue SPA，/api/* → Express |
| 5 | Vue SPA 渲染后，Axios 请求 `/api/*` 回 Nginx |
| 6 | Nginx 反向代理到 Express，过中间件链：Rate Limit → CORS → JSON → JWT |
| 7 | 控制器处理业务逻辑，Prisma 操作 PostgreSQL，Redis 缓存热数据 |

## 三、模块职责

| 模块 | 职责 | 简历关键词 |
|------|------|-----------|
| 身份认证 | 注册/登录/JWT/CF Access/密码更新 | JWT + bcrypt + CloudFlare |
| 社区论坛 | 帖子 CRUD/分页/分类筛选 | CRUD 基础 |
| 评论 | 创建/删除/树形回复 | 关系型数据设计 |
| 博客 + RAS | Markdown 文章/点赞评分/热门排序 | 业务逻辑 + 算法 |
| 管理后台 | 用户管理/帖子审核/服务器监控 | 权限管理 |
| 上传 + 裁剪 | 文件上传/头像裁剪组件 | Multer / 前端组件 |
| Wiki.js 文档 | 文档管理/多语言/LightRAG 语义检索 | 文档 + AI 检索 |
| MCDR 桥接 | Python 插件监听 MC 事件/HTTP 推送 | Python + 协议对接 |
| MC 面板 | WebSocket 实时推送/玩家状态/聊天同步 | WebSocket + 实时 |
| CloudFlare Tunnel | 零端口出站连接/绕过运营商端口封锁 | DevOps + 网络工程 |

## 四、简历技术点覆盖

| 简历写到的 | 架构中的位置 |
|-----------|-------------|
| Node.js + Express + Prisma | 后端服务 + Prisma ORM |
| PostgreSQL + Redis | 数据层双存储 |
| Docker + ECS 容器化部署 | 基础设施层 |
| JWT + bcrypt + CF Access | 安全接入层 |
| Wiki.js 文档中心 | 领域模块 /wiki |
| LightRAG 语义检索 | Wiki.js 模块中集成 |
| MCDReorged HTTP 桥接 | 游戏联动模块 |
| 管理后台 | 领域模块 Admin |
| CloudFlare Tunnel | 安全接入层 |
| Nginx 反代与多级路由 | Nginx 层 |
