/**
 * JWT 工具模块
 * 提供 JWT 令牌的签发与验证功能
 */
const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'fallback-secret'
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/**
 * 签发 JWT 令牌
 * @param {object} payload - 要签入令牌的载荷数据
 * @returns {string} 签发的 JWT 令牌字符串
 */
function sign(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN })
}

/**
 * 验证 JWT 令牌
 * @param {string} token - 待验证的 JWT 令牌
 * @returns {object} 解码后的令牌载荷
 * @throws 令牌无效或过期时抛出错误
 */
function verify(token) {
  return jwt.verify(token, SECRET)
}

module.exports = { sign, verify }
