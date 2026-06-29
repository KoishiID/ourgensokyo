const { verify } = require('../utils/jwt')

/**
 * JWT 认证中间件
 * 从 Authorization 请求头中提取 Bearer 令牌并验证
 * @param {import('express').Request} req - Express 请求对象
 * @param {import('express').Response} res - Express 响应对象
 * @param {import('express').NextFunction} next - Express 下一个中间件函数
 * @returns {void}
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未提供认证令牌' })
  }
  try {
    const payload = verify(header.split(' ')[1])
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: '令牌无效或已过期' })
  }
}

module.exports = { authenticate }
