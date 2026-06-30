/**
 * Prisma 配置文件 — 定义数据库连接、schema 路径与迁移种子脚本。
 *
 * - schema: 指向 Prisma schema 文件位置
 * - migrations.seed: 迁移完成后自动执行的种子脚本命令
 * - datasource.url: 数据库连接字符串，从环境变量 `DATABASE_URL` 读取
 *
 * 在运行 `prisma migrate dev` 或 `prisma db push` 时生效。
 */
import { defineConfig } from '@prisma/config'
import { config } from 'dotenv'

config()

/**
 * Prisma 编译时配置。
 *
 * 使用 `@prisma/config` 的 `defineConfig` 提供类型安全的配置对象，
 * 配合 `dotenv` 加载 `.env` 文件中的 `DATABASE_URL` 环境变量。
 */
export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    seed: 'node prisma/seed.js'
  },
  datasource: {
    url: process.env.DATABASE_URL
  }
})
