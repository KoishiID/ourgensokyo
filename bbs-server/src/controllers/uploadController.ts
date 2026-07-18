/**
 * 文件上传控制器模块
 * 处理文件上传并返回可访问的 URL
 */
import { Request, Response } from 'express'

/**
 * 处理文件上传并返回可访问的 URL
 */
export async function uploadFile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: '请选择文件' })
      return
    }
    res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '上传失败' })
  }
}
