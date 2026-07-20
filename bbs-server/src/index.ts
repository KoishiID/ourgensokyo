/**
 * 应用程序入口
 * 配置 Express 中间件与路由挂载，启动 HTTP 服务
 */
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'

import authRoutes from './routes/auth'
import postRoutes from './routes/posts'
import commentRoutes from './routes/comments'
import uploadRoutes from './routes/upload'
import categoryRoutes from './routes/categories'
import userRoutes from './routes/users'
import { globalLimiter } from './middleware/rateLimiter'

const app = express()
const PORT = process.env.PORT || 3000

// ─── 生产环境安全配置 ───────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.disable('x-powered-by')
  app.set('trust proxy', 1) // 位于 CF Tunnel / Nginx 之后
  app.set('etag', 'strong')
}

// ─── 安全头 + CORS + 请求体限制 + 全局限流 ─────────────
const corsOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173']
app.use(helmet())
app.use(globalLimiter)
app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '1mb' }))

// ─── 静态文件 ───────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ─── 路由挂载 ───────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/users', userRoutes)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
