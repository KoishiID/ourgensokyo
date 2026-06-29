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

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCategories, createPost, updatePost, getPost, uploadFile } from '../api'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
// 是否为编辑模式（根据路由参数中是否有帖子 ID 判断）
const isEdit = computed(() => !!route.params.id)
// 提交按钮加载状态
const loading = ref(false)
// 全部分类选项
const categories = ref([])
// 已选择的图片文件列表（用于 el-upload 展示）
const fileList = ref([])
// 已上传成功的图片 URL 列表
const uploadedUrls = ref([])

// 帖子表单数据
const form = reactive({ title: '', content: '', categoryId: null })

onMounted(async () => {
  // 加载分类列表
  categories.value = await getCategories()
  if (isEdit.value) {
    // 编辑模式下回填已有帖子数据
    const post = await getPost(route.params.id)
    form.title = post.title
    form.content = post.content
    form.categoryId = post.categoryId
    if (post.images) {
      uploadedUrls.value = JSON.parse(post.images)
    }
  }
})

/**
 * 处理图片文件选择
 * 上传所选图片到服务器并记录返回的 URL
 * @param {object} uploadFile - el-upload 的文件对象
 */
async function handleFileChange(uploadFile) {
  try {
    const res = await uploadFile(uploadFile.raw)
    uploadedUrls.value.push(res.url)
    fileList.value.push({ name: res.filename, url: res.url })
    ElMessage.success('图片上传成功')
  } catch {
    ElMessage.error('图片上传失败')
  }
}

/**
 * 提交帖子（创建或编辑）
 * 根据 isEdit 判断调用创建或更新接口，成功后跳转到帖子详情页
 */
async function handleSubmit() {
  loading.value = true
  try {
    const data = {
      title: form.title,
      content: form.content,
      categoryId: Number(form.categoryId),
      // 仅在存在已上传图片时传递 images 字段
      images: uploadedUrls.value.length > 0 ? uploadedUrls.value : undefined
    }
    if (isEdit.value) {
      await updatePost(route.params.id, data)
      ElMessage.success('编辑成功')
    } else {
      const post = await createPost(data)
      ElMessage.success('发布成功')
      router.push(`/posts/${post.id}`)
      return
    }
    router.push(`/posts/${route.params.id}`)
  } catch (e) {
    ElMessage.error(e.error || '操作失败')
  } finally {
    loading.value = false
  }
}
</script>
