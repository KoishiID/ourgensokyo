const bcrypt = require('bcryptjs')
const { sign } = require('../utils/jwt')
const prisma = require('../utils/prisma')

/**
 * 用户注册
 * @param {import('express').Request} req - 请求对象，req.body 含 username, email, password
 * @param {import('express').Response} res - 响应对象
 * @returns {Promise<void>}
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({ error: '用户名、邮箱和密码不能为空' })
    }
    // 检查用户名或邮箱是否已被注册
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    })
    if (existing) {
      return res.status(409).json({ error: '用户名或邮箱已存在' })
    }
    // 密码加盐哈希（10 轮 bcrypt）
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { username, email, password: hashed }
    })
    // 注册成功后签发 JWT
    const token = sign({ id: user.id, username: user.username })
    res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 用户登录
 * @param {import('express').Request} req - 请求对象，req.body 含 email, password
 * @param {import('express').Response} res - 响应对象
 * @returns {Promise<void>}
 */
async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }
    // 比较明文密码与数据库中存储的哈希值
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }
    // 登录成功后签发 JWT
    const token = sign({ id: user.id, username: user.username })
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 获取当前登录用户的个人信息
 * @param {import('express').Request} req - 请求对象，req.user 由 JWT 中间件注入
 * @param {import('express').Response} res - 响应对象
 * @returns {Promise<void>}
 */
async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, email: true, avatar: true, createdAt: true }
    })
    if (!user) return res.status(404).json({ error: '用户不存在' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 更新当前用户的头像 URL
 * @param {import('express').Request} req - 请求对象，req.file 由 multer 中间件填充
 * @param {import('express').Response} res - 响应对象
 * @returns {Promise<void>}
 */
async function updateAvatar(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: '请选择头像文件' })
    // 构造可公开访问的头像 URL 路径
    const avatarUrl = `/uploads/avatars/${req.file.filename}`
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: avatarUrl }
    })
    res.json({ avatar: user.avatar })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '头像上传失败' })
  }
}

module.exports = { register, login, getProfile, updateAvatar }
