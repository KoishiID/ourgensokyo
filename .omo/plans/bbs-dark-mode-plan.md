# BBS: 暗黑模式 实施计划

## 概述

为 BBS 论坛添加明/暗主题切换功能。使用 Element Plus 原生暗黑模式 + 自定义 CSS 变量。

**核心理念：** 不是简单反转颜色，而是用一套精心设计的暗色系色板，让所有组件在暗色下依然舒适可读。

---

## 实现方案

### 技术原理

```
html.dark 类名 → Element Plus 自动切换组件颜色
              → 自定义 CSS 变量切换 app 自身颜色
```

用户点的"切换" → 只是给 `<html>` 加/删一个 `dark` CSS 类名

---

## 具体步骤

### Step 1: 引入 Element Plus 暗黑 CSS

在 `bbs-client/src/main.js` 加一行 import：

```js
import 'element-plus/theme-chalk/dark/css-vars.css'
```

这会让 Element Plus 的所有组件（按钮、输入框、卡片、对话框等）在 `html.dark` 下自动变暗色。

### Step 2: 自定义暗色色板

在 `bbs-client/src/style.css` 中补充：

```css
/* 明色（默认） */
:root {
  --app-bg: #fff;
  --app-header-bg: #409eff;
  --app-text: #333;
  --app-card-bg: #fff;
  --app-border: #eee;
}

/* 暗色覆盖 */
html.dark {
  --app-bg: #1a1a2e;
  --app-header-bg: #16213e;
  --app-text: #e0e0e0;
  --app-card-bg: #1e1e3a;
  --app-border: #2a2a4a;
}
```

### Step 3: 应用自定义变量到现有样式

更新 `App.vue` 中的 `<style>` 部分，把硬编码的颜色换成 CSS 变量：

- `background: #409eff` → `background: var(--app-header-bg)`
- `border-bottom: 1px solid #eee` → `border-bottom: 1px solid var(--app-border)`
- 页面背景用 `var(--app-bg)`

### Step 4: 添加切换按钮

在 `App.vue` header 右侧加一个切换按钮（月亮/太阳图标）：

```html
<el-button text @click="toggleDark">
  <el-icon><Moon v-if="isDark" /><Sunny v-else /></el-icon>
</el-button>
```

逻辑：

```js
const isDark = ref(localStorage.getItem('dark-mode') === 'true')

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('dark-mode', isDark.value)
}

// 初始化
if (isDark.value) document.documentElement.classList.add('dark')
```

### Step 5: Profile.vue 适配

把 Profile.vue 中硬编码的颜色（如 `color: #999`、`border-bottom: 1px solid #eee`）换成 CSS 变量，确保暗色下可读。

---

## 改动文件汇总

| 文件 | 改动 |
|---|---|
| `bbs-client/src/main.js` | +1 行 import（暗黑 CSS） |
| `bbs-client/src/style.css` | 新增 `:root` 和 `html.dark` 的 CSS 变量 |
| `bbs-client/src/App.vue` | 加切换按钮 + 硬编码颜色换 CSS 变量 |
| `bbs-client/src/views/Profile.vue` | 硬编码颜色换 CSS 变量 |

---

## 效果预览

```
明色模式：
┌─ ████████████████████████████████ ─┐
│  [(A) admin] [🌞] [退出]           │ ← 蓝色 header
│  白色背景，深色文字                  │
└────────────────────────────────────┘

暗色模式：
┌─ ████████████████████████████████ ─┐
│  [(A) admin] [🌙] [退出]           │ ← 深蓝 header
│  深色背景，浅色文字                  │
└────────────────────────────────────┘
```

---

## 验证方式

1. 点击月亮/太阳图标 → 整体切换到暗色/明色
2. 所有 Element Plus 组件颜色同步切换
3. header、卡片、分割线等自定义样式也切换
4. 刷新页面 → 记住之前的主题选择
5. 暗色下文字清晰可读，没有刺眼对比
