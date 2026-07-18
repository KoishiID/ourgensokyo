# Ourgensokyo 开发规范

> 一群人写代码的规矩 = 一个人写代码不迷路

---

## 一、命名规范

### 通用
| 项 | 规则 | 正确 | 错误 |
|----|------|------|------|
| 变量 | camelCase | userName | user_name |
| 函数 | camelCase | getUserById() | get_user_by_id() |
| 类 | PascalCase | PrismaClient | prisma_client |
| 常量 | UPPER_SNAKE | JWT_SECRET | jwtSecret |
| 文件 | kebab-case | auth-controller.js | authController.js |
| 目录 | kebab-case | bbs-server/ | bbsServer/ |

### 前端
| 项 | 规则 | 示例 |
|----|------|------|
| Vue 组件 | PascalCase | PostDetail.vue |
| 路由名称 | PascalCase | name: "PostDetail" |
| API 函数 | camelCase | getPosts() |
| Pinia store | camelCase | useAuthStore |

### 后端
| 项 | 规则 | 示例 |
|----|------|------|
| 路由文件 | 复数 | auth.js, posts.js |
| 控制器 | 单数+Controller | postController.js |
| 路由前缀 | /api/+复数 | /api/posts |
| 中间件 | 形容词 | authenticate |

## 二、API 规范
- 资源用复数: /api/posts
- 嵌套用路径: /api/comments/:postId
- 筛选用 query: ?categoryId=1
- 分页用 query: ?page=1&pageSize=20

| 操作 | 方法 | 路径 |
|------|------|------|
| 列表 | GET | /api/posts |
| 详情 | GET | /api/posts/:id |
| 创建 | POST | /api/posts |
| 更新 | PUT | /api/posts/:id |
| 删除 | DELETE | /api/posts/:id |

## 三、Git 工作流

### 分支策略
```
main ← 稳定版
  feat/xxx  ← 新功能
  fix/xxx   ← 修 Bug
  refactor/xxx ← 重构
```

### 提交信息格式
```
<type>(<scope>): <描述>
```
| type | 场景 |
|------|------|
| feat | 新功能 |
| fix | 修 Bug |
| refactor | 重构 |
| docs | 文档 |
| style | 格式 |
| chore | 配置 |

### 提交前自检
- [ ] npm run dev 无报错
- [ ] 无遗留 console.log
- [ ] 无注释掉的死代码
- [ ] 提交范围不混入无关改动
- [ ] 无硬编码密钥

## 四、开发流程

### 新增功能
1. .omo/plans/ 写计划
2. 审批确认
3. 编码（后→前或前→后，按依赖）
4. 自测
5. 提交

### 数据库变更
1. 改 schema.prisma
2. npm run prisma:migrate
3. npm run prisma:generate
4. 提交 schema + 迁移文件 + 代码

## 五、代码风格
```javascript
// 优先 const，早期 return
const MAX = 3
async function getPost(id) {
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return res.status(404).json({ error: "不存在" })
}
// 每个异步操作 try-catch
// 授权检查返回 403
// 导出函数写 JSDoc
```

## 六、TS 迁移路径
Phase 1: utils/ → .ts
Phase 2: middleware/ → .ts
Phase 3: routes/ + controllers/ → .ts
Phase 4: 前端 api/ + stores/ + views/ → .ts

## 七、红线
- ❌ 不提交 node_modules/ / .env / uploads/
- ❌ 不直接改库
- ❌ 不硬编码密钥
- ❌ 不提交类型错误代码
- ❌ 不提交未自测代码
