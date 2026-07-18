/**
 * 帖子控制器模块
 * 处理帖子的 CRUD 操作
 */
import { Request, Response } from 'express'
import prisma from '../utils/prisma'

/**
 * 获取帖子列表（支持分页和分类筛选）
 */
export async function list(req: Request, res: Response): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20))
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined

    const where = categoryId ? { categoryId } : {}
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
 * 获取单篇帖子详情
 */
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id)
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        category: { select: { id: true, name: true } },
        comments: {
          include: { user: { select: { id: true, username: true, avatar: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    if (!post) {
      res.status(404).json({ error: '帖子不存在' })
      return
    }
    res.json(post)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 创建新帖子
 */
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const { title, content, categoryId, images } = req.body
    if (!title || !content || !categoryId) {
      res.status(400).json({ error: '请填写标题、内容和分类' })
      return
    }
    const post = await prisma.post.create({
      data: {
        title,
        content,
        categoryId: Number(categoryId),
        userId: req.user!.id,
        images: images ? JSON.stringify(images) : null
      },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        category: { select: { id: true, name: true } }
      }
    })
    res.status(201).json(post)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 更新帖子
 * 仅帖子作者可更新
 */
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id)
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) {
      res.status(404).json({ error: '帖子不存在' })
      return
    }
    if (post.userId !== req.user!.id) {
      res.status(403).json({ error: '无权编辑此帖子' })
      return
    }
    const { title, content, categoryId, images } = req.body
    const updated = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(categoryId && { categoryId: Number(categoryId) }),
        ...(images !== undefined && { images: images ? JSON.stringify(images) : null })
      },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        category: { select: { id: true, name: true } }
      }
    })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 删除帖子
 * 仅帖子作者可删除
 */
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id)
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) {
      res.status(404).json({ error: '帖子不存在' })
      return
    }
    if (post.userId !== req.user!.id) {
      res.status(403).json({ error: '无权删除此帖子' })
      return
    }
    await prisma.post.delete({ where: { id } })
    res.json({ message: '删除成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}
