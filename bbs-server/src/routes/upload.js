/**
 * 文件上传路由模块 — 前缀：/api/upload
 *
 * POST /api/upload (需认证) — 上传文件（帖子附件）
 */
const { Router } = require('express')
const { uploadPost } = require('../middleware/upload')
const { uploadFile } = require('../controllers/uploadController')
const { authenticate } = require('../middleware/auth')

const router = Router()

// 使用 uploadPost 中间件处理 multipart/form-data，字段名 'file'
router.post('/', authenticate, uploadPost.single('file'), uploadFile)

module.exports = router
