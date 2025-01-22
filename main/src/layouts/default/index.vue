<template>
  <a-layout class="w-screen h-screen">
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
</template>
<script lang="ts" setup>
import LayoutSidebar from "./layout-sidebar.vue";
import LayoutHeader from "./layout-header.vue";

const selectedKeys = ref<string[]>(["1"]);
const collapsed = ref<boolean>(false);

const route = useRoute();
console.log(route);
</script>

<style scoped></style>
