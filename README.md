# 微前端（[qiankun 方案](https://qiankun.umijs.org/zh)）

## 微前端概念

微前端是借鉴了微服务的理念，将一个庞大的应用拆分成多个独立灵活的小型应用，每个应用都可以独立开发，独立运行，独立部署，还可以随意组合，这样就降低了耦合度，从而更加灵活。

## 何种场景最适用微前端

你有一个应用，模块很多且每个模块很庞大，以跨境电商 erp 系统为例（人事、仓储、销售、采购、商品、物流、财务、海外仓、报表等），其每个模块都能作为独立的小型应用，且由于隶属于同一个后端服务，拆分后子应用可以使用一套用户信息，无需考虑多应用多用户体系的问题。

![](/demo/拆分.png)

## 不要盲目使用微前端

如果你的目的单单是希望能在 A 应用能访问 B 应用的页面而采用微前端，这往往会踩到各种坑（过来人），而且如果其本来就是独立的后端服务，你还需要解决多用户体系的问题，否者就会出现 A 应用登录了，B 应用未登录的情况。

`所以微前端的概念是将庞大的应用拆分成小应用，而不是将小应用聚合成大应用。`

## demo 采用 monorepo 架构

使用[pnpm](https://pnpm.io/)实现 monorepo 架构

### 依赖共用

pnpm 底层原理是使用硬链接（两个文件磁盘地址一样）和软连接（软连接就是文件的一个快捷方式文件）解决了多应用中包不能共用的问题，节省了磁盘空间

```bash
# 全局安装pnpm
npm install pnpm -g

# 初始化项目
pnpm init

# 根目录执行子应用的命令，相当于cd web/vue2 && pnpm run dev
pnpm -F [子应用package.json的name] dev
```

使用 monorepo 架构，创建 pnpm-workspace.yaml 文件，配置 packages 配置项，且在该文件所在的目录中执行 install，就会自动识别项目中的所有包含 package.json 的目录，自动安装依赖

![](/demo/monorepo.png)

### 子模块复用

```bash
# 将子模块作为依赖引用到项目中
pnpm -F [子应用package.json的name] add common
```

![](/demo/main-common.png)

总结 monorepo 架构的好处：

- 1、依赖共用，节省磁盘空间，管理依赖更方便
- 2、子模块复用技术，可以将项目中自己写的包（如：common）作为依赖引用到子应用中达到复用的效果，且当 common 更新时，对应子应用中的 common 依赖也会实时更新

## 参考文章

[微前端（无界）](https://juejin.cn/post/7212603829572911159?searchId=20250115091619E446D29C3FAB969EA36C)
