import { registerMicroApps, start } from "qiankun";

/** 子应用表 */
const subApps = [
  {
    name: "vue3", // 子应用名称，跟package.json一致
    entry: "//localhost:5174", // 子应用入口，本地环境下指定端口，如果是生产环境可以指定域名
    container: "#sub-container", // 挂载子应用的dom
    activeRule: "/app-vue3", // 路由匹配规则
    props: {}, // 主应用与子应用通信传值
  },
  {
    name: "vue2",
    entry: "//localhost:5175",
    container: "#sub-container",
    activeRule: "/app-vue2",
    props: {},
  },
];

/** 注册 */
export function registerApps() {
  try {
    registerMicroApps(subApps, {
      beforeLoad: [
        async (app) => {
          console.log("before load", app);
        },
      ],
      beforeMount: [
        async (app) => {
          console.log("before mount", app);
        },
      ],
      afterUnmount: [
        async (app) => {
          console.log("before unmount", app);
        },
      ],
    });
  } catch (err) {
    console.log(err);
  }
}

/** 启动 */
export const startApps = () => {
  try {
    return start({
      sandbox: {
        strictStyleIsolation: true,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
