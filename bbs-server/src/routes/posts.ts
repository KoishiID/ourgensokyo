/**
 * 帖子路由模块 — 前缀：/api/posts
 */
import { Router } from 'express'
import { create, list, getById, update, remove } from '../controllers/postController'
import { authenticate } from '../middleware/auth'
import { writeLimiter } from '../middleware/rateLimiter'
import { validate, createPostSchema, updatePostSchema } from '../middleware/validate'

const router = Router()

router.get('/', list)
router.get('/:id', getById)
router.post('/', authenticate, writeLimiter, validate(createPostSchema), create)
router.put('/:id', authenticate, writeLimiter, validate(updatePostSchema), update)
router.delete('/:id', authenticate, remove)

export default router
