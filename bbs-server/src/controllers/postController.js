const prisma = require('../utils/prisma')

/**
 * 创建新帖子
 * @param {import('express').Request} req - 请求对象，req.body 含 title, content, categoryId, images
 * @param {import('express').Response} res - 响应对象
 * @returns {Promise<void>}
 */
async function create(req, res) {
  try {
    const { title, content, categoryId, images } = req.body
    if (!title || !content || !categoryId) {
      return res.status(400).json({ error: '标题、内容和分类不能为空' })
    }
    const post = await prisma.post.create({
      data: {
        title,
        content,
        categoryId: Number(categoryId),
        userId: req.user.id,
        // images 数组序列化为 JSON 字符串存储
        images: images ? JSON.stringify(images) : null
      },
      include: { user: { select: { id: true, username: true, avatar: true } } }
    })
    res.status(201).json(post)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 分页获取帖子列表，支持按分类筛选
 * @param {import('express').Request} req - 请求对象，req.query 含 page, pageSize, categoryId
 * @param {import('express').Response} res - 响应对象
 * @returns {Promise<void>}
 */
async function list(req, res) {
  try {
    // 页码最小为 1，页大小限制在 1~50 之间
    const page = Math.max(1, Number(req.query.page) || 1)
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20))
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined
    // 按分类筛选：若传递了 categoryId 则添加到查询条件
    const where = categoryId ? { categoryId } : {}
    // 并行查询帖子列表和总数，用于计算总页数
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, username: true, avatar: true } },
          category: { select: { id: true, name: true } },
          _count: { select: { comments: true } }
        }
      }),
      prisma.post.count({ where })
    ])
    res.json({ posts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 根据 ID 获取单个帖子详情，包含作者、分类和评论列表
 * @param {import('express').Request} req - 请求对象，req.params.id 为帖子 ID
 * @param {import('express').Response} res - 响应对象
 * @returns {Promise<void>}
 */
async function getById(req, res) {
  try {
    const id = Number(req.params.id)
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        category: { select: { id: true, name: true } },
        // 评论按创建时间升序排列
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, username: true, avatar: true } } }
        }
      }
    })
    if (!post) return res.status(404).json({ error: '帖子不存在' })
    res.json(post)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 更新帖子内容（仅作者可操作）
 * @param {import('express').Request} req - 请求对象，req.params.id 为帖子 ID，req.body 含 title, content, categoryId, images
 * @param {import('express').Response} res - 响应对象
 * @returns {Promise<void>}
 */
async function update(req, res) {
  try {
    const id = Number(req.params.id)
    const existing = await prisma.post.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: '帖子不存在' })
    // 校验当前用户是否为帖子作者
    if (existing.userId !== req.user.id) {
      return res.status(403).json({ error: '无权修改此帖子' })
    }
    const { title, content, categoryId, images } = req.body
    const post = await prisma.post.update({
      where: { id },
      // 仅更新请求中显式传递的字段，未传递的字段保持原值
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(categoryId !== undefined && { categoryId: Number(categoryId) }),
        ...(images !== undefined && { images: JSON.stringify(images) })
      }
    })
    res.json(post)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 删除帖子及其所有评论（仅作者可操作）
 * @param {import('express').Request} req - 请求对象，req.params.id 为帖子 ID
 * @param {import('express').Response} res - 响应对象
 * @returns {Promise<void>}
 */
async function remove(req, res) {
  try {
    const id = Number(req.params.id)
    const existing = await prisma.post.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: '帖子不存在' })
    // 校验当前用户是否为帖子作者
    if (existing.userId !== req.user.id) {
      return res.status(403).json({ error: '无权删除此帖子' })
    }
    // 先级联删除该帖子下的所有评论，再删除帖子本身
    await prisma.comment.deleteMany({ where: { postId: id } })
    await prisma.post.delete({ where: { id } })
    res.json({ message: '删除成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

module.exports = { create, list, getById, update, remove }
