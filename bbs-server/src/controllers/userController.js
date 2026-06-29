const prisma = require('../utils/prisma')

/**
 * 获取指定用户的信息及其帖子列表（分页）
 * @param {import('express').Request} req - 请求对象，req.params.id 为用户 ID，req.query 含 page, pageSize
 * @param {import('express').Response} res - 响应对象
 * @returns {Promise<void>}
 */
async function getUserProfile(req, res) {
  try {
    const userId = Number(req.params.id)
    // 页码最小为 1，页大小限制在 1~50 之间
    const page = Math.max(1, Number(req.query.page) || 1)
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20))

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true, avatar: true, createdAt: true }
    })
    if (!user) return res.status(404).json({ error: '用户不存在' })

    // 并行查询该用户的帖子列表和总数
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { userId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true } },
          _count: { select: { comments: true } }
        }
      }),
      prisma.post.count({ where: { userId } })
    ])

    res.json({
      user,
      posts: { posts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

module.exports = { getUserProfile }
