---
slug: bbs-comment-plan
status: awaiting-approval
intent: unclear
pending-action: write .omo/plans/bbs-comment-plan.md
approach: Parallelized JSDoc comment addition across all 29 source files + 2 prisma files, organized by layer into 7 independent todos, all executed in a single parallel wave.
---

# Draft: bbs-comment-plan

## Components (topology ledger)
| id | outcome | status | evidence path |
|----|---------|--------|--------------|
| server-utils-mw | Add JSDoc + Chinese comments to 6 server util/middleware files | active | ses_0edccb2e5ffeldSJE1AGy3DV74 |
| server-controllers | Add JSDoc + Chinese comments to 5 server controller files | active | ses_0edccb2e5ffeldSJE1AGy3DV74 |
| server-routes-entry | Add JSDoc + Chinese comments to 7 server route/entry files | active | ses_0edccb2e5ffeldSJE1AGy3DV74 |
| client-js-infra | Add JSDoc + Chinese comments to 4 client JS files | active | ses_0edccab34ffe7rX64jq3ai0WEa |
| client-vue-views | Add JSDoc + template section + Chinese comments to 6 Vue view files | active | ses_0edccab34ffe7rX64jq3ai0WEa |
| client-vue-components | Add JSDoc + Chinese comments to 2 Vue component files (App.vue, HelloWorld.vue) | active | ses_0edccab34ffe7rX64jq3ai0WEa |
| prisma-files | Add JSDoc + Chinese comments to 2 Prisma files (seed.js, prisma.config.ts) | active | ses_0edccb2e5ffeldSJE1AGy3DV74 |

## Open assumptions (announced defaults)
| assumption | adopted default | rationale | reversible? |
|-----------|----------------|-----------|-------------|
| Comment style | JSDoc (`/** ... */`) for all JS/TS functions | JS 生态标准，用户确认采纳 | Yes |
| Comment language | 中文（简体）注释正文 | 匹配代码库现有风格（Profile.vue 中的中文注释），用户确认采纳 | Yes |
| Comment depth | 每个导出函数/路由处理器/方法加 JSDoc，复杂逻辑加行内注释 | 平衡可读性与工作量，不为琐碎 getter/setter 过度注释 | Yes |
| Vue template sections | HTML 注释 `<!-- 区域名 -->` 分隔主要 UI 区块 | Profile.vue 已有此模式，是 Vue 最佳实践 | Yes |
| CSS section comments | 不主动加，仅对 hack/覆盖加 `/* 说明 */` | CSS 内容较少且自解释 | Yes |
| Files to cover | 所有 src/ 源文件 + prisma/seed.js + prisma.config.ts | 全面覆盖，排除 node_modules | No |

## Findings (cited - path:lines)
- **bbs-server/src/**: 17 个 JS 文件，0 条注释 (ses_0edccb2e5ffeldSJE1AGy3DV74)
- **bbs-client/src/**: 12 个文件，仅 10 条注释 (ses_0edccab34ffe7rX64jq3ai0WEa)
  - Profile.vue: 9 条注释（4 HTML + 5 JS）— 唯一有注释的文件
  - App.vue: 1 条 CSS 行内注释
  - 其他 10 个文件: 0 注释
- **prisma/seed.js**: 27 行, 0 注释
- **prisma.config.ts**: 14 行, 0 注释
- 代码库无 JSDoc、无 TODO/FIXME、无任何文档块
- 无 eslint 配置、无编辑器配置、无项目编码规范文档

## Decisions (with rationale)
1. **JSDoc + 中文注释** — 用户明确选择。JSDoc 是 JS 生态的标准文档格式，中文注释匹配项目语言风格。
2. **所有导出函数/路由处理器全覆盖** — 让阅读者在不读函数体的情况下理解函数用途、参数和返回值。
3. **行内注释仅用于复杂逻辑** — 不为 `const x = 1` 这种自解释代码加注释。
4. **Vue template 加 HTML 区域分隔注释** — Profile.vue 已有成功示范，按此模式统一。
5. **7 个并行 todo，单波执行** — 每个 todo 处理独立文件集合，无依赖关系，可完全并行。
6. **worker 使用 /shared/programming skill + edit 工具** — 精确编辑，不重写文件。

## Scope IN
- 所有 `bbs-server/src/` 下 17 个 .js 源文件
- 所有 `bbs-client/src/` 下 12 个源文件（.js + .vue）
- `bbs-server/prisma/seed.js` 和 `bbs-server/prisma.config.ts`
- JSDoc 块注释 + 中文描述
- Vue template HTML 区域注释
- 关键逻辑行内注释（用 `//`）

## Scope OUT (Must NOT have)
- ❌ 不修改任何 node_modules/ 文件
- ❌ 不修改代码逻辑、不重构、不改变量名
- ❌ 不添加 TODO/FIXME（除非修复已有问题）
- ❌ 不添加 emoji 到注释中
- ❌ 不创建新的 .md 文档或 README
- ❌ 不修改 `.omo/` 下的已有计划文件
- ❌ 不为自解释代码加冗余行内注释（如 `// 设置变量 x` 这种）
- ❌ 不修改 `bbs/` 目录（空目录）

## Open questions
- 无 — 用户已确认注释标准和语言

## Approval gate
status: awaiting-approval
<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->
