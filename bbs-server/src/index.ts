/**
 * 应用程序入口
 * 配置 Express 中间件与路由挂载，启动 HTTP 服务
 */
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'

import authRoutes from './routes/auth'
import postRoutes from './routes/posts'
import commentRoutes from './routes/comments'
import uploadRoutes from './routes/upload'
import categoryRoutes from './routes/categories'
import userRoutes from './routes/users'

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

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
