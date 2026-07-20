/**
 * 文件上传路由模块 — 前缀：/api/upload
 */
import { Router } from 'express'
import { uploadPost } from '../middleware/upload'
import { uploadFile } from '../controllers/uploadController'
import { authenticate } from '../middleware/auth'
import { uploadLimiter } from '../middleware/rateLimiter'

const router = Router()

router.post('/', authenticate, uploadLimiter, uploadPost.single('file'), uploadFile)

export default router
