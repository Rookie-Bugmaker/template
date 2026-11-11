# 基于哪个镜像部署,镜像名称:版本
FROM swr.ckgf-global-1.cccar.com.cn/work_place/nginx:1.23-alpine
# 镜像创建者
MAINTAINER 李江涛
# 拷贝文件夹
# 与构建publicPath和平台入口/sub/plsm/一致；不能把子应用资源复制到主应用根目录。
COPY dist/ /usr/share/nginx/html/sub/plsm/
# 拷贝配置文件
COPY nginx.conf /etc/nginx/nginx.conf
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
