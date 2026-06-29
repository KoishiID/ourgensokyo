/**
 * 评论路由模块 — 前缀：/api/comments
 *
 * POST   /api/comments/:postId  (需认证) — 在指定帖子下创建评论
 * DELETE /api/comments/:id      (需认证) — 删除指定评论
 */
const { Router } = require('express')
const { create, remove } = require('../controllers/commentController')
const { authenticate } = require('../middleware/auth')

const router = Router()

// :postId 为目标帖子 ID
router.post('/:postId', authenticate, create)
// :id 为评论 ID
router.delete('/:id', authenticate, remove)

module.exports = router
