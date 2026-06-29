/**
 * 用户认证状态管理（Pinia Store）
 * 管理登录 token 和当前用户信息，提供登录、登出、获取用户资料等操作。
 * token 持久化存储于 localStorage。
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProfile } from '../api'

export const useAuthStore = defineStore('auth', () => {
  /** @type {import('vue').Ref<string>} JWT 令牌，从 localStorage 初始化 */
  const token = ref(localStorage.getItem('token') || '')

  /** @type {import('vue').Ref<object|null>} 当前登录用户信息 */
  const user = ref(null)

  /**
   * 设置 token 并同步到 localStorage
   * @param {string} t - JWT 令牌
   */
  function setToken(t) {
    token.value = t
    localStorage.setItem('token', t)
  }

  /**
   * 设置当前用户信息
   * @param {object|null} u - 用户对象
   */
  function setUser(u) {
    user.value = u
  }

  /**
   * 异步获取当前登录用户资料
   * 若请求失败（如 token 过期），自动清除 token 和用户信息。
   * @returns {Promise<void>}
   */
  async function fetchProfile() {
    if (!token.value) return
    try {
      user.value = await getProfile()
    } catch {
      token.value = ''
      user.value = null
      localStorage.removeItem('token')
    }
  }

  /**
   * 退出登录，清除 token 和用户信息
   */
  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, setToken, setUser, fetchProfile, logout }
})
