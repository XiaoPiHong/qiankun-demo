import { createRouter, createWebHashHistory } from "vue-router";
import { useUserStore } from "@/stores/";
import * as utilsTree from "@/utils/tree";
import LayoutsDefault from "@/layouts/default/index.vue";
import {
  HomeOutlined,
  SettingFilled,
  UserOutlined,
  GroupOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

/** 路由权限级别枚举 */
enum RoutePermissionLevelEnum {
  PUBLIC = "PUBLIC",
  LOGIN = "LOGIN",
  ADMIN = "ADMIN",
}

/** 公共路由 */
export const publicRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { permissionLevel: RoutePermissionLevelEnum.PUBLIC },
  },
];

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
  // {
  //   /** history模式需要通配所有路由，详见vue-router文档 */
  //   path: "/app-vue3/:pathMatch(.*)*",
  //   meta: {
  //     permissionLevel: RoutePermissionLevelEnum.ADMIN,
  //     permissionCode: "security",
  //   },
  //   component: () => import("@/components/sub-container.vue"),
  // },
  // {
  //   path: "/app-vue2/",
  //   meta: {
  //     permissionLevel: RoutePermissionLevelEnum.ADMIN,
  //     permissionCode: "system",
  //   },
  //   component: () => import("@/components/sub-container.vue"),
  // },
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
  {
    path: "/app-vue3/system",
    redirect: "/app-vue3/system/user",
    meta: {
      label: "系统管理",
      icon: () => h(SettingFilled),
      permissionLevel: RoutePermissionLevelEnum.ADMIN,
      permissionCode: "system",
    },
    children: [
      {
        path: "user",
        component: () => import("@/components/sub-container.vue"),
        meta: {
          label: "用户管理",
          icon: () => h(UserOutlined),
          permissionLevel: RoutePermissionLevelEnum.ADMIN,
          permissionCode: "system:user",
        },
      },
      {
        path: "user-group",
        component: () => import("@/components/sub-container.vue"),
        meta: {
          label: "用户组管理",
          icon: () => h(GroupOutlined),
          permissionLevel: RoutePermissionLevelEnum.ADMIN,
          permissionCode: "system:user-group",
        },
      },
      {
        path: "client",
        component: () => import("@/components/sub-container.vue"),
        meta: {
          label: "客户端管理",
          icon: () => h(GroupOutlined),
          permissionLevel: RoutePermissionLevelEnum.ADMIN,
          permissionCode: "system:client",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...publicRoutes],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  if (userStore.accessToken) {
    if (!userStore.user) {
      try {
        await userStore.getProfile();
      } catch (error) {
        message.error("获取用户信息失败，请重新登录");
        userStore.logout();
        router.removeRoute("LOGIN_ROUTES_ROOT");
        next("/login");
      }

      const permissionCodeMap = userStore.permissionCodeMap;
      const loginRoutesFiltered = utilsTree.map(
        loginRoutes,
        (node, depth, target, parentNode) => {
          if (node.meta.permissionLevel !== RoutePermissionLevelEnum.ADMIN) {
            return node;
          }

          if (
            node.meta.permissionCode &&
            permissionCodeMap[node.meta.permissionCode]
          ) {
            return node;
          }

          return false;
        }
      );
      router.addRoute({
        name: "LOGIN_ROUTES_ROOT",
        path: "/",
        component: LayoutsDefault,
        redirect: "/home",
        children: loginRoutesFiltered,
      });

      next(to.path);
    } else {
      if (to.path === "/login") {
        next("/home");
      } else {
        next();
      }
    }
  } else {
    if (to.meta.permissionLevel !== RoutePermissionLevelEnum.PUBLIC) {
      next("/login");
    } else {
      next();
    }
  }
});

export default router;
