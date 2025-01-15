# 微前端（[qiankun 方案](https://qiankun.umijs.org/zh)）

## 微前端概念

微前端是借鉴了微服务的理念，将一个庞大的应用拆分成多个独立灵活的小型应用，每个应用都可以独立开发，独立运行，独立部署，还可以随意组合，这样就降低了耦合度，从而更加灵活。

## 何种场景最适用微前端

你有一个应用，模块很多且每个模块很庞大，以跨境电商 erp 系统为例（人事、仓储、销售、采购、商品、物流、财务、海外仓、报表等），其每个模块都能作为独立的小型应用，且由于隶属于同一个后端服务，拆分后子应用可以使用一套用户信息，无需考虑多应用多用户体系的问题。

![](/demo/拆分.png)

## 不要盲目使用微前端

如果你的目的单单是希望能在 A 应用能访问 B 应用的页面而采用微前端，这往往会踩到各种坑（过来人），而且如果其本来就是独立的后端服务，你还需要解决多用户体系的问题，否者就会出现 A 应用登录了，B 应用未登录的情况。

`所以微前端的概念是将庞大的应用拆分成小应用，而不是将小应用聚合成大应用。`

## qiankun 简介

qiankun 方案是基于 single-spa 的微前端方案。

`特点：`

- 1、html entry 的方式引入子应用，相比 js entry 极大的降低了应用改造的成本；
- 2、完备的沙箱方案，js 沙箱做了 SnapshotSandbox、LegacySandbox、ProxySandbox 三套渐进增强方案，css 沙箱做了 strictStyleIsolation、experimentalStyleIsolation 两套适用不同场景的方案；
- 3、做了静态资源预加载能力。

`不足：`

- 1、适配成本比较高，工程化、生命周期、静态资源路径、路由等都要做一系列的适配工作；
- 2、css 沙箱采用严格隔离会有各种问题，js 沙箱在某些场景下执行性能下降严重；
- 3、无法同时激活多个子应用，也不支持子应用保活；
- 4、无法支持 vite 等 esmodule 脚本运行。

底层原理 js 沙箱使用的是 proxy 进行快照然后用用 with(window){} 包裹起来 with 内的 window 其实就是 proxy.window 我们声明变量 var name = '小满' 实际这个变量挂到了 proxy.window 并不是真正的 window
css 沙箱原理 第一个就是 shadowDom 隔离 第二个类似于 Vue 的 scoped \[data-qiankun-426732\]

## 了解 monorepo 架构

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

## 创建主应用（基座）

该 demo 使用 main 作为基座，在主应用中展示子应用，登录信息共用，ui 如下：

![](/demo/base.png)

主应用：vue3+vite+hash 路由模式

1. 主应用安装 qiankun

```bash
cd main
pnpm add qiankun
```

待完善。。。

## 参考文章

[微前端（无界）](https://juejin.cn/post/7212603829572911159?searchId=20250115091619E446D29C3FAB969EA36C)
