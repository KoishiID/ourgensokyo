<template>
  <!-- 发帖/编辑表单卡片 -->
  <el-card>
    <h2>{{ isEdit ? '编辑帖子' : '发帖' }}</h2>
    <el-form @submit.prevent="handleSubmit">
      <!-- 分类选择 -->
      <el-form-item label="分类">
        <el-select v-model="form.categoryId" placeholder="选择分类">
          <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
      </el-form-item>
      <!-- 标题输入 -->
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <!-- 内容输入 -->
      <el-form-item label="内容">
        <el-input v-model="form.content" type="textarea" :rows="10" />
      </el-form-item>
      <!-- 图片上传 -->
      <el-form-item label="图片">
        <el-upload
          :auto-upload="false"
          :on-change="handleFileChange"
          :file-list="fileList"
          list-type="picture"
          accept="image/*"
        >
          <el-button size="small">选择图片</el-button>
        </el-upload>
      </el-form-item>
      <!-- 提交/取消按钮 -->
      <el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading">{{ isEdit ? '保存' : '发布' }}</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCategories, createPost, updatePost, getPost, uploadFile, type Category } from '../api'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const categories = ref<Category[]>([])
const fileList = ref<UploadFile[]>([])
const uploadedUrls = ref<string[]>([])

const form = reactive({ title: '', content: '', categoryId: null as number | null })

onMounted(async () => {
  categories.value = await getCategories()
  if (isEdit.value) {
    const post = await getPost(route.params.id as string)
    form.title = post.title
    form.content = post.content
    form.categoryId = post.categoryId
    if (post.images) {
      uploadedUrls.value = JSON.parse(post.images)
    }
  }
})

async function handleFileChange(file: UploadFile) {
  try {
    if (!file.raw) return
    const res = await uploadFile(file.raw)
    uploadedUrls.value.push(res.url)
    fileList.value.push({ ...file, name: res.filename, url: res.url })
    ElMessage.success('图片上传成功')
  } catch {
    ElMessage.error('图片上传失败')
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    const data = {
      title: form.title,
      content: form.content,
      categoryId: Number(form.categoryId),
      images: uploadedUrls.value.length > 0 ? uploadedUrls.value : undefined
    }
    if (isEdit.value) {
      await updatePost(route.params.id as string, data)
      ElMessage.success('编辑成功')
    } else {
      const post = await createPost(data)
      ElMessage.success('发布成功')
      router.push(`/posts/${post.id}`)
      return
    }
    router.push(`/posts/${route.params.id}`)
  } catch (e: any) {
    ElMessage.error(e.error || '操作失败')
  } finally {
    loading.value = false
  }
}
</script>
