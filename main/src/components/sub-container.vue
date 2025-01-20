<template>
  <div id="sub-container"></div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { registerApps, startApps } from "@/utils/qiankun";

onMounted(() => {
  if (!window.QIANKUN_STARTED) {
    window.QIANKUN_STARTED = true;
    registerApps();
    startApps();
  }
});
</script>

<style scoped></style>
