/**
 * 应用入口文件
 * 初始化 Vue 应用，注册 Element Plus、Vue Router 和 Pinia 状态管理，
 * 并在挂载前获取用户登录状态。
 */
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(createPinia())

const auth = useAuthStore()
auth.fetchProfile()

app.mount('#app')
