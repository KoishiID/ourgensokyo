# Ourgensokyo 数据库设计

> 当前存储：PostgreSQL 16（Prisma ORM + @prisma/adapter-pg）
> 开发环境：Docker Compose 自动启动 postgres:16-alpine 容器

---

## 一、ER 关系

```
User (1) ──< Post (N) ──< Comment (N)
  │                        │
  └────────────────────────┘
Category (1) ──< Post (N)
```

## 二、表结构

### User — 用户表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | Integer | PK, auto | 用户 ID |
| username | String | UNIQUE, NOT NULL | 用户名 |
| email | String | UNIQUE, NOT NULL | 邮箱 |
| password | String | NOT NULL | bcrypt 哈希 |
| avatar | String? | nullable | 头像路径 |
| created_at | DateTime | auto now() | 注册时间 |
| updated_at | DateTime | auto | 更新时间 |

### Category — 分类表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | Integer | PK, auto | 分类 ID |
| name | String | UNIQUE, NOT NULL | 分类名称 |
| description | String? | nullable | 描述 |
| created_at | DateTime | auto now() | 创建时间 |

### Post — 帖子表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | Integer | PK, auto | 帖子 ID |
| title | String | NOT NULL | 标题 |
| content | String | NOT NULL | 内容 |
| images | String? | nullable | JSON 数组 |
| user_id | Integer | FK→User.id | 作者 ID |
| category_id | Integer | FK→Category.id | 分类 ID |
| created_at | DateTime | auto now() | 发布时间 |
| updated_at | DateTime | auto | 更新时间 |

### Comment — 评论表
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | Integer | PK, auto | 评论 ID |
| content | String | NOT NULL | 内容 |
| post_id | Integer | FK→Post.id | 所属帖子 |
| user_id | Integer | FK→User.id | 作者 ID |
| created_at | DateTime | auto now() | 评论时间 |

---

## 三、命名约定

| 规范 | 规则 | 示例 |
|------|------|------|
| 表名 | 复数 snake_case | users, posts |
| 模型名 | PascalCase 单数 | User, Post |
| Prisma→DB | camelCase→snake_case | createdAt→created_at |
| 外键 | 表名_id | user_id |
| 映射 | @map / @@map | @@map("users") |

---

## 四、数据库迁移记录（SQLite → PostgreSQL）

### 迁移已完成 ✅

| 阶段 | 状态 | 说明 |
|------|------|------|
| SQLite 开发原型 | ✅ 已完成 | 项目初期使用 SQLite 快速验证业务逻辑 |
| PostgreSQL 切换 | ✅ 已完成 | schema provider 改为 postgresql，PrismaPg 适配器就绪 |
| Docker PG 容器 | ✅ 已完成 | docker-compose 含 postgres:16-alpine 服务 |
| 数据迁移 | ✅ 已完成 | 开发环境通过 prisma migrate dev 同步 |

### 经验总结
- Prisma ORM 的抽象层让数据库切换非常平滑：只改了 datasource provider 和 DATABASE_URL
- 从 SQLite 到 PostgreSQL 的迁移经历加深了对数据库选型影响的理解

### 已创建的索引
```sql
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_users_email ON users(email);
```
