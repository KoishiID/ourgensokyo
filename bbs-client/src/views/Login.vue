<template>
  <!-- 登录表单卡片 -->
  <el-card class="form-card">
    <h2>登录</h2>
    <el-form @submit.prevent="handleLogin">
      <el-form-item label="邮箱">
        <el-input v-model="form.email" type="email" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading">登录</el-button>
      </el-form-item>
    </el-form>
    <!-- 注册入口 -->
    <p>没有账号？<router-link to="/register">去注册</router-link></p>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const auth = useAuthStore()
// 提交按钮加载状态
const loading = ref(false)
// 登录表单数据（预填演示账号）
const form = reactive({ email: 'admin@bbs.com', password: '123456' })

/**
 * 处理登录提交
 * 调用登录接口，成功后保存 token 和用户信息并跳转到首页
 */
async function handleLogin() {
  loading.value = true
  try {
    const res = await login(form)
    auth.setToken(res.token)
    auth.setUser(res.user)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (e) {
    ElMessage.error(e.error || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-card { max-width: 400px; margin: 40px auto; }
</style>
