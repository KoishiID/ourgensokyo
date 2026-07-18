/**
 * API 客户端模块
 * 基于 Axios 封装，自动附加 JWT Token 到请求头，
 * 统一处理响应数据解包（res → res.data）和错误拦截。
 */
import axios, { AxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: '/api'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err.response?.data || err)
)

/**
 * 用户登录
 * @param data - 登录表单数据（含 email, password）
 * @returns 包含 token 和用户信息的响应数据
 */
export function login(data: { email: string; password: string }) {
  return api.post('/auth/login', data) as Promise<{ token: string; user: User }>
}

/**
 * 用户注册
 * @param data - 注册表单数据（含 username, email, password）
 * @returns 注册结果
 */
export function register(data: { username: string; email: string; password: string }) {
  return api.post('/auth/register', data) as Promise<{ token: string; user: User }>
}

/**
 * 获取当前登录用户信息
 */
export function getProfile() {
  return api.get('/auth/profile') as Promise<User>
}

/**
 * 获取所有分类列表
 */
export function getCategories() {
  return api.get('/categories') as Promise<Category[]>
}

/**
 * 获取帖子列表（支持分页和筛选）
 */
export function getPosts(params: { page?: number; pageSize?: number; categoryId?: number }) {
  return api.get('/posts', { params }) as Promise<{ posts: Post[]; total: number; page: number; pageSize: number; totalPages: number }>
}

/**
 * 获取单个帖子详情
 */
export function getPost(id: string | number) {
  return api.get(`/posts/${id}`) as Promise<PostDetail>
}

/**
 * 创建新帖子
 */
export function createPost(data: { title: string; content: string; categoryId: number; images?: string[] }) {
  return api.post('/posts', data) as Promise<PostDetail>
}

/**
 * 更新帖子
 */
export function updatePost(id: string | number, data: { title: string; content: string; categoryId: number; images?: string[] }) {
  return api.put(`/posts/${id}`, data) as Promise<PostDetail>
}

/**
 * 删除帖子
 */
export function deletePost(id: string | number) {
  return api.delete(`/posts/${id}`) as Promise<void>
}

/**
 * 创建评论
 */
export function createComment(postId: string | number, data: { content: string }) {
  return api.post(`/comments/${postId}`, data) as Promise<Comment>
}

/**
 * 删除评论
 */
export function deleteComment(id: string | number) {
  return api.delete(`/comments/${id}`) as Promise<void>
}

/**
 * 获取指定用户的公开信息
 */
export function getUserProfile(id: string | number, params?: { page?: number }) {
  return api.get(`/users/${id}`, { params }) as Promise<{ user: User; posts: { posts: Post[]; total: number; page: number; pageSize: number; totalPages: number } }>
}

/**
 * 上传文件（如图片、附件）
 */
export function uploadFile(file: File) {
  const form = new FormData()
  form.append('file', file)
  return api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }) as Promise<{ url: string; filename: string }>
}

// --- Type Definitions ---

export interface User {
  id: number
  username: string
  email: string
  avatar: string | null
  createdAt: string
}

export interface Category {
  id: number
  name: string
  description?: string
}

export interface Post {
  id: number
  title: string
  content: string
  categoryId: number
  images: string | null
  createdAt: string
  userId: number
  user: Pick<User, 'id' | 'username' | 'avatar'>
  category: Pick<Category, 'id' | 'name'>
  _count?: { comments: number }
}

export interface PostDetail extends Post {
  comments: Comment[]
}

export interface Comment {
  id: number
  content: string
  createdAt: string
  userId: number
  postId: number
  user: Pick<User, 'id' | 'username' | 'avatar'>
}

export default api
