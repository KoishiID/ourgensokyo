<template>
  <!-- 帖子详情区域 -->
  <div v-if="post">
    <!-- 帖子内容卡片 -->
    <el-card>
      <div class="post-header">
        <el-tag size="small" v-if="post.category">{{ post.category.name }}</el-tag>
        <h2>{{ post.title }}</h2>
      </div>
      <div class="post-meta">
        <span>{{ post.user?.username }}</span>
        <span>{{ new Date(post.createdAt).toLocaleString() }}</span>
      </div>
      <div class="post-content">{{ post.content }}</div>
      <!-- 帖子图片 -->
      <div class="post-images" v-if="post.images">
        <img v-for="(img, i) in JSON.parse(post.images)" :key="i" :src="img" class="post-image" />
      </div>
      <!-- 操作按钮：仅帖子作者可见 -->
      <div class="post-actions" v-if="auth.user?.id === post.userId">
        <el-button size="small" @click="$router.push(`/edit/${post.id}`)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete">删除</el-button>
      </div>
    </el-card>

    <!-- 评论区 -->
    <el-card class="comments-section">
      <h3>评论 ({{ post.comments?.length || 0 }})</h3>
      <!-- 评论输入框：仅登录用户可见 -->
      <div v-if="auth.user" class="comment-form">
        <el-input v-model="commentText" type="textarea" :rows="3" placeholder="写下你的评论..." />
        <el-button type="primary" @click="submitComment" :loading="commentLoading" style="margin-top:8px">发表评论</el-button>
      </div>
      <!-- 未登录提示 -->
      <div v-else style="margin-bottom:16px">
        <router-link to="/login">登录后即可评论</router-link>
      </div>
      <!-- 评论列表 -->
      <div v-for="c in post.comments" :key="c.id" class="comment-item">
        <div class="comment-header">
          <strong>{{ c.user?.username }}</strong>
          <span>{{ new Date(c.createdAt).toLocaleString() }}</span>
          <el-button v-if="auth.user?.id === c.userId" text type="danger" size="small" @click="deleteComment(c.id)">删除</el-button>
        </div>
        <div class="comment-body">{{ c.content }}</div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost, deletePost, createComment, deleteComment as apiDeleteComment, type PostDetail } from '../api'
import { useAuthStore } from '../stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const post = ref<PostDetail | null>(null)
const commentText = ref('')
const commentLoading = ref(false)

onMounted(() => loadPost())

async function loadPost() {
  post.value = await getPost(route.params.id as string)
}

async function handleDelete() {
  try {
    await ElMessageBox.confirm('确定删除此帖子？')
    await deletePost(route.params.id as string)
    ElMessage.success('删除成功')
    router.push('/')
  } catch {}
}

async function submitComment() {
  if (!commentText.value.trim()) return
  commentLoading.value = true
  try {
    await createComment(route.params.id as string, { content: commentText.value })
    commentText.value = ''
    ElMessage.success('评论成功')
    loadPost()
  } catch (e: any) {
    ElMessage.error(e.error || '评论失败')
  } finally {
    commentLoading.value = false
  }
}

async function deleteComment(id: number) {
  try {
    await ElMessageBox.confirm('确定删除此评论？')
    await apiDeleteComment(id)
    ElMessage.success('删除成功')
    loadPost()
  } catch {}
}
</script>

<style scoped>
.post-header { display: flex; align-items: center; gap: 8px; }
.post-meta { color: #999; font-size: 13px; margin: 8px 0 16px; display: flex; gap: 16px; }
.post-content { white-space: pre-wrap; line-height: 1.8; }
.post-images { margin-top: 16px; }
.post-image { max-width: 100%; border-radius: 4px; margin-bottom: 8px; }
.post-actions { margin-top: 16px; }
.comments-section { margin-top: 20px; }
.comment-form { margin-bottom: 20px; }
.comment-item { border-bottom: 1px solid #eee; padding: 12px 0; }
.comment-header { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #999; margin-bottom: 4px; }
.comment-body { white-space: pre-wrap; }
</style>
