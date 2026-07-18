/**
 * Vue Router 路由配置
 * 使用 createWebHistory 模式
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
