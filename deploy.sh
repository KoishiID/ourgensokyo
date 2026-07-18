#!/bin/bash
set -euo pipefail

echo "部署开始..."

# Check .env file exists
if [ ! -f ".env" ]; then
  echo "请先创建 .env 文件"
  exit 1
fi

git pull

docker compose build

docker compose up -d

docker compose ps

echo "部署完成！访问 http://<服务器IP>"
