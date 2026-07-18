/**
 * 用户路由模块 — 前缀：/api/users
 */
import { Router } from 'express'
import { getUserProfile } from '../controllers/userController'

const router = Router()

router.get('/:id', getUserProfile)

export default router
