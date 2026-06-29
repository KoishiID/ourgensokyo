# 2026-06-29 全栈 BBS 开发日志 — Day 1

## 今日完成功能

- MySQL → SQLite 数据库切换（Prisma v7 + libsql adapter）
- 头像上传 + 浏览器端 Canvas 100×100 裁剪（vue-advanced-cropper）
- 个人主页（Profile.vue）+ 路由 `/profile/:id`
- 暗黑模式（Element Plus 原生 dark CSS 变量 + localStorage 持久化）
- 顶部栏黑夜按钮移到头像前，重新排序
- 用户链接改为 `<el-button text>`（B站做法，统一元素类型消除缩放偏移）

## 今天学到的关键知识

### CSS 变量作用域

CSS 变量定义在 `style.css` 的 `:root` 中，必须 `import './style.css'` 才能生效。变量未定义时 `var()` 解析为空，元素无背景色。

### 元素对齐的本质

`<a>` 和 `<button>` 在浏览器缩放时舍入策略不同，导致像素级偏移。解决方案：同一行不要混用不同标签类型，都用 `<el-button text>`。

### 覆盖框架默认样式

Element Plus 自带 `.el-button + .el-button { margin-left: 12px }`。用更具体的选择器（`.header-right .el-button + .el-button`）覆盖。用 DevTools 的 Styles 面板追踪样式来源（是框架还是自己写的）。

### Flex 布局

容器只管横排 + 间距（`display: flex; gap`），子元素才管自己高度（`height: 40px`）。`.header-right > *` 统一所有子元素。

## 调试经验

- F12 Computed 面板看实际 height 和 line-height
- 临时加背景色看元素实际占据空间
- 怀疑 padding → 验证 → 修复，形成调试闭环

## 明日可做

- 发帖功能（富文本编辑器）
- 帖子详情页
- 用户编辑资料
