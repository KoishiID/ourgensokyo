/**
 * API 客户端模块
 * 基于 Axios 封装，自动附加 JWT Token 到请求头，
 * 统一处理响应数据解包（res → res.data）和错误拦截。
 * 提供用户认证、帖子管理、评论管理、分类查询、文件上传等接口。
 */
import axios from 'axios'

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
 * @param {object} data - 登录表单数据（含 username, password）
 * @returns {Promise<object>} 包含 token 和用户信息的响应数据
 */
export function login(data) { return api.post('/auth/login', data) }

/**
 * 用户注册
 * @param {object} data - 注册表单数据（含 username, password 等）
 * @returns {Promise<object>} 注册结果
 */
export function register(data) { return api.post('/auth/register', data) }

/**
 * 获取当前登录用户信息
 * @returns {Promise<object>} 当前用户资料
 */
export function getProfile() { return api.get('/auth/profile') }

/**
 * 获取所有分类列表
 * @returns {Promise<Array>} 分类数组
 */
export function getCategories() { return api.get('/categories') }

/**
 * 获取帖子列表（支持分页和筛选）
 * @param {object} params - 查询参数（如 page, limit, categoryId）
 * @returns {Promise<object>} 包含帖子列表和分页信息的响应数据
 */
export function getPosts(params) { return api.get('/posts', { params }) }

/**
 * 获取单个帖子详情
 * @param {number|string} id - 帖子 ID
 * @returns {Promise<object>} 帖子详细信息
 */
export function getPost(id) { return api.get(`/posts/${id}`) }

/**
 * 创建新帖子
 * @param {object} data - 帖子数据（含 title, content, categoryId 等）
 * @returns {Promise<object>} 创建成功的帖子
 */
export function createPost(data) { return api.post('/posts', data) }

/**
 * 更新帖子
 * @param {number|string} id - 帖子 ID
 * @param {object} data - 更新的帖子字段
 * @returns {Promise<object>} 更新后的帖子
 */
export function updatePost(id, data) { return api.put(`/posts/${id}`, data) }

/**
 * 删除帖子
 * @param {number|string} id - 帖子 ID
 * @returns {Promise<void>}
 */
export function deletePost(id) { return api.delete(`/posts/${id}`) }

/**
 * 创建评论
 * @param {number|string} postId - 所属帖子 ID
 * @param {object} data - 评论内容
 * @returns {Promise<object>} 创建成功的评论
 */
export function createComment(postId, data) { return api.post(`/comments/${postId}`, data) }

/**
 * 删除评论
 * @param {number|string} id - 评论 ID
 * @returns {Promise<void>}
 */
export function deleteComment(id) { return api.delete(`/comments/${id}`) }

/**
 * 获取指定用户的公开信息
 * @param {number|string} id - 用户 ID
 * @param {object} [params] - 额外查询参数
 * @returns {Promise<object>} 用户公开资料
 */
export function getUserProfile(id, params) { return api.get(`/users/${id}`, { params }) }

/**
 * 上传文件（如图片、附件）
 * @param {File} file - 要上传的文件对象
 * @returns {Promise<object>} 包含文件 URL 的响应数据
 */
export function uploadFile(file) {
  const form = new FormData()
  form.append('file', file)
  return api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * Axios 实例（已配置基础路径和拦截器）
 * @type {import('axios').AxiosInstance}
 */
export default api
