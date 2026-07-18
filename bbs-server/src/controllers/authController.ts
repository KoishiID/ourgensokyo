/**
 * 认证控制器模块
 * 处理用户注册、登录、获取个人信息、更新头像
 */
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../utils/prisma'
import { sign } from '../utils/jwt'

/**
 * 用户注册
 * 创建新用户并返回 JWT token
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      res.status(400).json({ error: '请填写所有必填字段' })
      return
    }
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    })
    if (existing) {
      res.status(409).json({ error: '用户名或邮箱已存在' })
      return
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { username, email, password: hashed }
    })
    const token = sign({ id: user.id, username: user.username })
    res.status(201).json({
      token,
      user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 用户登录
 * 验证凭据并返回 JWT token
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ error: '请填写邮箱和密码' })
      return
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ error: '邮箱或密码错误' })
      return
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      res.status(401).json({ error: '邮箱或密码错误' })
      return
    }
    const token = sign({ id: user.id, username: user.username })
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 获取当前登录用户信息
 */
export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, username: true, email: true, avatar: true, createdAt: true }
    })
    if (!user) {
      res.status(404).json({ error: '用户不存在' })
      return
    }
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
}

/**
 * 更新用户头像
 */
export async function updateAvatar(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: '请选择头像文件' })
      return
    }
    const avatarUrl = `/uploads/avatars/${req.file.filename}`
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { avatar: avatarUrl }
    })
    res.json({ avatar: avatarUrl })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '头像更新失败' })
  }
}
