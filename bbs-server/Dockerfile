# =============================================================================
# BBS Server — Express.js + Prisma + SQLite (Node.js 20 Alpine)
# =============================================================================
FROM node:20-alpine

WORKDIR /app

# ------------------------------------------------------------------
# Layer 1: Dependencies & Prisma config (for Docker layer caching)
# ------------------------------------------------------------------
COPY package*.json prisma.config.ts ./
COPY prisma/ ./prisma/

# Install only production dependencies — respects lock file
RUN npm ci --omit=dev

# Generate Prisma client (creates node_modules/.prisma/client/)
RUN npx prisma generate

# ------------------------------------------------------------------
# Layer 2: Application source code
# ------------------------------------------------------------------
COPY src/ ./src/

# ------------------------------------------------------------------
# Runtime
# ------------------------------------------------------------------
EXPOSE 3000

# Upload directories are created at runtime (not build time)
CMD mkdir -p uploads/avatars uploads/posts && node src/index.js
