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

echo "==> 本地构建 amd64 镜像"
docker buildx use petbuilder >/dev/null 2>&1 || {
  docker buildx create --name petbuilder --use >/dev/null
}
docker buildx inspect --bootstrap >/dev/null

docker buildx build \
  --platform linux/amd64 \
  --build-arg VITE_SUPABASE_URL="${SUPABASE_URL}" \
  --build-arg VITE_SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}" \
  -t ${APP_NAME}:${IMAGE_TAG} \
  --load .

echo "==> 导出并上传镜像"
docker save -o "${TAR_NAME}" ${APP_NAME}:${IMAGE_TAG}
scp "${TAR_NAME}" ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

echo "==> 远程发布容器"
ssh ${SERVER_USER}@${SERVER_IP} "bash -s" <<'EOF'
set -euo pipefail
APP_NAME="pet-haven"
IMAGE_TAG="amd64"
TAR_PATH="/root/${APP_NAME}-${IMAGE_TAG}.tar"
CONTAINER_NAME="pet-haven"
PORT_MAP="8080:80"

test -f "${TAR_PATH}" || { echo "❌ 未找到 ${TAR_PATH}"; exit 1; }
docker load -i "${TAR_PATH}"
docker rm -f ${CONTAINER_NAME} 2>/dev/null || true
docker run -d --name ${CONTAINER_NAME} --restart always -p ${PORT_MAP} ${APP_NAME}:${IMAGE_TAG}
sleep 2
docker ps | grep ${CONTAINER_NAME}
curl -I http://127.0.0.1:8080 || true
echo "✅ 服务器发布完成"
EOF

echo "✅ 全流程发布完成"
