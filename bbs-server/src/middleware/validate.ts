/**
 * 输入校验中间件模块
 * 基于 zod 的请求体校验
 */
import { Request, Response, NextFunction } from 'express'
import { z, ZodSchema } from 'zod'

/**
 * 校验中间件 — 验证请求体并返回 400 + 详细错误
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({
        error: '输入校验失败',
        details: result.error.flatten().fieldErrors
      })
      return
    }
    req.body = result.data
    next()
  }
}

// ─── 校验 Schema 定义 ───────────────────────────────────

/** 注册 */
export const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(8, '密码至少8位').max(128),
})

/** 登录 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

/** 创建帖子 */
export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  categoryId: z.number().int().positive(),
  images: z.array(z.string()).optional(),
})

/** 更新帖子（部分字段） */
export const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(50000).optional(),
  categoryId: z.number().int().positive().optional(),
  images: z.array(z.string()).optional(),
})

/** 创建评论 */
export const createCommentSchema = z.object({
  content: z.string().min(1).max(10000),
})
