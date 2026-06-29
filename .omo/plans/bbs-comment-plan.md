# bbs-comment-plan - Work Plan

## TL;DR (For humans)

**What you'll get:** 全项目 31 个源文件一次性补上标准 JSDoc 中文注释。每个函数/方法都有清晰的用途、参数、返回值说明，Vue 模板加了区域分隔注释，复杂逻辑有行内解释。以后任何人打开代码都能快速理解。

**Why this approach:** 按层（工具类 → 控制器 → 路由 → 客户端 JS → Vue 视图 → 组件）分成 7 个独立任务，全部可以并行执行。JSDoc 是 JS 生态标准格式，中文注释匹配项目已有风格。

**What it will NOT do:** 不改一行代码逻辑，不重构，不添加 TODO/FIXME，不改 node_modules，不写 README/doc 文件。

**Effort:** Short（纯机械性添加注释，单波并行完成）
**Risk:** Low - 只加注释不改逻辑，每个文件独立可验证
**Decisions I made for you:** JSDoc + 中文注释；Vue template 加 HTML 区域注释；不注释自解释简单代码；覆盖全部 31 个源文件。

你的下一步：**批准本计划**，然后执行 `$start-work`。

---

> TL;DR (machine): Short effort / Low risk — Parallel JSDoc Chinese comment pass across 31 source files (17 server JS + 12 client JS/Vue + 2 prisma), 7 independent todos in 1 wave.

## Scope
### Must have
- All 17 files under `bbs-server/src/` receive JSDoc function headers + Chinese descriptions + inline comments for non-obvious logic
- All 12 files under `bbs-client/src/` receive JSDoc function headers + HTML template section comments + Chinese descriptions
- `bbs-server/prisma/seed.js` and `bbs-server/prisma.config.ts` receive JSDoc + Chinese comments
- Every exported/async function, route handler, and Vue method gets a JSDoc block
- Vue templates get `<!-- 区域名 -->` separators for major UI sections
- Complex business logic gets inline `// 中文说明` comments

### Must NOT have (guardrails, anti-slop, scope boundaries)
- ❌ Do NOT modify any `node_modules/` file
- ❌ Do NOT change any code logic, variable names, or code structure
- ❌ Do NOT add TODO/FIXME markers
- ❌ Do NOT add emoji to any comment
- ❌ Do NOT create new .md documentation or README files
- ❌ Do NOT modify `.omo/` plan artifacts
- ❌ Do NOT add redundant inline comments for self-explanatory code (e.g., `const x = 1 // 设置x为1`)
- ❌ Do NOT add comments to empty catch blocks or trivial getters
- ❌ Do NOT touch files outside the specified scope

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: none（注释不需要测试）
- Evidence: Each todo reads the file after edit to verify JSDoc blocks are present and correctly formatted. LSP diagnostics confirm no syntax breakage.
- QA: `node -c <file>` for JS files; `eslint --no-eslintrc --rule 'valid-jsdoc: error' <file>` for JSDoc validity (or LSP equivalent)

## Execution strategy
### Parallel execution waves
**Wave 1 (ALL 7 todos run in parallel):** No dependencies between any todos — each modifies disjoint file sets.

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1-7 | none | none | all others |

## Todos
> Implementation + Verification = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [ ] 1. Server utilities + middleware — 添加 JSDoc 中文注释
  What to do / Must NOT do:
    逐文件读取并添加 JSDoc 注释。每个文件的每个导出函数/箭头函数加上 `/** 中文描述 @param ... @returns ... */`。
    文件清单（6 个）：
    - `bbs-server/src/utils/jwt.js` (14行) — signToken, verifyToken → 带 JSDoc
    - `bbs-server/src/utils/prisma.js` (10行) — PrismaClient 单例 → 文件头 + 导出 JSDoc
    - `bbs-server/src/utils/redis.js` (17行) — Redis 客户端懒加载 → 文件头 + 函数 JSDoc
    - `bbs-server/src/middleware/auth.js` (17行) — authenticate 中间件 → JSDoc + 行内
    - `bbs-server/src/middleware/upload.js` (31行) — Multer 配置 → 文件头 + 关键行内
    - `bbs-server/src/index.js` (32行) — Express 入口 → 应用级文件头 JSDoc
  Must NOT: 不改逻辑，不要给 `require`/`import` 加注释，不要覆盖已有内容。
  Parallelization: Wave 1 | Blocked by: none | Blocks: none
  References: Full file contents available via Read. Existing style: no comments at all.
  Acceptance criteria: 每个文件所有导出函数上方有 `/** ... */` 块，`node -c <file>` 无语法错误。
  QA scenarios: `node -c` each file after edit. Read each file to visually confirm JSDoc format. Evidence: `.omo/evidence/task-1-bbs-comment-plan.txt`
  Commit: N（全部完成后统一提交）

- [ ] 2. Server controllers — 添加 JSDoc 中文注释
  What to do / Must NOT do:
    逐文件读取并添加 JSDoc。每个 async 路由处理器函数加完整 JSDoc（描述业务意图、参数类型、返回结构）。
    文件清单（5 个）：
    - `bbs-server/src/controllers/postController.js` (117行) — createPost, getPosts, getPost, updatePost, deletePost → 每个函数含 `@param {import('express').Request} req` / `@param {import('express').Response} res`，复杂逻辑加行内
    - `bbs-server/src/controllers/authController.js` (80行) — register, login, getProfile, updateAvatar → 同上，行内解释密码加密、JWT签发等
    - `bbs-server/src/controllers/commentController.js` (37行) — create, remove → JSDoc
    - `bbs-server/src/controllers/userController.js` (39行) — getUserProfile → JSDoc + 分页逻辑行内
    - `bbs-server/src/controllers/uploadController.js` (11行) — upload → JSDoc
  Must NOT: 不要修改 try/catch 结构，不改 error handling 逻辑。
  Parallelization: Wave 1 | Blocked by: none | Blocks: none
  References: Full file contents via Read. Largest file is postController.js (117 lines).
  Acceptance criteria: 每个 controller 的每个导出函数有 JSDoc 块，`node -c` 无语法错误。
  QA scenarios: `node -c` each file. Read to confirm. Evidence: `.omo/evidence/task-2-bbs-comment-plan.txt`
  Commit: N

- [ ] 3. Server routes + entry — 添加 JSDoc 中文注释
  What to do / Must NOT do:
    路由文件很薄（8-15行每条），为每个路由定义加模块级 JSDoc 注释，说明路由前缀和每个端点的功能。
    文件清单（7 个）：
    - `bbs-server/src/index.js` (32行) — 应用入口，文件头注释+各 middleware 挂载点行内
    - `bbs-server/src/routes/auth.js` (13行) — 认证路由
    - `bbs-server/src/routes/posts.js` (13行) — 帖子路由
    - `bbs-server/src/routes/comments.js` (10行) — 评论路由
    - `bbs-server/src/routes/users.js` (8行) — 用户路由
    - `bbs-server/src/routes/categories.js` (15行) — 分类路由
    - `bbs-server/src/routes/upload.js` (10行) — 上传路由
  Must NOT: 路由文件已极简，不要过度注释（每行一个 `router.get(...)` 不需要 JSDoc，加文件头即可）。
  Parallelization: Wave 1 | Blocked by: none | Blocks: none
  References: Full file contents via Read.
  Acceptance criteria: 每个路由文件有模块级文件头 `/** ... */`，`node -c` 无语法错误。
  QA scenarios: `node -c` each file. Evidence: `.omo/evidence/task-3-bbs-comment-plan.txt`
  Commit: N

- [ ] 4. Client JS infrastructure — 添加 JSDoc 中文注释
  What to do / Must NOT do:
    为 Vue 应用的 JS 基础设施文件添加 JSDoc。每个导出函数/对象加完整注释。
    文件清单（4 个）：
    - `bbs-client/src/main.js` (19行) — Vue 应用入口 → 文件头注释 + createApp 说明
    - `bbs-client/src/router/index.js` (16行) — Vue Router 配置 → 文件头 + 每条路由说明
    - `bbs-client/src/api/index.js` (45行) — Axios API 客户端 → 文件头 + 每个导出函数 JSDoc（13+ 个函数：login, register, getProfile, getPosts, getPost, createPost, updatePost, deletePost, getCategories, createComment, deleteComment, uploadAvatar, getUserProfile）
    - `bbs-client/src/stores/auth.js` (36行) — Pinia auth store → 文件头 + state/getter/action JSDoc
  Must NOT: 不要改 API URL、store 逻辑或 router 配置。
  Parallelization: Wave 1 | Blocked by: none | Blocks: none
  References: Full file contents via Read. api/index.js has 13+ exported functions needing JSDoc.
  Acceptance criteria: 每个 JS 文件的每个导出/函数有 JSDoc，无语法错误。
  QA scenarios: 视觉检查每个文件的 JSDoc 完整性。Evidence: `.omo/evidence/task-4-bbs-comment-plan.txt`
  Commit: N

- [ ] 5. Client Vue views — 添加 JSDoc 中文注释 + 模板区域注释
  What to do / Must NOT do:
    为每个 Vue 视图文件加注释：
    - `<template>` 部分：加 HTML 注释 `<!-- 区域名 -->` 分隔主要 UI 区块（如 `<!-- 帖子列表 -->`, `<!-- 登录表单 -->`）
    - `<script setup>` 部分：每个函数/ref 加合适注释。复杂计算逻辑加行内。
    - `<style>` 部分：仅对 hack/覆盖规则加注释
    文件清单（6 个）：
    - `bbs-client/src/views/Home.vue` (73行) — 首页帖子列表
    - `bbs-client/src/views/Login.vue` (49行) — 登录页
    - `bbs-client/src/views/Register.vue` (52行) — 注册页
    - `bbs-client/src/views/PostDetail.vue` (109行) — 帖子详情
    - `bbs-client/src/views/CreatePost.vue` (100行) — 创建帖子
    - `bbs-client/src/views/Profile.vue` (204行) — 个人主页（已有 9 条注释，补充遗漏的函数和区域）
  Must NOT: Profile.vue 已有注释不要删除或重写，只补充缺失的。Vue SFC 注意不要在 template 表达式中加 JS 注释。
  Parallelization: Wave 1 | Blocked by: none | Blocks: none
  References: Existing comment pattern in Profile.vue: `<!-- 用户信息卡 -->` for template, `// 更新本地头像` for inline JS.
  Acceptance criteria: 每个 .vue 文件能通过 vite 编译（`npx vite build` 无报错），template 区域有 HTML 注释，script 函数有 JSDoc。
  QA scenarios: `cd bbs-client && npx vite build` 验证编译通过。Read each file to confirm. Evidence: `.omo/evidence/task-5-bbs-comment-plan.txt`
  Commit: N

- [ ] 6. Client Vue components — 添加 JSDoc 中文注释
  What to do / Must NOT do:
    文件清单（2 个）：
    - `bbs-client/src/App.vue` (78行) — 根组件，已有 1 条 CSS 注释。补充根组件文件头、script setup 函数 JSDoc、template 区域分隔
    - `bbs-client/src/components/HelloWorld.vue` (95行) — 可考虑是否保留或简化注释（如果只是脚手架默认内容）
  Must NOT: 不要修改组件逻辑或样式。
  Parallelization: Wave 1 | Blocked by: none | Blocks: none
  References: Full file contents via Read.
  Acceptance criteria: 每个 .vue 文件能通过 vite 编译，注释格式正确。
  QA scenarios: `cd bbs-client && npx vite build` 验证。Evidence: `.omo/evidence/task-6-bbs-comment-plan.txt`
  Commit: N

- [ ] 7. Prisma files — 添加 JSDoc 中文注释
  What to do / Must NOT do:
    文件清单（2 个）：
    - `bbs-server/prisma/seed.js` (27行) — 种子数据脚本 → 文件头 + main 函数 JSDoc
    - `bbs-server/prisma.config.ts` (14行) — Prisma 配置 → 文件头 + export JSDoc
  Must NOT: 不改 seed 数据内容，不改 Prisma 配置。
  Parallelization: Wave 1 | Blocked by: none | Blocks: none
  References: Full file contents via Read.
  Acceptance criteria: `node -c prisma/seed.js` 无语法错误；`tsc --noEmit prisma.config.ts`（若可用）无错误。
  QA scenarios: `node -c` for .js file; visual inspection for .ts file. Evidence: `.omo/evidence/task-7-bbs-comment-plan.txt`
  Commit: N

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit — 确认所有 31 个文件都被修改（git diff --stat），没有遗漏
- [ ] F2. Code quality review — 确认没有代码逻辑被修改（git diff 检查只有注释行变化），JSDoc 格式正确
- [ ] F3. Build verification — `cd bbs-server && node -c src/index.js` + `cd bbs-client && npx vite build` 均通过
- [ ] F4. Scope fidelity — 确认没有 node_modules、空目录等被修改，没有 TODO/FIXME 被添加，没有 emoji

## Commit strategy
单一提交，message 格式：
```
docs: 全项目添加 JSDoc 中文注释

覆盖 bbs-server/src/（17 文件）、bbs-client/src/（12 文件）、
prisma/（2 文件），共 31 个源文件。

注释规范：JSDoc + 中文说明，Vue template 加 HTML 区域分隔，
复杂逻辑加行内解释。
```

## Success criteria
1. 所有 31 个源文件函数上方有 `/** ... */` JSDoc 块
2. 服务端 `node -c` 通过全部文件
3. 客户端 `vite build` 通过
4. `git diff --stat` 显示只有 31 个源文件被修改，且仅注释行变化
5. 无 TODO/FIXME/emoji 泄漏
6. 无 node_modules 或 .omo/ 计划文件被触碰
