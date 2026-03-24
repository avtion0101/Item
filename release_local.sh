#!/usr/bin/env bash
set -euo pipefail

APP_NAME="pet-haven"
IMAGE_TAG="amd64"
TAR_NAME="${APP_NAME}-${IMAGE_TAG}.tar"

SERVER_USER="root"
SERVER_IP="58.87.65.224"
SERVER_PATH="/root"

SUPABASE_URL="https://dxgkvwvdnmtoaccrnxew.supabase.co"
SUPABASE_ANON_KEY="sb_publishable_vc0sxKqdwQc8Dwv-9Qb3eQ_V0IN6dF-"

echo "==> 1) 切换 buildx builder"
docker buildx use petbuilder >/dev/null 2>&1 || {
  docker buildx create --name petbuilder --use >/dev/null
}
docker buildx inspect --bootstrap >/dev/null

echo "==> 2) 构建 linux/amd64 镜像"
docker buildx build \
  --platform linux/amd64 \
  --build-arg VITE_SUPABASE_URL="${SUPABASE_URL}" \
  --build-arg VITE_SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}" \
  -t ${APP_NAME}:${IMAGE_TAG} \
  --load .

echo "==> 3) 导出镜像 tar"
docker save -o "${TAR_NAME}" ${APP_NAME}:${IMAGE_TAG}
ls -lh "${TAR_NAME}"

echo "==> 4) 上传到服务器"
scp "${TAR_NAME}" ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

echo "✅ 本地发版包已上传完成：${SERVER_PATH}/${TAR_NAME}"
