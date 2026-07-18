<template>
  <!-- 页面主容器 -->
  <div>
    <!-- 工具栏：分类筛选 + 发帖按钮 -->
    <div class="toolbar">
      <el-select v-model="categoryId" placeholder="全部分类" clearable @change="loadPosts" style="width:150px">
        <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
      </el-select>
      <el-button type="primary" @click="$router.push('/create')" v-if="auth.user">发帖</el-button>
    </div>

    <!-- 帖子列表 -->
    <el-card v-for="post in posts" :key="post.id" class="post-card" shadow="hover" @click="$router.push(`/posts/${post.id}`)">
      <div class="post-header">
        <el-tag size="small" v-if="post.category">{{ post.category.name }}</el-tag>
        <h3>{{ post.title }}</h3>
      </div>
      <div class="post-meta">
        <span>{{ post.user?.username }}</span>
        <span>{{ new Date(post.createdAt).toLocaleDateString() }}</span>
        <span>{{ post._count?.comments }} 评论</span>
      </div>
    </el-card>

    <!-- 分页控件 -->
    <div class="pagination" v-if="totalPages > 1">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="changePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPosts, getCategories, type Post, type Category } from '../api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const posts = ref<Post[]>([])
const categories = ref<Category[]>([])
const categoryId = ref<number | null>(null)
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const totalPages = ref(0)

onMounted(async () => {
  categories.value = await getCategories()
  loadPosts()
})

async function loadPosts() {
  const res = await getPosts({ page: page.value, pageSize: pageSize.value, categoryId: categoryId.value || undefined })
  posts.value = res.posts
  total.value = res.total
  totalPages.value = res.totalPages
}

function changePage(p: number) {
  page.value = p
  loadPosts()
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; margin-bottom: 16px; align-items: center; }
.post-card { margin-bottom: 12px; cursor: pointer; }
.post-header { display: flex; align-items: center; gap: 8px; }
.post-header h3 { margin: 8px 0; }
.post-meta { color: #999; font-size: 13px; display: flex; gap: 16px; }
.pagination { margin-top: 20px; text-align: center; }
</style>
