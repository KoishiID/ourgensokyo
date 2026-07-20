/**
 * 认证路由模块 — 前缀：/api/auth
 */
import { Router } from 'express'
import { register, login, getProfile, updateAvatar } from '../controllers/authController'
import { authenticate } from '../middleware/auth'
import { uploadAvatar } from '../middleware/upload'
import { authLimiter } from '../middleware/rateLimiter'
import { validate, registerSchema, loginSchema } from '../middleware/validate'

const router = Router()

router.post('/register', authLimiter, validate(registerSchema), register)
router.post('/login', authLimiter, validate(loginSchema), login)
router.get('/profile', authenticate, getProfile)
router.put('/avatar', authenticate, uploadAvatar.single('avatar'), updateAvatar)

export default router
