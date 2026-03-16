# 基于哪个镜像部署,镜像名称:版本
FROM swr.ckgf-global-1.cccar.com.cn/work_place/nginx:1.23-alpine
# 镜像创建者
MAINTAINER 李江涛
# 拷贝文件夹
ADD dist/ /usr/share/nginx/html/dist/
# 拷贝配置文件
ADD nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]