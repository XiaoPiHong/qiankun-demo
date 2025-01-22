<template>
  <div class="overflow-hidden">
    <a-layout-sider
      class="h-full overflow-hidden overflow-y-scroll -mr-[15px]"
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
    >
      <a-menu
        v-model:selectedKeys="selectedKeys"
        :items="menuList"
        theme="dark"
        mode="inline"
        @click="onClickMenuItem"
      ></a-menu>
    </a-layout-sider>
  </div>
</template>
<script lang="ts" setup>
import type { MenuProps } from "ant-design-vue";
import * as utilsTree from "@/utils/tree";

const collapsed = defineModel<boolean>("collapsed", {
  required: true,
});
const selectedKeys = defineModel<string[]>("selectedKeys", {
  required: true,
});

const router = useRouter();
const loginRoutes =
  router.getRoutes().find((roote) => roote.name === "LOGIN_ROUTES_ROOT")
    ?.children || [];
const menuList = computed<MenuProps["items"]>(() => {
  return utilsTree.map(loginRoutes, (node, depth, target, parentNode) => {
    if (!node.meta.label) return false;
    return {
      key: `${parentNode ? `${parentNode.key}/` : ""}${node.path}`,
      label: node.meta.label,
      icon: node.meta.icon,
      children: node.children,
    };
  });
});

/**
 * 事件监听，click on MenuItem
 */
const onClickMenuItem = ({ item, key, keyPath }) => {
  console.log(item, key);
  router.push(key);
};
</script>

<style scoped></style>
