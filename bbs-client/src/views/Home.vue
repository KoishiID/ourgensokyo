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

<script setup>
import { ref, onMounted } from 'vue'
import { getPosts, getCategories } from '../api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

// 帖子列表数据
const posts = ref([])
// 全部分类选项
const categories = ref([])
// 当前选中的分类 ID
const categoryId = ref(null)
// 当前页码
const page = ref(1)
// 每页条数
const pageSize = ref(20)
// 帖子总数
const total = ref(0)
// 总页数
const totalPages = ref(0)

onMounted(async () => {
  // 初始化时加载分类列表和帖子
  categories.value = await getCategories()
  loadPosts()
})

/**
 * 加载帖子列表
 * 根据当前分页参数和分类筛选条件从后端获取帖子数据
 */
async function loadPosts() {
  const res = await getPosts({ page: page.value, pageSize: pageSize.value, categoryId: categoryId.value || undefined })
  posts.value = res.posts
  total.value = res.total
  totalPages.value = res.totalPages
}

/**
 * 切换页码
 * @param {number} p - 目标页码
 */
function changePage(p) {
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
