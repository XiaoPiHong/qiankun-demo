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
