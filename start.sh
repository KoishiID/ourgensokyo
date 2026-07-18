#!/bin/bash
set -euo pipefail

echo "启动服务..."

docker compose up -d

docker compose ps

echo "访问 http://localhost"
