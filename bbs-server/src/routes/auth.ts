/**
 * 认证路由模块 — 前缀：/api/auth
 */
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { register, login, getProfile, updateAvatar } from '../controllers/authController'
import { authenticate } from '../middleware/auth'
import { uploadAvatar } from '../middleware/upload'

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: '请求过于频繁，请稍后再试' }
})

const router = Router()

router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.get('/profile', authenticate, getProfile)
router.put('/avatar', authenticate, uploadAvatar.single('avatar'), updateAvatar)

export default router
