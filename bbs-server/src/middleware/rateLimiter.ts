/**
 * 速限流中间件模块
 * 分层限流：全局 + 写操作 + 上传 + 认证
 */
import rateLimit from 'express-rate-limit'

// 全局限流: 100 req/min
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: '请求过于频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false,
})

// 写操作限流: 30 req/min
export const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: '操作过于频繁，请稍后再试' },
})

// 上传限流: 10 req/min
export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: '上传过于频繁，请稍后再试' },
})

// 认证限流: 5 req/min
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: '请求过于频繁，请稍后再试' },
})
