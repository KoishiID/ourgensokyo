# Stage 1: Build the Vue 3 + Vite application
FROM node:20-alpine AS builder

WORKDIR /build

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production with nginx
FROM nginx:alpine

# Custom nginx config with SPA fallback
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder stage
COPY --from=builder /build/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
