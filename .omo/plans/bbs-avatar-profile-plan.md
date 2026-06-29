# BBS: 头像上传 + 个人主页 实施计划

## 概述

为 BBS 论坛添加头像上传功能、在 header 显示用户头像、以及带帖子列表的个人主页。同时将数据库从 MySQL(MariaDB) 切换为 SQLite，消除对外部数据库服务的依赖，方便本地开发。

---

## 步骤拆解

### Step 1: 数据库从 MySQL 切换到 SQLite

**原因：** 初学阶段不需要独立数据库服务。SQLite 零配置、文件型存储，Prisma v7 原生支持。

**改动文件：**

| 文件 | 改动 |
|---|---|
| `bbs-server/prisma/schema.prisma` | `provider = "mysql"` → `provider = "sqlite"`；删除所有 `@db.VarChar(...)` 注解（SQLite 不支持） |
| `bbs-server/prisma.config.ts` | 无需改动，已通过 `DATABASE_URL` 环境变量注入 |
| `bbs-server/src/utils/prisma.js` | 移除 `@prisma/adapter-mariadb` 导入和 adapter 实例化，简化为 `new PrismaClient()` |
| `bbs-server/.env` | `DATABASE_URL` 改为 `file:./dev.db` |
| `bbs-server/package.json` | 移除 `@prisma/adapter-mariadb` 和 `mariadb` 依赖 |
| `bbs-server/prisma/migrations/` | 删除旧 migration 目录，重新 `prisma migrate dev` 生成 |

**注意：** 删除旧 migration 是因为 MySQL migration SQL 与 SQLite 不兼容，需要重新生成。此时还没有生产数据，无损。

---

### Step 2: 后端 — 新增头像上传 API

**思路：** 复用已有的 Multer 中间件，新增 `PUT /api/auth/avatar` 端点。用户上传头像图片 → 保存到 `/uploads/avatars/` → 更新 `users.avatar` 字段。

**改动文件：**

| 文件 | 改动 |
|---|---|
| `bbs-server/src/controllers/authController.js` | 新增 `updateAvatar` 函数：接收上传的文件路径，更新当前用户的 avatar 字段 |
| `bbs-server/src/routes/auth.js` | 新增 `PUT /avatar` 路由，挂载 `authenticate` + `upload.single('avatar')` + `updateAvatar` |

**请求示例：**
```
PUT /api/auth/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: avatar=<file>
```

**返回示例：**
```json
{ "avatar": "/uploads/avatars/1712345678-123456789.jpg" }
```

---

### Step 3: 后端 — 新增用户信息 API（供个人主页使用）

**改动文件：**

| 文件 | 改动 |
|---|---|
| `bbs-server/src/controllers/userController.js` | **新建。** 含 `getUserProfile` 函数：查用户信息 + 该用户帖子列表（分页） |
| `bbs-server/src/routes/users.js` | **新建。** `GET /:id` 路由 |
| `bbs-server/src/index.js` | 注册 `app.use('/api/users', userRoutes)` |

**返回示例：**
```json
{
  "user": { "id": 1, "username": "admin", "avatar": "/uploads/...", "createdAt": "..." },
  "posts": { "posts": [...], "total": 5, "page": 1, "totalPages": 1 }
}
```

---

### Step 4: 后端 — 调整 Multer 存储路径

**改动文件：**

| 文件 | 改动 |
|---|---|
| `bbs-server/src/middleware/upload.js` | 添加对不同上传场景的支持：帖子图片存 `uploads/posts/`，头像存 `uploads/avatars/`。导出两个 multer 实例 |

---

### Step 5: 前端 — Header 显示头像

**改动文件：**

| 文件 | 改动 |
|---|---|
| `bbs-client/src/App.vue` | header 中用户名左侧添加 `<el-avatar :src="auth.user?.avatar" size="small" />`，无头像时显示用户名首字母 |

---

### Step 6: 前端 — 个人主页页面

**改动文件：**

| 文件 | 改动 |
|---|---|
| `bbs-client/src/views/Profile.vue` | **新建。** 展示用户头像（可点击上传）、用户名、注册时间、该用户的帖子列表 |
| `bbs-client/src/router/index.js` | 新增路由 `{ path: '/profile/:id', name: 'Profile', component: ... }` |
| `bbs-client/src/api/index.js` | 新增 `getUserProfile(id, params)` 函数 |

**个人主页功能：**
- 访问 `/profile/:id` 显示对应用户信息
- 如果是自己的主页，显示「上传头像」按钮
- 头像上传使用 Element Plus `<el-upload>` 组件，直接调 `/api/auth/avatar`
- 上传成功后实时刷新头像

---

### Step 7: 前端 — Header 添加个人主页入口

**改动文件：**

| 文件 | 改动 |
|---|---|
| `bbs-client/src/App.vue` | 登录状态下用户名改为可点击链接，跳转到 `/profile/:id` |

---

## 文件改动汇总

### 后端 (6 个文件改动 + 2 个新建)

```
bbs-server/
├── .env                              # 改 DATABASE_URL
├── package.json                      # 删 @prisma/adapter-mariadb, mariadb
├── prisma/
│   └── schema.prisma                 # 改 provider + 删 @db 注解
├── prisma/migrations/                # 删旧 + 重新生成
├── src/
│   ├── index.js                      # + users 路由注册
│   ├── utils/prisma.js               # 简化为 new PrismaClient()
│   ├── middleware/upload.js          # 支持 posts/ 和 avatars/ 子目录
│   ├── routes/auth.js                # + PUT /avatar
│   ├── routes/users.js               # 新建
│   ├── controllers/authController.js # + updateAvatar
│   └── controllers/userController.js # 新建
```

### 前端 (3 个文件改动 + 1 个新建)

```
bbs-client/src/
├── api/index.js                      # + getUserProfile()
├── router/index.js                   # + /profile/:id 路由
├── App.vue                           # header 加头像显示 + 用户名链接
└── views/Profile.vue                 # 新建 - 个人主页
```

---

## 执行顺序

```
Step 1 (切 SQLite)
    ↓
Step 2 (头像上传 API)
Step 3 (用户信息 API)  ← 与 Step 2 可并行
Step 4 (Multer 路径调整)
    ↓
Step 5 (Header 头像)
Step 6 (个人主页)
Step 7 (入口链接)
```

---

## 验证方式

1. **数据库切换验证：** `npm run prisma:migrate` 成功，生成 `dev.db` 文件
2. **种子数据验证：** `npm run prisma:seed` 成功，admin 用户 + 4 个分类可用
3. **头像上传验证：** 用 curl 或前端页面上传头像，返回图片 URL
4. **Header 头像验证：** 登录后 header 显示头像，无头像显示首字母
5. **个人主页验证：** 访问 `/profile/1` 显示用户信息 + 帖子列表
6. **服务启动验证：** `npm run dev` 启动无报错，前后端联调通过
