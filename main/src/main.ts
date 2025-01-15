import "./style.css";
import "ant-design-vue/dist/reset.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./app.vue";
import router from "./router";
import Antd from "ant-design-vue";
import pluginsDayjs from "@/plugins/dayjs";

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
app.use(router).use(pinia).use(Antd).use(pluginsDayjs).mount("#app");
