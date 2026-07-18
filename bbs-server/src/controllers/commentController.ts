/**
 * 评论控制器模块
 * 处理评论的创建和删除操作
 */
import { Request, Response } from 'express'
import prisma from '../utils/prisma'

/**
 * 创建评论
 * 在指定帖子下创建新评论，需先验证帖子存在
 */
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const { content } = req.body
    const postId = Number(req.params.postId)
    if (!content) {
      res.status(400).json({ error: '评论内容不能为空' })
      return
    }
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) {
      res.status(404).json({ error: '帖子不存在' })
      return
    }
    const comment = await prisma.comment.create({
      data: { content, postId, userId: req.user!.id },
      include: { user: { select: { id: true, username: true, avatar: true } } }
    })
    res.status(201).json(comment)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 删除评论
 * 仅评论作者可删除自己的评论
 */
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id)
    const comment = await prisma.comment.findUnique({ where: { id } })
    if (!comment) {
      res.status(404).json({ error: '评论不存在' })
      return
    }
    if (comment.userId !== req.user!.id) {
      res.status(403).json({ error: '无权删除此评论' })
      return
    }
    await prisma.comment.delete({ where: { id } })
    res.json({ message: '删除成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}
