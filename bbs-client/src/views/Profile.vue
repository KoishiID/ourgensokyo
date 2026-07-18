<template>
  <!-- 加载状态 -->
  <div v-if="loading" style="text-align:center;padding:40px">
    <el-icon class="is-loading" :size="32"><Loading /></el-icon>
  </div>
  <!-- 错误状态 -->
  <div v-else-if="error" style="text-align:center;padding:40px;color:#999">
    {{ error }}
  </div>
  <div v-else-if="profile">
    <!-- 用户信息卡 -->
    <el-card class="profile-card">
      <div class="profile-header">
        <div class="avatar-wrap">
          <el-avatar :src="profile.user.avatar" :size="80">
            {{ profile.user.username[0] }}
          </el-avatar>
          <div v-if="isOwnProfile" class="avatar-overlay" @click="showUpload = true">
            <el-icon><Camera /></el-icon>
            <span>更换头像</span>
          </div>
        </div>
        <div class="user-info">
          <h2>{{ profile.user.username }}</h2>
          <p class="meta">注册时间：{{ new Date(profile.user.createdAt).toLocaleDateString() }}</p>
        </div>
      </div>
    </el-card>

    <!-- 头像上传对话框 -->
    <el-dialog v-model="showUpload" title="选择头像区域" width="480px">
      <!-- 裁剪区域：已有原始图片时显示裁剪器和预览 -->
      <div v-if="rawImage">
        <cropper
          ref="cropperRef"
          :src="rawImage"
          :stencil-size="{ width: 100, height: 100 }"
          :stencil-props="{ handlers: {}, movable: true, resizable: false }"
          image-restriction="stencil"
          @change="handleCropperChange"
          class="cropper-wrapper"
        />
        <div class="preview-wrap">
          <p style="margin:12px 0 4px;font-size:13px;color:#999">预览 100×100：</p>
          <el-avatar :size="100" :src="previewUrl" />
        </div>
      </div>
      <!-- 图片选择：未选择图片时显示上传按钮 -->
      <el-upload v-else :on-change="handleFileSelect" accept="image/*" :show-file-list="false">
        <el-button>选择图片</el-button>
      </el-upload>
      <template #footer>
        <el-button @click="handleCloseUpload">取消</el-button>
        <el-button v-if="rawImage" type="primary" @click="submitCroppedAvatar" :loading="uploading">
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 帖子列表 -->
    <el-card class="posts-section">
      <h3>帖子 ({{ profile.posts.total }})</h3>
      <div v-if="profile.posts.posts.length === 0" class="empty">暂无帖子</div>
      <div v-for="post in profile.posts.posts" :key="post.id" class="post-item">
        <router-link :to="`/posts/${post.id}`" class="post-title">{{ post.title }}</router-link>
        <div class="post-meta">
          <el-tag size="small">{{ post.category?.name }}</el-tag>
          <span>{{ new Date(post.createdAt).toLocaleString() }}</span>
          <span>{{ post._count?.comments || 0 }} 条评论</span>
        </div>
      </div>
      <!-- 分页 -->
      <div v-if="profile.posts.totalPages > 1" class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="20"
          :total="profile.posts.total"
          layout="prev, pager, next"
          @current-change="loadProfile"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getUserProfile, uploadFile, type User, type Post, type Category } from '../api'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'
import { Loading, Camera } from '@element-plus/icons-vue'
import { Cropper } from 'vue-advanced-cropper'
import type { CropperResult } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import type { UploadFile } from 'element-plus'

interface UserProfile {
  user: User & { createdAt: string }
  posts: {
    posts: (Post & { category: Category })[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

const route = useRoute()
const auth = useAuthStore()

const loading = ref(true)
const error = ref('')
const profile = ref<UserProfile | null>(null)
const currentPage = ref(1)
const showUpload = ref(false)
const uploading = ref(false)
const rawImage = ref('')
const previewUrl = ref('')
const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)

const isOwnProfile = computed(() => auth.user?.id === Number(route.params.id))

onMounted(() => loadProfile())

async function loadProfile() {
  loading.value = true
  error.value = ''
  try {
    profile.value = await getUserProfile(route.params.id as string, { page: currentPage.value })
  } catch (e: any) {
    error.value = e.error || '加载失败'
  } finally {
    loading.value = false
  }
}

function handleFileSelect(file: UploadFile) {
  if (!file.raw) return
  const reader = new FileReader()
  reader.onload = (e) => {
    rawImage.value = e.target?.result as string
  }
  reader.readAsDataURL(file.raw)
}

function handleCropperChange({ canvas }: { canvas: HTMLCanvasElement | null }) {
  if (canvas) {
    previewUrl.value = canvas.toDataURL()
  }
}

async function submitCroppedAvatar() {
  if (!cropperRef.value) return
  const result = cropperRef.value.getResult() as CropperResult
  if (!result || !result.canvas) {
    ElMessage.warning('请先选择裁剪区域')
    return
  }

  uploading.value = true
  try {
    const blob = await new Promise<Blob | null>((resolve) => result.canvas!.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('裁剪失败')
    const file = new File([blob], 'avatar.png', { type: 'image/png' })

    const form = new FormData()
    form.append('avatar', file)

    const res = await fetch('/api/auth/avatar', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: form
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || '上传失败')

    if (auth.user) auth.user.avatar = data.avatar
    if (profile.value) profile.value.user.avatar = data.avatar
    ElMessage.success('头像更新成功')

    showUpload.value = false
    rawImage.value = ''
    previewUrl.value = ''
  } catch (e: any) {
    ElMessage.error(e.message || '头像上传失败')
  } finally {
    uploading.value = false
  }
}

function handleCloseUpload() {
  showUpload.value = false
  rawImage.value = ''
  previewUrl.value = ''
}
</script>

<style scoped>
.profile-card { margin-bottom: 20px; transition: background 0.3s; }
.profile-header { display: flex; align-items: center; gap: 24px; }
.avatar-wrap { position: relative; cursor: pointer; }
.avatar-overlay {
  position: absolute; inset: 0; border-radius: 50%;
  background: rgba(0,0,0,0.5); color: #fff;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-size: 12px; gap: 2px; opacity: 0; transition: opacity 0.2s;
}
.avatar-wrap:hover .avatar-overlay { opacity: 1; }
.user-info h2 { margin: 0 0 4px; font-size: 22px; }
.meta { color: var(--app-muted); font-size: 13px; margin: 0; }
.posts-section { margin-top: 0; }
.empty { text-align: center; color: var(--app-muted); padding: 32px 0; }
.post-item { padding: 12px 0; border-bottom: 1px solid var(--app-border); }
.post-title { font-size: 16px; font-weight: 500; text-decoration: none; color: var(--app-text); }
.post-title:hover { color: var(--app-link); }
.post-meta { display: flex; align-items: center; gap: 12px; margin-top: 6px; font-size: 13px; color: var(--app-muted); }
.pagination { margin-top: 16px; display: flex; justify-content: center; }
.cropper-wrapper { max-height: 360px; }
.preview-wrap { text-align: center; margin-top: 12px; }
</style>
