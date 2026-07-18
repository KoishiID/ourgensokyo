<template>
  <!--
   * App.vue - 根组件
   * 布局：el-header（顶部导航栏）+ el-main（主内容区，router-view 渲染子路由页面）
   * 导航栏包含 Logo、深色模式切换、用户认证导航
  -->
  <div id="app">
    <!-- 布局容器 -->
    <el-container>
      <!-- 头部导航栏 -->
      <el-header>
        <div class="header-inner">
          <!-- Logo -->
          <router-link to="/" class="logo">OGSK BBS</router-link>
          <div class="header-right">
            <!-- 深色模式切换 -->
            <el-button text @click="toggleDark" style="font-size:18px">
              <el-icon><Moon v-if="isDark" /><Sunny v-else /></el-icon>
            </el-button>
            <!-- 已登录：显示用户头像 / 用户名及退出按钮 -->
            <template v-if="auth.user">
              <el-button text @click="$router.push(`/profile/${auth.user.id}`)" class="user-link">
                <span class="user-link-inner">
                  <el-avatar :src="auth.user.avatar" size="small">{{ auth.user.username[0] }}</el-avatar>
                  <span class="username">{{ auth.user.username }}</span>
                </span>
              </el-button>
              <el-button text @click="auth.logout(); $router.push('/')">退出</el-button>
            </template>
            <!-- 未登录：显示登录 / 注册按钮 -->
            <template v-else>
              <el-button text @click="$router.push('/login')">登录</el-button>
              <el-button text @click="$router.push('/register')">注册</el-button>
            </template>
          </div>
        </div>
      </el-header>
      <!-- 主内容区 -->
      <el-main>
        <!-- 路由视图：根据 URL 渲染对应页面组件 -->
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
/**
 * App.vue - 根组件
 * 布局：el-header（顶部导航栏）+ el-main（主内容区，router-view 渲染子路由页面）
 * 使用 Element Plus 布局容器，整合 Pinia 认证状态管理
 */
import { ref, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { Moon, Sunny } from '@element-plus/icons-vue'

const auth = useAuthStore()

const isDark = ref(false)

/**
 * 切换深色 / 浅色模式
 * 切换 <html> 上的 .dark class，并将用户偏好持久化到 localStorage
 */
function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('dark-mode', isDark.value)
}

/**
 * 组件挂载时从 localStorage 恢复深色模式偏好
 */
onMounted(() => {
  const saved = localStorage.getItem('dark-mode') === 'true'
  isDark.value = saved
  if (saved) document.documentElement.classList.add('dark')
})
</script>

<style>
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.el-header { background: var(--app-header-bg); color: #fff; transition: background 0.3s; }
.header-inner { display: flex; justify-content: space-between; align-items: center; max-width: 1000px; margin: 0 auto; height: 60px; }
.logo { color: #fff; font-size: 22px; font-weight: bold; text-decoration: none; }


.header-right { display: flex; align-items: center; gap: 10px; }
.header-right > * {height: 40px; display: inline-flex; align-items: center; }
.header-right .el-button + .el-button { margin-left: 0; }   /* ← 加这行 */

.header-right .el-button { color: #fff; }
.user-link { padding: 0; height: auto; border: none; color: #fff; }
.user-link-inner { display: inline-flex; align-items: center; gap: 6px; }

.username {
  font-size: 14px;
  line-height: 1;
}


.el-main { max-width: 1000px; margin: 20px auto; width: 100%; }
</style>
