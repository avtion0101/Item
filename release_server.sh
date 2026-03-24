#!/usr/bin/env bash
set -euo pipefail

APP_NAME="pet-haven"
IMAGE_TAG="amd64"
TAR_PATH="/root/${APP_NAME}-${IMAGE_TAG}.tar"
CONTAINER_NAME="pet-haven"
PORT_MAP="8080:80"

echo "==> 1) 检查 tar 包"
test -f "${TAR_PATH}" || { echo "❌ 未找到 ${TAR_PATH}"; exit 1; }

echo "==> 2) 导入镜像"
docker load -i "${TAR_PATH}"

echo "==> 3) 停旧容器"
docker rm -f ${CONTAINER_NAME} 2>/dev/null || true

echo "==> 4) 启新容器"
docker run -d \
  --name ${CONTAINER_NAME} \
  --restart always \
  -p ${PORT_MAP} \
  ${APP_NAME}:${IMAGE_TAG}

echo "==> 5) 健康检查"
sleep 2
docker ps | grep ${CONTAINER_NAME}
curl -I http://127.0.0.1:8080 || true

echo "✅ 发布完成"
