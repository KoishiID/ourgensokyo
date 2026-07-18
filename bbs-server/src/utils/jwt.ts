/**
 * JWT 签发与验证工具模块
 * 用于用户认证令牌的生成和验证
 */
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET
if (!SECRET) throw new Error('JWT_SECRET environment variable is required')
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/**
 * 自定义 JWT 载荷接口
 */
export interface JwtPayload {
  id: number
  username: string
}

/**
 * 签发 JWT 令牌
 * @param payload - 要签入令牌的载荷数据
 * @returns 签发的 JWT 令牌字符串
 */
export function sign(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions)
}

/**
 * 验证 JWT 令牌
 * @param token - 待验证的 JWT 令牌
 * @returns 解码后的令牌载荷
 * @throws 令牌无效或过期时抛出错误
 */
export function verify(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload
}
