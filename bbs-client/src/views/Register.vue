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

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../api'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const form = reactive({ username: '', email: '', password: '' })

async function handleRegister() {
  loading.value = true
  try {
    const res = await register(form)
    auth.setToken(res.token)
    auth.setUser(res.user)
    ElMessage.success('注册成功')
    router.push('/')
  } catch (e: any) {
    ElMessage.error(e.error || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-card { max-width: 400px; margin: 40px auto; }
</style>
