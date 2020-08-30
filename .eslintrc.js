/**
 * @Description: eslint配置
 * @Author: chenchen
 * @Date: 2019-11-18 17:35:34
 * @LastEditors: chenchen
 * @LastEditTime: 2020-01-03 16:17:57
 */
module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module"
  },
  env: {
    browser: true,
    es6: true
  },
  plugins: ["vue"],
  extends: [
    "plugin:vue/essential",
    "plugin:vue/recommended",
    "plugin:prettier/recommended"
  ],
  rules: {
    "prettier/prettier": "error",
    "generator-star-spacing": "off",
    indent: "off",
    "no-irregular-whitespace": "off", //这禁止掉 空格报错检查
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  }
}
