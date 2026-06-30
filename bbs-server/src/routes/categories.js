/**
 * 分类路由模块 — 前缀：/api/categories
 *
 * GET /api/categories — 获取全部分类列表（按 id 升序排列）
 *
 * 说明：路由层仅做请求分发，业务逻辑委托给 categoryController。
 */
const { Router } = require('express')
const { list } = require('../controllers/categoryController')
const router = Router()

router.get('/', list)

module.exports = router