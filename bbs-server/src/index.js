/**
 * 应用程序入口
 * 配置 Express 中间件与路由挂载，启动 HTTP 服务
 */
/**
 * BBS 服务器入口文件
 *
 * 中间件链（按顺序）：
 *   - cors()               — 跨域支持
 *   - express.json()       — JSON 请求体解析
 *   - /uploads 静态文件服务 — 提供上传文件访问
 *
 * 路由挂载：
 *   /api/auth       → authRoutes      — 认证相关（注册、登录、个人信息）
 *   /api/posts      → postRoutes      — 帖子 CRUD
 *   /api/comments   → commentRoutes   — 评论创建与删除
 *   /api/upload     → uploadRoutes    — 文件上传
 *   /api/categories → categoryRoutes  — 分类列表
 *   /api/users      → userRoutes      — 用户公开信息
 *   GET /api/health                   — 健康检查
 */
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/posts')
const commentRoutes = require('./routes/comments')
const uploadRoutes = require('./routes/upload')
const categoryRoutes = require('./routes/categories')
const userRoutes = require('./routes/users')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/users', userRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
