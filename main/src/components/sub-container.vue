<template>
  <div id="sub-container"></div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { registerApps, startApps } from "@/utils/qiankun";

onMounted(() => {
  registerApps();
  startApps();
});
</script>

<style scoped>
#sub-container {
  width: 100%;
  height: 100%;
}
</style>
