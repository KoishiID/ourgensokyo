/**
 * 认证路由模块 — 前缀：/api/auth
 *
 * POST /api/auth/register              — 注册新用户
 * POST /api/auth/login                 — 用户登录，返回 JWT
 * GET  /api/auth/profile  (需认证)     — 获取当前登录用户信息
 * PUT  /api/auth/avatar   (需认证)     — 更新用户头像
 */
const { Router } = require('express')
const rateLimit = require('express-rate-limit')
const { register, login, getProfile, updateAvatar } = require('../controllers/authController')
const { authenticate } = require('../middleware/auth')
const { uploadAvatar } = require('../middleware/upload')

// 登录/注册限流：每 IP 每分钟最多 5 次
const authLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 分钟
  max: 5,                  // 最多 5 次
  message: { error: '请求过于频繁，请稍后再试' }
})
const router = Router()

router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.get('/profile', authenticate, getProfile)
// 使用 uploadAvatar 中间件处理 multipart/form-data，字段名 'avatar'
router.put('/avatar', authenticate, uploadAvatar.single('avatar'), updateAvatar)

module.exports = router
