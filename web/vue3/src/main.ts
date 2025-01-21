import "./style.css";
import "ant-design-vue/dist/reset.css";
import { createApp, App as VueApp } from "vue";
import { createPinia, Pinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./app.vue";
import router from "./router";
import Antd from "ant-design-vue";
import pluginsDayjs from "@/plugins/dayjs";
import {
  renderWithQiankun,
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";

let app: VueApp<Element> | null = null;
let pinia: Pinia | null = null;

/** 独立运行初始化函数 */
const init = () => {
  app = createApp(App);
  pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  app.use(router).use(pinia).use(Antd).use(pluginsDayjs).mount("#app");
};

/** qiankun运行初始化函数 */
const qiankunInit = () => {
  renderWithQiankun({
    bootstrap() {
      console.log("子应用初始化");
    },
    mount(props: any) {
      const { container } = props;
      app = createApp(App);
      if (!pinia) {
        pinia = createPinia();
        pinia.use(piniaPluginPersistedstate);
      }
      app
        .use(router)
        .use(pinia)
        .use(Antd)
        .use(pluginsDayjs)
        .mount(container.querySelector("#app"));
      console.log("子应用挂载");
    },
    unmount(props: any) {
      app!.unmount();
      app = null;
      console.log("子应用卸载");
    },
    update(props: any) {
      console.log("子应用更新");
    },
  });
};

/** 初始化 */
console.log(qiankunWindow.__POWERED_BY_QIANKUN__);
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  init();
} else {
  qiankunInit();
}
