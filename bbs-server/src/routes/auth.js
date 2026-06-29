/**
 * 认证路由模块 — 前缀：/api/auth
 *
 * POST /api/auth/register              — 注册新用户
 * POST /api/auth/login                 — 用户登录，返回 JWT
 * GET  /api/auth/profile  (需认证)     — 获取当前登录用户信息
 * PUT  /api/auth/avatar   (需认证)     — 更新用户头像
 */
const { Router } = require('express')
const { register, login, getProfile, updateAvatar } = require('../controllers/authController')
const { authenticate } = require('../middleware/auth')
const { uploadAvatar } = require('../middleware/upload')

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/profile', authenticate, getProfile)
// 使用 uploadAvatar 中间件处理 multipart/form-data，字段名 'avatar'
router.put('/avatar', authenticate, uploadAvatar.single('avatar'), updateAvatar)

module.exports = router
