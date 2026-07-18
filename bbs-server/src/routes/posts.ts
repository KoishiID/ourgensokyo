/**
 * 帖子路由模块 — 前缀：/api/posts
 */
import { Router } from 'express'
import { create, list, getById, update, remove } from '../controllers/postController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', list)
router.get('/:id', getById)
router.post('/', authenticate, create)
router.put('/:id', authenticate, update)
router.delete('/:id', authenticate, remove)

export default router
