/**
 * 评论路由模块 — 前缀：/api/comments
 */
import { Router } from 'express'
import { create, remove } from '../controllers/commentController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/:postId', authenticate, create)
router.delete('/:id', authenticate, remove)

export default router
