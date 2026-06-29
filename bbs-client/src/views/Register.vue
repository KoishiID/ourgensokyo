<template>
  <!-- 注册表单卡片 -->
  <el-card class="form-card">
    <h2>注册</h2>
    <el-form @submit.prevent="handleRegister">
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" type="email" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading">注册</el-button>
      </el-form-item>
    </el-form>
    <!-- 登录入口 -->
    <p>已有账号？<router-link to="/login">去登录</router-link></p>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../api'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const auth = useAuthStore()
// 提交按钮加载状态
const loading = ref(false)
// 注册表单数据
const form = reactive({ username: '', email: '', password: '' })

/**
 * 处理注册提交
 * 调用注册接口，成功后自动登录并跳转到首页
 */
async function handleRegister() {
  loading.value = true
  try {
    const res = await register(form)
    auth.setToken(res.token)
    auth.setUser(res.user)
    ElMessage.success('注册成功')
    router.push('/')
  } catch (e) {
    ElMessage.error(e.error || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-card { max-width: 400px; margin: 40px auto; }
</style>
