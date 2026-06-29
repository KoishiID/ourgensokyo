/**
 * 分类路由模块 — 前缀：/api/categories
 *
 * GET /api/categories — 获取全部分类列表（按 id 升序排列）
 *
 * 说明：该路由直接在此文件中定义处理函数，未使用外部控制器模块。
 */
const { Router } = require('express')
const prisma = require('../utils/prisma')
const router = Router()

router.get('/', async (req, res) => {
  try {
    // 按 id 升序返回全部分类
    const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } })
    res.json(categories)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
})

module.exports = router
