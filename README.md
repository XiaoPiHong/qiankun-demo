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

2. 在基座中创建 qiankun.ts 文件，配置 qiankun 子应用信息（注意是配置子应用的信息）

```tsx
import { registerMicroApps, start } from "qiankun";

/** 子应用表 */
const subApps = [
  {
    name: "vue3", // 子应用名称，跟package.json一致
    entry: "//localhost:5174", // 子应用入口（生产环境: //xxx.com）
    container: "#sub-container", // 挂载子应用的dom
    activeRule: "/app-vue3", // 路由匹配规则
    props: {}, // 主应用与子应用通信传值
  },
];

/** 注册 */
export function registerApps() {
  try {
    registerMicroApps(subApps, {
      beforeLoad: [
        (app) => {
          /** 设置qiankun全局变量 */
          window.__POWERED_BY_QIANKUN__ = true;
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
        /**
         * 使用沙箱方式隔离样式：
         * 坑：很多ui框架会把样式注入到文档的head标签中，而开启Shadow DOM技术使外部不影响内部，内部不影响外部，子应用Shadow DOM也就获取不到文档head中外联的css，就会导致子应用的许多组件样式失效
         */
        // strictStyleIsolation: true,
        /**
         * 通过给样式添加前缀来实现隔离：
         * 坑：它是给子应用的所有样式加了一层 data-qiankun=“应用名” 的选择器来隔离，这样会导致加了前缀的样式的权重比ui框架的样式权重高，所以会影响ui框架的样式
         */
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
// 由于我的主应用需要有导航栏来打开子应用，所以我的主应用需要有子应用的路由表，如果主应用不需要有子应用的路由表那么只写一个通配符路由来匹配子应用的路由

/** 通配子应用路由 */
const loginRoutes = [
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
    path: "/app-vue3/:pathMatch(.*)*",
    meta: {
      permissionLevel: RoutePermissionLevelEnum.ADMIN,
      permissionCode: "security",
    },
    component: () => import("@/components/sub-container.vue"),
  },
];

/** 目前主应用的路由(左侧导航栏是用鉴权过的路由中获取的) */
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
    path: "/app-vue3/security",
    redirect: "/app-vue3/security/permission",
    meta: {
      label: "安全管理",
      icon: () => h(SettingFilled),
      permissionLevel: RoutePermissionLevelEnum.ADMIN,
      permissionCode: "security",
    },
    children: [
      {
        path: "permission",
        component: () => import("@/components/sub-container.vue"),
        meta: {
          label: "权限管理",
          icon: () => h(UserOutlined),
          permissionLevel: RoutePermissionLevelEnum.ADMIN,
          permissionCode: "security:permission",
        },
      },
      {
        path: "permission-group",
        component: () => import("@/components/sub-container.vue"),
        meta: {
          label: "权限组管理",
          icon: () => h(GroupOutlined),
          permissionLevel: RoutePermissionLevelEnum.ADMIN,
          permissionCode: "security:permission-group",
        },
      },
    ],
  },
  // 此处省略...
];
```

4. 主应用中添加 sub-container.vue 组件，qiankun.ts 文件中子应用挂载的节点需要与当前组件的节点对应，在此组件挂载时注册并开启微应用，最后向 window 注入\_\_QIANKUN_HAS_BEEN_STARTED\_\_变量（防止反复注册）

```tsx
<template>
  <div id="sub-container" class="w-full h-full"></div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { registerApps, startApps } from "@/utils/qiankun";

onMounted(() => {
  if (!window.__QIANKUN_HAS_BEEN_STARTED__) {
    registerApps();
    startApps();
    window.__QIANKUN_HAS_BEEN_STARTED__ = true;
  }
});
</script>
<style scoped></style>
```

## 创建微应用前期准备

### 应用的运行环境

我希望我的微应用能独立成一个客户端，在基座内部访问时使用的是基座的布局，当独立访问时使用的是微应用的布局。

实现思路：

1. 通过 window.**\_\_POWERED_BY_QIANKUN\_\_** 判断

- 原理：我们在主应用注册微应用时，在 beforeLoad 钩子函数中，向 window 对象注入一个全局变量 **\_\_POWERED_BY_QIANKUN\_\_**，用于标识当前是否运行在 qiankun 主应用中。

- 使用方式：

```js
if (window.__POWERED_BY_QIANKUN__) {
  console.log("运行在 qiankun 微前端中");
} else {
  console.log("单独访问");
}
```

2. 如果微应用使用的是 vite，也可以使用 **vite-plugin-qiankun** 插件，里面提供了 qiankunWindow.**\_\_POWERED_BY_QIANKUN\_\_** 也可以判断是否 qiankun 环境

```tsx
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  console.log("运行在 qiankun 微前端中");
} else {
  console.log("单独访问");
}
```

### 应用之间的通讯方式

待完善。。。

### 应用之间的样式隔离

qiankun 提供的两种样式隔离方案都存在缺点，所以我们主子应用最好是保持一套技术方案，使用相同 ui 组件库，样式隔离的话如果是 vue 则可以使用 scoped 来隔离，不是的话可以使用 css 模块化方案。主子应用使用相同的技术方案能让我们在开发的过程中规避很多问题。

## 主、微应用的路由说明

最好是主、微应用路由模式统一，主是 hash 模式，微最好也是 hash 模式，history 模式也是同理，否则你需要写很多兼容的代码。（主微路由模式不统一：**困难模式**，主微路由模式统一：**简单模式**）

坑: 如果主、微应用都是 history 模式路由，还会遇到浏览器回退，子应用路由丢失 activeRule 路径的问题，所以最好的方式是主和微应用都使用 hash 模式的路由。

## 创建微应用 A

微应用 A：vue3+vite+hash 路由模式

1. 微应用添加 base 静态资源前缀和允许跨域请求的响应头

```ts
import { defineConfig, loadEnv } from "vite";

export default ({ mode }) => {
  return defineConfig({
    base: "/app-vue3/",
    server: {
      port: 5174,
      headers: {
        "Access-Control-Allow-Origin": "*", // 这里只是给开发环境使用，生产环境需在http服务器中配置（nginx）
      },
    },
  });
};

/**
 * 为什么需要配置base：
 * 在开发环境中，可以不配置，因为在开发环境中，qiankun已经做了资源转发，但是到了生产环境，主应用是localhost:5173服务，该微应用是localhost:5174服务，这两个服务访问时候的静态资源关系表是这样的：
 * 主访问主的静态资源：localhost:5173/assets/main.js 对应 localhost:5173/assets/main.js  （能正常访问）
 * 子访问子的静态资源：localhost:5174/assets/microapp.js 对应 localhost:5174/assets/microapp.js  （能正常访问）
 * 主访问子的静态资源：localhost:5173/assets/microapp.js -> 404  （不能正常正常访问）
 * 因为主访问子的时候，所处的站点是5173，自然而然它会把子应用的资源当前自身站点的资源，也就是5173，而5173的站点是没有这些资源的，所以就会出现404的情况，所以就需要在子应用设置base配置项，让主应用知道这些资源哪些是属于子应用的，再通过http服务器转发到5174服务
 *
 * 最终主访问子的静态资源会变成：localhost:5173/app-vue3/assets/microapp.js 对应 localhost:5174/app-vue3/assets/microapp.js  （能正常访问）
 */
```

在生产环境中，如果你使用的是 nginx 可以这样配置：

```bash
# 主应用服务
location /app-vue3/ {
    proxy_pass http://172.21.0.3/app-vue3/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# 子应用服务
location / {
  # 对所有请求添加 CORS 头部，允许所有来源（这个一定要写到location内部，写到外部会生成两个相同的请求头导致跨域抛出错误）
  add_header 'Access-Control-Allow-Origin' '*';
}
```

2. 使用 vite-plugin-qiankun 插件支持 esmodule 脚本运行

```ts
import { defineConfig } from "vite";
import qiankun from "vite-plugin-qiankun";

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    base: "/app-vue3/",
    server: {
      port: 5174,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    plugins: [
      // 这里的第一个参数需要对应主应用中的子应用配置表subApps中的name属性
      qiankun("vue3", {
        useDevMode: true,
      }),
    ],
  });
};
```

3. 当在主应用中启动子应用时，使用 vite-plugin-qiankun 来启动，通过 qiankunWindow.\_\_POWERED_BY_QIANKUN\_\_来区分启动环境

```ts
import "./style.css";
import "ant-design-vue/dist/reset.css";
import { createApp, App as VueApp } from "vue";
import { createPinia, Pinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./app.vue";
import router from "./router";
import Antd from "ant-design-vue";
import pluginsDayjs from "@/plugins/dayjs";
import {
  renderWithQiankun,
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";

let app: VueApp<Element> | null = null;
let pinia: Pinia | null = null;

/** 独立运行初始化函数 */
const init = () => {
  app = createApp(App);
  pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  app.use(router).use(pinia).use(Antd).use(pluginsDayjs).mount("#app");
};

/** qiankun运行初始化函数 */
const qiankunInit = () => {
  renderWithQiankun({
    bootstrap() {
      console.log("子应用初始化");
    },
    mount(props: any) {
      const { container } = props;
      app = createApp(App);
      if (!pinia) {
        pinia = createPinia();
        pinia.use(piniaPluginPersistedstate);
      }
      app
        .use(router)
        .use(pinia)
        .use(Antd)
        .use(pluginsDayjs)
        .mount(container.querySelector("#app"));
      console.log("子应用挂载");
    },
    unmount(props: any) {
      app!.unmount();
      app = null;
      console.log("子应用卸载");
    },
    update(props: any) {
      console.log("子应用更新");
    },
  });
};

/** 初始化 */
console.log(qiankunWindow.__POWERED_BY_QIANKUN__);
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  init();
} else {
  qiankunInit();
}
```

4. 子应用根据启动环境来区分布局

```tsx
<template>
  <a-layout
    class="w-screen h-screen"
    v-if="!qiankunWindow.__POWERED_BY_QIANKUN__"
  >
    <layout-sidebar
      v-model:collapsed="collapsed"
      v-model:selectedKeys="selectedKeys"
    />
    <a-layout class="overflow-hidden">
      <layout-header v-model:collapsed="collapsed" />

      <a-layout class="overflow-auto h-auto">
        <a-layout-content class="!min-h-max m-4 p-4 bg-white">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" v-if="route.meta.keepAlive" />
            </keep-alive>
            <component :is="Component" v-if="!route.meta.keepAlive" />
          </router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
  <router-view v-slot="{ Component }" v-else>
    <keep-alive>
      <component :is="Component" v-if="route.meta.keepAlive" />
    </keep-alive>
    <component :is="Component" v-if="!route.meta.keepAlive" />
  </router-view>
</template>
<script lang="ts" setup>
import LayoutSidebar from "./layout-sidebar.vue";
import LayoutHeader from "./layout-header.vue";
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";

const route = useRoute();
console.log(route);

const selectedKeys = ref<string[]>(["1"]);
const collapsed = ref<boolean>(false);
</script>

<style scoped></style>
```

## 参考文章

[微前端（无界）](https://juejin.cn/post/7212603829572911159?searchId=20250115091619E446D29C3FAB969EA36C)
[qiankun：vue3 + vite 从开发到部署实现微前端](https://juejin.cn/post/7216536069285429285?searchId=2025011420204538E19D74D6B19482A839)
