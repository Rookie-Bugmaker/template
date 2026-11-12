#!/bin/sh
# 内网test分支构建；任一步失败立即停止，防止后续镜像阶段复用旧dist。
set -eu

# package.json使用link:../crrc-web-packages，必须先由流水线准备同级私有组件源码。
if [ ! -f ../crrc-web-packages/package.json ]; then
    echo '缺少同级crrc-web-packages组件工程，请先准备流水线依赖，不能继续使用旧产物。' >&2
    exit 1
fi

yarn config set fetch-retry-maxtimeout 60000
yarn config set fetch-retry-mintimeout 10000
yarn config set registry http://10.151.247.122:8081/repository/npm-group/
yarn

# 已包含PLSM页面分包及入口文件检查，生成dist/plsm-release.json供现场核对。
yarn build:test
test -s dist/plsm-release.json
