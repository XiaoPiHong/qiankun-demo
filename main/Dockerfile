# 第 1 阶段：构建
FROM node:18 as build-stage

WORKDIR /app
COPY . .

# 设置 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖并构建 main 项目
RUN pnpm install
RUN pnpm --filter main run build

# 第 2 阶段：配置 nginx 和发布
FROM nginx:latest

# 复制 main 项目的构建结果
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制自定义的 nginx 配置文件
COPY nginx.conf /etc/nginx/nginx.conf