/**
 * JWT 认证中间件
 * 从 Authorization 请求头中提取 Bearer 令牌并验证
 */
import { Request, Response, NextFunction } from 'express'
import { verify } from '../utils/jwt'

/**
 * 认证中间件 — 验证 JWT token 并将用户信息挂载到 req.user
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: '未提供认证令牌' })
    return
  }
  try {
    const payload = verify(header.split(' ')[1])
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: '令牌无效或已过期' })
  }
}
