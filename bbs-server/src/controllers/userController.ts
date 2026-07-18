/**
 * 用户控制器模块
 * 处理用户公开信息查询
 */
import { Request, Response } from 'express'
import prisma from '../utils/prisma'

/**
 * 获取指定用户的信息及其帖子列表（分页）
 */
export async function getUserProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = Number(req.params.id)
    const page = Math.max(1, Number(req.query.page) || 1)
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20))

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true, avatar: true, createdAt: true }
    })
    if (!user) {
      res.status(404).json({ error: '用户不存在' })
      return
    }

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
