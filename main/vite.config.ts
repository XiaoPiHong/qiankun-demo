import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";

const root = process.cwd();
const pathResolve = (pathname: string) => resolve(root, ".", pathname);

// https://vitejs.dev/config/
export default ({ mode }) => {
  const { VITE_API_BASE_URL } = loadEnv(mode, process.cwd());

  return defineConfig({
    server: {
      proxy: {
        [VITE_API_BASE_URL]: {
          target: "https://prod.api.com",
          // target: "http://localhost:3000",
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp(VITE_API_BASE_URL), "/api"),
          bypass(req, res, options) {
            const proxyURL = options.target + options.rewrite!(req.url!);
            res.setHeader("x-req-proxyURL", proxyURL); // 将真实请求地址设置到响应头中
          },
        },
      },
    },
    plugins: [
      vue(),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
        imports: ["vue", "vue-router"],
        dts: true,
      }),
    ],
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: pathResolve("src") + "/",
        },
      ],
    },
    css: {
      postcss: pathResolve("postcss.config.js"),
    },
  });
};
