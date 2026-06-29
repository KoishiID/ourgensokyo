/**
 * 数据库填充脚本 — 为 BBS 系统创建初始种子数据。
 *
 * 该脚本由 `prisma.config.ts` 中的种子配置触发（`node prisma/seed.js`），
 * 在数据库迁移完成后执行。
 *
 * 种子数据包括：
 * - 管理员用户（admin@bbs.com）
 * - 四个默认分类（技术讨论、项目展示、问答求助、闲聊水区）
 */
const bcrypt = require('bcryptjs')
const prisma = require('../src/utils/prisma')

/**
 * 执行种子数据创建。
 *
 * 1. 使用 upsert 创建管理员账号（邮箱去重），密码经 bcrypt 哈希。
 * 2. 使用 upsert 创建四个默认分类（名称去重）。
 * 3. 在控制台输出已创建的种子摘要。
 */
async function main() {
  // 创建管理员用户：邮箱去重，密码使用 bcrypt 哈希存储
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bbs.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@bbs.com',
      password: await bcrypt.hash('123456', 10)
    }
  })

  // 创建四个默认分类（名称去重），覆盖主要讨论方向
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: '技术讨论' }, update: {}, create: { name: '技术讨论', description: '技术相关话题交流' } }),
    prisma.category.upsert({ where: { name: '项目展示' }, update: {}, create: { name: '项目展示', description: '展示你的作品' } }),
    prisma.category.upsert({ where: { name: '问答求助' }, update: {}, create: { name: '问答求助', description: '遇到问题来这里求助' } }),
    prisma.category.upsert({ where: { name: '闲聊水区' }, update: {}, create: { name: '闲聊水区', description: '随便聊聊' } })
  ])

  // 输出已创建的种子数据摘要
  console.log('Seed data created:', { admin: admin.username, categories: categories.map(c => c.name) })
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect().catch(() => {}))
