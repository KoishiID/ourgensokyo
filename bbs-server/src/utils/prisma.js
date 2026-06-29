/**
 * Prisma 数据库模块
 * 初始化 PrismaClient 单例并配置 LibSQL 适配器
 */
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db'
})
const prisma = new PrismaClient({ adapter })

module.exports = prisma
