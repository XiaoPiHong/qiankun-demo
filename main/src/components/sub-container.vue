<template>
  <div id="sub-container" class="w-full h-full"></div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { registerApps, startApps } from "@/utils/qiankun";

onMounted(() => {
  registerApps();
  startApps();
});
</script>
<style scoped> </style>
