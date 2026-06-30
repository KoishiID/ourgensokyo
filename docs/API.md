# Ourgensokyo API 接口文档

> 基础 URL: http://localhost:3000（开发）
> 所有 API 前缀: /api

---

## 通用说明

### 鉴权方式
Authorization: Bearer <token>
Token 有效期 7 天（可在 .env 中配置 JWT_EXPIRES_IN）。

### 响应格式
成功: { "id": 1, "username": "test", ... }
失败: { "error": "错误描述" }
分页: { "posts": [...], "total": 100, "page": 1, "pageSize": 20, "totalPages": 5 }

### HTTP 状态码
| 码 | 含义 |
|----|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 参数错误 |
| 401 | Token 无效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 500 | 服务器错误 |

---

## 一、认证模块

### POST /api/auth/register — 注册
Request: { "username": "test", "email": "test@test.com", "password": "123456" }
Response 201: { "token": "eyJ...", "user": { "id": 1, "username": "test", "email": "test@test.com" } }
Error 400: { "error": "用户名、邮箱和密码不能为空" }
Error 409: { "error": "用户名或邮箱已存在" }

### POST /api/auth/login — 登录
Request: { "email": "test@test.com", "password": "123456" }
Response 200: { "token": "eyJ...", "user": { "id": 1, "username": "test", "email": "test@test.com", "avatar": "/uploads/avatars/xxx.jpg" } }
Error 401: { "error": "邮箱或密码错误" }

### GET /api/auth/profile — 获取当前用户（需认证）
Header: Authorization: Bearer <token>
Response 200: { "id": 1, "username": "test", "email": "test@test.com", "avatar": "...", "createdAt": "..." }

### PUT /api/auth/avatar — 更新头像（需认证）
Header: Authorization: Bearer <token>
Content-Type: multipart/form-data, field: avatar
限制: 2MB, jpg/png/gif/webp
Response 200: { "avatar": "/uploads/avatars/xxx.jpg" }

---

## 二、帖子模块

### GET /api/posts — 帖子列表（分页）
Query: page=1&pageSize=20&categoryId=1
Response 200: { "posts": [{ "id":1, "title":"...", "content":"...", "user":{...}, "category":{...}, "_count":{"comments":5} }], "total":100, "page":1, "pageSize":20, "totalPages":5 }

### GET /api/posts/:id — 帖子详情
Response 200: { "id":1, "title":"...", "content":"...", "user":{...}, "category":{...}, "comments":[{...}] }

### POST /api/posts — 创建帖子（需认证）
Request: { "title": "标题", "content": "内容", "categoryId": 1, "images": ["url"] }
Response 201: { "id": 1, "title": "...", "content": "...", ... }

### PUT /api/posts/:id — 更新帖子（需认证，仅作者）
Request: { "title": "新标题" }
Response 200: { "id":1, "title":"新标题", ... }
Error 403: { "error": "无权修改此帖子" }

### DELETE /api/posts/:id — 删除帖子（需认证，仅作者）
Response 200: { "message": "删除成功" }

---

## 三、评论模块

### POST /api/comments/:postId — 创建评论（需认证）
Request: { "content": "评论内容" }
Response 201: { "id":1, "content":"...", "postId":1, "userId":1, "user":{...} }

### DELETE /api/comments/:id — 删除评论（需认证，仅作者）
Response 200: { "message": "删除成功" }

---

## 四、分类模块

### GET /api/categories — 全部分类
Response 200: [{ "id":1, "name":"综合讨论", "description":"...", "createdAt":"..." }]

---

## 五、用户模块

### GET /api/users/:id — 用户公开信息
Query: page=1&pageSize=20
Response 200: { "user": { "id":1, "username":"...", "avatar":"..." }, "posts": { "posts":[...], "total":10, "page":1, "pageSize":20 } }

---

## 六、上传模块

### POST /api/upload — 上传文件（需认证）
Content-Type: multipart/form-data, field: file
限制: 5MB, jpg/png/gif/webp
Response 200: { "url": "/uploads/xxx.jpg", "filename": "xxx.jpg" }

---

## 七、健康检查

### GET /api/health
Response 200: { "status": "ok" }
