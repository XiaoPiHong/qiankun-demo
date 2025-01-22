<template>
  <a-layout-header class="!bg-white !ps-4 !pe-4 text-base flex justify-between">
    <menu-unfold-outlined
      v-if="collapsed"
      class="trigger"
      @click="() => (collapsed = !collapsed)"
    />
    <menu-fold-outlined
      v-else
      class="trigger"
      @click="() => (collapsed = !collapsed)"
    />

    <div class="flex items-center space-x-2">
      <img
        class="w-10 h-10 rounded-full"
        src="/image/avatar.jpg"
        alt="avatar"
      />
      <span> {{ userStore.user.username }}</span>
      <a-tooltip title="退出登录" size="small">
        <a-button type="primary" @click="onClickLogoutBtn">
          <template #icon>
            <LogoutOutlined />
          </template>
          退出登录
        </a-button>
      </a-tooltip>
    </div>
  </a-layout-header>
</template>
<script lang="ts" setup>
import { Modal } from "ant-design-vue";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons-vue";
import { useUserStore } from "@/stores";

const router = useRouter();
const userStore = useUserStore();
const collapsed = defineModel<boolean>("collapsed", {
  required: true,
});

const onClickLogoutBtn = () => {
  Modal.confirm({
    title: "确认退出登录？",
    content: "您将退出当前登录状态，确认继续吗？",
    onOk: () => {
      userStore.logout();
      router.push("/app-vue3/login");
    },
  });
};
</script>

<style scoped></style>
