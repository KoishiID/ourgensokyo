/**
 * Express 类型扩展
 * 为 Request 对象添加 user 属性，用于挂载 JWT payload
 */
declare namespace Express {
  interface Request {
    user?: {
      id: number
      username: string
    }
  }
}
