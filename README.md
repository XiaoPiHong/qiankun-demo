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

主应用：vue3+vite+history 路由模式

1. 主应用安装 qiankun

```bash
cd main
pnpm add qiankun
```

2. 在基座中创建 qiankun.ts 文件，配置 qiankun 子应用信息（注意是配置子应用的信息）

```tsx
import { registerMicroApps, start } from "qiankun";

/** 子应用表 */
const subApps = [
  {
    name: "vue3", // 子应用名称，跟package.json一致
    entry: "//localhost:5174", // 子应用入口，本地环境下指定端口，如果是生产环境可以指定域名
    container: "#sub-container", // 挂载子应用的dom
    activeRule: "/app-vue3", // 路由匹配规则
    props: {}, // 主应用与子应用通信传值
  },
  {
    name: "vue2",
    entry: "//localhost:5175",
    container: "#sub-container",
    activeRule: "/app-vue2",
    props: {},
  },
];

/** 注册 */
export function registerApps() {
  try {
    registerMicroApps(subApps, {
      beforeLoad: [
        (app) => {
          console.log(
            "[LifeCycle] before load %c%s",
            "color: green;",
            app.name
          );
          return Promise.resolve();
        },
      ],
      beforeMount: [
        (app) => {
          console.log(
            "[LifeCycle] before mount %c%s",
            "color: green;",
            app.name
          );
          return Promise.resolve();
        },
      ],
      afterUnmount: [
        (app) => {
          console.log(
            "[LifeCycle] after unmount %c%s",
            "color: green;",
            app.name
          );
          return Promise.resolve();
        },
      ],
    });
  } catch (err) {
    console.log(err);
  }
}

/** 启动 */
export const startApps = () => {
  try {
    return start({
      sandbox: {
        // strictStyleIsolation: true,
        // experimentalStyleIsolation: true,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
```

3. 主应路由中配置匹配子应用的路由

此处将 system 和 security 模块作为子应用，做了资源鉴权，如果后端返回的资源列表中没有 permissionCode 对应的资源，将不会把子应用的路由添加到路由表中，也就访问不到子应用的资源。（对于一些需要授权才能访问的子应用这里可以实现）

```tsx
/** 登录路由 */
export const loginRoutes = [
  {
    path: "/home",
    component: () => import("@/views/dashboard/home/index.vue"),
    meta: {
      label: "首页",
      icon: () => h(HomeOutlined),
      permissionLevel: RoutePermissionLevelEnum.LOGIN,
    },
  },
  {
    /** history模式需要通配所有路由，详见vue-router文档 */
    path: "/app-vue3/:pathMatch(.*)*",
    meta: {
      permissionLevel: RoutePermissionLevelEnum.ADMIN,
      permissionCode: "security",
    },
    component: () => import("@/components/sub-container.vue"),
  },
  {
    path: "/app-vue2/",
    meta: {
      permissionLevel: RoutePermissionLevelEnum.ADMIN,
      permissionCode: "system",
    },
    component: () => import("@/components/sub-container.vue"),
  },
];
```

4. 主应用中添加 sub-container.vue 组件，qiankun.ts 文件中子应用挂载的节点需要与当前组件的节点对应

```tsx
<template>
  <div id="sub-container"></div>
</template>
<script lang="ts" setup> </script>
<style scoped> </style>
```

## 创建微应用前期准备

我希望我的微应用能独立成一个客户端，在基座内部访问时使用的是基座的布局，当独立访问时使用的是微应用的布局。

实现思路：

1. 通过 window.**\_\_POWERED_BY_QIANKUN\_\_** 判断

- 原理：我们在主应用注册微应用时，在beforeLoad钩子函数中，向 window 对象注入一个全局变量 **\_\_POWERED_BY_QIANKUN\_\_**，用于标识当前是否运行在 qiankun 主应用中。

- 使用方式：

```js
if (window.__POWERED_BY_QIANKUN__) {
  console.log("运行在 qiankun 微前端中");
} else {
  console.log("单独访问");
}
```

2. 如果微应用使用的是vite，也可以使用 **vite-plugin-qiankun** 插件，里面提供了qiankunWindow.**\_\_POWERED_BY_QIANKUN\_\_** 也可以判断是否qiankun环境
```tsx
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  console.log("运行在 qiankun 微前端中");
} else {
  console.log("单独访问");
}
```

## 创建微应用 A

微应用 A：vue3+vite+history 路由模式

待完善。。。

## 参考文章

[微前端（无界）](https://juejin.cn/post/7212603829572911159?searchId=20250115091619E446D29C3FAB969EA36C)
