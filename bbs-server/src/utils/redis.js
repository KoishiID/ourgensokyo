/**
 * Redis 工具模块
 * 提供 Redis 客户端的懒加载初始化与访问
 */
const redis = require('redis')

let client = null

/**
 * 连接 Redis 并返回客户端实例（单例懒加载）
 * @returns {Promise<import('redis').RedisClientType>} 已连接的 Redis 客户端
 */
async function connect() {
  if (client) return client
  client = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
  client.on('error', (err) => console.error('Redis error:', err))
  await client.connect()
  return client
}

/**
 * 获取当前 Redis 客户端实例（可能为 null）
 * @returns {import('redis').RedisClientType|null} Redis 客户端或 null
 */
function getClient() {
  return client
}

module.exports = { connect, getClient }
