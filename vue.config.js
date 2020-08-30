/**
 * @Description:
 * @Author: chenchen
 * @Date: 2020-03-06 16:31:52
 * @LastEditors: chenchen
 * @LastEditTime: 2020-04-11 21:47:52
 */
const path = require("path")

module.exports = {
  publicPath: "/", // 公共路径
  assetsDir: "./static",
  outputDir: "dist",
  css: {
    loaderOptions: {
      sass: {
        // 全局样式
        prependData: `@import "@s/variables.scss";`
      }
    }
  },
  lintOnSave: false, // 关闭eslint
  productionSourceMap: true, // 生产环境下css 分离文件
  devServer: {
    // 配置服务器
    port: 8080,
    open: false,
    https: false,
    overlay: {
      warnings: true,
      errors: true
    },
    disableHostCheck: true
  },
  configureWebpack: {
    // 覆盖webpack默认配置的都在这里
    resolve: {
      // 配置解析别名
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@s": path.resolve(__dirname, "./src/assets/style"),
        "@i": path.resolve(__dirname, "./src/assets/images"),
        "@p": path.resolve(__dirname, "./public")
      }
    }
  }
}
