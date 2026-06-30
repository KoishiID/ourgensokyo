/**
 * Prisma 数据库模块
 * 初始化 PrismaClient 单例并配置 PostgreSQL 适配器
 */
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const pg = require('pg')

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://ogsk:ogsk2024@localhost:5432/ourgenskoyo'
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

module.exports = prisma

/**
 * 回退方案 — SQLite（@prisma/adapter-libsql）
 * ============================================
 * const { PrismaLibSql } = require('@prisma/adapter-libsql')
 * const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./dev.db' })
 */
