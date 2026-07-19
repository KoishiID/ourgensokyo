import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET as string
if (!SECRET) throw new Error('JWT_SECRET environment variable is required')

const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JwtPayload {
  id: number
  username: string
}

export function sign(payload: JwtPayload): string {
  // 给 options 添加类型断言，告诉 TypeScript 这是一个合法的 SignOptions
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions)
}

export function verify(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as unknown as JwtPayload
}
