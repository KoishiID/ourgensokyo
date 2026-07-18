/**
 * 分类路由模块 — 前缀：/api/categories
 */
import { Router } from 'express'
import { list } from '../controllers/categoryController'

const router = Router()

router.get('/', list)

export default router
