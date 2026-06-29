# BBS: 头像裁剪功能 实施计划

## 概述

在头像上传流程中加入裁剪功能。用户选图后，用一个 100×100 的方框自由选择图片中的任意区域作为头像。

**核心思路：** 裁剪在浏览器端完成（Canvas），不增加服务器负担。

---

## 改动范围

| 层 | 改动 |
|---|---|
| **后端** | 零改动 |
| **前端 package.json** | 新增 `vue-advanced-cropper` 依赖 |
| **前端 `Profile.vue`** | 重写上传对话框，嵌入裁剪组件 |

---

## 用户流程

```
原来的流程：
  选图 → 直接上传 → 后端存 → 完

新流程：
  选图 → 显示在裁剪器中 + 100×100 方框 →
  拖动/缩放方框到满意位置 → 点"保存" →
  Canvas 裁剪出 100×100 的小图 →
  转成 Blob 上传 → 后端存 → 更新头像 ✅
```

---

## 具体实施

### Step 1: 安装依赖

```bash
cd bbs-client
npm install vue-advanced-cropper
```

### Step 2: 修改 Profile.vue

**改动要点：**

1. 引入 `Cropper` 组件和样式
   ```js
   import { Cropper } from 'vue-advanced-cropper'
   import 'vue-advanced-cropper/dist/style.css'
   ```

2. 替换 `el-upload` 对话框为 `<cropper>` 组件：
   - 用户选图后，把图片显示在裁剪器中
   - 固定裁剪框 100×100（`stencil-size`）
   - 不可调整大小（`resizable: false`），但可以拖动位置

3. 确认按钮的逻辑改为：
   - 从裁剪器的 `canvas` 获取裁剪结果
   - `canvas.toBlob()` 转成文件
   - 用 `FormData` 上传到 `PUT /api/auth/avatar`

4. 头像显示不变（仍是 80px 的 `el-avatar`，但上传的图本来就是 100×100 的方形，效果更好）

### Step 3: 细节处理

- 裁剪框固定 100×100，但不限制原图放大缩小（用户可以缩放原图来适配裁剪框）
- 上传前显示 100×100 的预览
- 上传后头像即更新（和之前一样）

---

## 关键代码片段

```vue
<el-dialog v-model="showUpload" title="选择头像区域" width="480px">
  <div v-if="rawImage">
    <cropper
      ref="cropperRef"
      :src="rawImage"
      :stencil-size="{ width: 100, height: 100 }"
      :stencil-props="{ handlers: {}, movable: true, resizable: false }"
      image-restriction="stencil"
      class="cropper-wrapper"
    />
    <!-- 预览 -->
    <div class="preview-wrap">
      <p>预览：</p>
      <el-avatar :size="100" :src="previewUrl" />
    </div>
  </div>
  <el-upload v-else :on-change="handleFileSelect" accept="image/*">
    <el-button>选择图片</el-button>
  </el-upload>
  <template #footer>
    <el-button @click="showUpload = false">取消</el-button>
    <el-button v-if="rawImage" type="primary" @click="submitCroppedAvatar" :loading="uploading">
      保存
    </el-button>
  </template>
</el-dialog>
```

```js
async function submitCroppedAvatar() {
  const { canvas } = cropperRef.value.getResult()
  if (!canvas) return
  
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
  const file = new File([blob], 'avatar.png', { type: 'image/png' })
  
  const form = new FormData()
  form.append('avatar', file)
  
  const res = await fetch('/api/auth/avatar', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: form
  })
  const data = await res.json()
  auth.user.avatar = data.avatar
}
```

---

## 验证方式

1. 点击上传头像 → 弹出文件选择
2. 选一张横向大图 → 显示裁剪器 + 100×100 方框
3. 拖动方框到不同位置 → 预览实时更新
4. 点保存 → 上传成功 → header 头像更新为裁剪后的区域
