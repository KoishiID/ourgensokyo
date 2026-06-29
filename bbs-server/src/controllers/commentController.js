const prisma = require('../utils/prisma')

/**
 * 创建评论
 * @param {import('express').Request} req - 请求对象，req.body 含 content，req.params.postId 为目标帖子 ID
 * @param {import('express').Response} res - 响应对象
 * @returns {Promise<void>}
 */
async function create(req, res) {
  try {
    const { content } = req.body
    const postId = Number(req.params.postId)
    if (!content) return res.status(400).json({ error: '评论内容不能为空' })
    // 确保目标帖子存在，不存在则拒绝评论
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) return res.status(404).json({ error: '帖子不存在' })
    const comment = await prisma.comment.create({
      data: { content, postId, userId: req.user.id },
      include: { user: { select: { id: true, username: true, avatar: true } } }
    })
    res.status(201).json(comment)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 删除评论（仅评论作者可操作）
 * @param {import('express').Request} req - 请求对象，req.params.id 为评论 ID
 * @param {import('express').Response} res - 响应对象
 * @returns {Promise<void>}
 */
async function remove(req, res) {
  try {
    const id = Number(req.params.id)
    const comment = await prisma.comment.findUnique({ where: { id } })
    if (!comment) return res.status(404).json({ error: '评论不存在' })
    // 校验当前用户是否为评论作者
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: '无权删除此评论' })
    }
    await prisma.comment.delete({ where: { id } })
    res.json({ message: '删除成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

module.exports = { create, remove }
