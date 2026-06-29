/**
 * Vue Router 路由配置
 * 使用 createWebHistory 模式，包含以下路由：
 * - / : 首页
 * - /login : 登录页
 * - /register : 注册页
 * - /posts/:id : 帖子详情页
 * - /create : 创建帖子页
 * - /edit/:id : 编辑帖子页
 * - /profile/:id : 用户个人主页
 * 所有页面组件均使用懒加载。
 */
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
  { path: '/posts/:id', name: 'PostDetail', component: () => import('../views/PostDetail.vue') },
  { path: '/create', name: 'CreatePost', component: () => import('../views/CreatePost.vue') },
  { path: '/edit/:id', name: 'EditPost', component: () => import('../views/CreatePost.vue') },
  { path: '/profile/:id', name: 'Profile', component: () => import('../views/Profile.vue') }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
