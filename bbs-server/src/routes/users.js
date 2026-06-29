/**
 * 用户路由模块 — 前缀：/api/users
 *
 * GET /api/users/:id — 获取指定用户的公开信息
 */
const { Router } = require('express')
const { getUserProfile } = require('../controllers/userController')

const router = Router()

router.get('/:id', getUserProfile)

module.exports = router
