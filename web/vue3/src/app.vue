<template>
  <a-config-provider
    :locale="zhCN"
    :theme="{ token: { colorPrimary: 'orange', colorLink: 'orange' } }"
  >
    <router-view />
  </a-config-provider>
</template>

<script lang="ts" setup>
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");
</script>

<style scoped></style>
