const prisma = require('../utils/prisma')

async function list(req, res) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } })
    res.json(categories)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

module.exports = { list }