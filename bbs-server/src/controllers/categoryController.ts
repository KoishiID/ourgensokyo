/**
 * 分类控制器模块
 * 处理分类列表查询
 */
import { Request, Response } from 'express'
import prisma from '../utils/prisma'

/**
 * 获取全部分类列表
 * 按 ID 升序排列返回
 */
export async function list(_req: Request, res: Response): Promise<void> {
  try {
    const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } })
    res.json(categories)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}
