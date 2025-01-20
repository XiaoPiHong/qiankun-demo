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
  // {
  //   name: "vue2",
  //   entry: "//localhost:5175",
  //   container: "#sub-container",
  //   activeRule: "/app-vue2",
  //   props: {},
  // },
];

/** 注册 */
export function registerApps() {
  try {
    registerMicroApps(subApps, {
      beforeLoad: [
        (app) => {
          console.log(
            "[LifeCycle] before load %c%s",
            "color: green;",
            app.name
          );
          /** 设置qiankun全局变量 */
          window.__POWERED_BY_QIANKUN__ = true;
          return Promise.resolve();
        },
      ],
      beforeMount: [
        (app) => {
          console.log(
            "[LifeCycle] before mount %c%s",
            "color: green;",
            app.name
          );
          return Promise.resolve();
        },
      ],
      afterUnmount: [
        (app) => {
          console.log(
            "[LifeCycle] after unmount %c%s",
            "color: green;",
            app.name
          );
          return Promise.resolve();
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
        /** 使用沙箱方式隔离样式 */
        // strictStyleIsolation: true,
        /** 通过给样式添加前缀来实现隔离 */
        // experimentalStyleIsolation: true,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
