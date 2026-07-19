# =============================================================================
# BBS Server — Express.js + Prisma + PostgreSQL (Node.js 20 Alpine)
# =============================================================================

# ------------------- Stage 1: Builder -------------------
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json prisma.config.ts ./
COPY prisma/ ./prisma/
COPY tsconfig.json ./

# 安装所有依赖（包括 devDependencies，用于编译 TypeScript）
RUN npm ci

# 生成 Prisma Client
RUN npx prisma generate

# 复制源码并编译 TypeScript
COPY src/ ./src/
RUN npm run build   # 执行 tsc，输出到 dist/

# ------------------- Stage 2: Runtime -------------------
FROM node:20-alpine

WORKDIR /app

# 只复制生产依赖和编译产物
COPY package*.json ./
COPY prisma/ ./prisma/

# 只安装生产依赖（--omit=dev）
RUN npm ci --omit=dev

# 从 builder 阶段复制编译后的代码和 Prisma Client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

# 创建上传目录并启动编译后的入口
CMD mkdir -p uploads/avatars uploads/posts && node dist/index.js
