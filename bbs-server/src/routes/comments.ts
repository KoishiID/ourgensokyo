/**
 * 评论路由模块 — 前缀：/api/comments
 */
import { Router } from 'express'
import { create, remove } from '../controllers/commentController'
import { authenticate } from '../middleware/auth'
import { writeLimiter } from '../middleware/rateLimiter'
import { validate, createCommentSchema } from '../middleware/validate'

const router = Router()

router.post('/:postId', authenticate, writeLimiter, validate(createCommentSchema), create)
router.delete('/:id', authenticate, remove)

export default router
