import "./style.css";
import "ant-design-vue/dist/reset.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./app.vue";
import router from "./router";
import Antd from "ant-design-vue";
import pluginsDayjs from "@/plugins/dayjs";
import {
  renderWithQiankun,
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
const usedApp = app.use(router).use(pinia).use(Antd).use(pluginsDayjs);

/** 独立运行挂载函数 */
const render = () => {
  usedApp.mount("#app");
};

/** qiankun运行挂载 */
const qiankunRender = (props) => {
  console.log(props);
  const { container } = props;
  usedApp.mount(container.querySelector("#app"));
};

/** 独立运行初始化函数 */
const init = () => {
  render();
};

/** qiankun运行初始化函数 */
const qiankunInit = () => {
  renderWithQiankun({
    bootstrap() {},
    mount(props) {
      qiankunRender(props);
    },
    unmount(props) {},
    update(props) {},
  });
};

/** 初始化 */
console.log(qiankunWindow.__POWERED_BY_QIANKUN__);
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  init();
} else {
  qiankunInit();
}
