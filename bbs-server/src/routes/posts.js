/**
 * 帖子路由模块 — 前缀：/api/posts
 *
 * GET    /api/posts       — 获取帖子列表
 * GET    /api/posts/:id   — 获取单篇帖子详情
 * POST   /api/posts       (需认证) — 创建新帖子
 * PUT    /api/posts/:id   (需认证) — 更新帖子
 * DELETE /api/posts/:id   (需认证) — 删除帖子
 */
const { Router } = require('express')
const { create, list, getById, update, remove } = require('../controllers/postController')
const { authenticate } = require('../middleware/auth')

const router = Router()

router.get('/', list)
router.get('/:id', getById)
router.post('/', authenticate, create)
router.put('/:id', authenticate, update)
router.delete('/:id', authenticate, remove)

module.exports = router
