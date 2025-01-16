<template>
  <div>
    <h2 class="text-4xl font-bold">欢迎使用后台管理系统</h2>
    <p>
      您好，<b>{{ userStore.user.username }}</b>
      ，欢迎回来！
    </p>
    <p>
      今天是 <b>{{ new Date().toLocaleDateString() }}</b
      >，祝您工作愉快！
    </p>

    <a-divider dashed />
    <h3 class="text-2xl font-bold">系统公告</h3>
    <p>
      重要通知：系统将在下周五进行维护，预计持续 2
      小时，期间将暂停所有服务，请提前做好相关安排。
    </p>
    <p>更新日志：版本 1.0.0 已上线，新增用户管理功能优化，修复已知问题。</p>

    <a-divider dashed />
    <h3 class="text-2xl font-bold">系统状态</h3>
    <p>服务器状态：<a-tag color="green">运行正常</a-tag></p>
    <p>数据库连接：<a-tag color="green">正常</a-tag></p>
    <p>
      API 响应时间：
      <a-tag color="green">
        {{ Math.floor(Math.random() * 101) + 100 }} ms
      </a-tag>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores";

const userStore = useUserStore();
</script>

<style scoped></style>
