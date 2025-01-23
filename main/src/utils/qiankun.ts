import { registerMicroApps, start } from "qiankun";

/** 子应用表 */
const subApps = [
  {
    name: "vue3", // 子应用名称，跟package.json一致
    entry: "//localhost:5174", // 子应用入口（生产环境: //xxx.com）
    container: "#sub-container", // 挂载子应用的dom
    activeRule: "#/app-vue3", // 路由匹配规则
    props: {}, // 主应用与子应用通信传值
  },
];

/** 注册 */
export function registerApps() {
  try {
    registerMicroApps(subApps, {
      beforeLoad: [
        (app) => {
          /** 设置qiankun全局变量 */
          window.__POWERED_BY_QIANKUN__ = true;
          console.log(
            "[LifeCycle] before load %c%s",
            "color: green;",
            app.name
          );
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
        /**
         * 使用沙箱方式隔离样式：
         * 坑：很多ui框架会把样式注入到文档的head标签中，而开启Shadow DOM技术使外部不影响内部，内部不影响外部，子应用Shadow DOM也就获取不到文档head中外联的css，就会导致子应用的许多组件样式失效
         */
        // strictStyleIsolation: true,
        /**
         * 通过给样式添加前缀来实现隔离：
         * 坑：它是给子应用的所有样式加了一层 data-qiankun=“应用名” 的选择器来隔离，这样会导致加了前缀的样式的权重比ui框架的样式权重高，所以会影响ui框架的样式
         */
        // experimentalStyleIsolation: true,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
