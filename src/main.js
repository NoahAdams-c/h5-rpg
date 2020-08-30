/**
 * @Description:
 * @Author: chenchen
 * @Date: 2020-04-07 21:10:07
 * @LastEditors: chenchen
 * @LastEditTime: 2020-08-07 15:17:05
 */
import Vue from "vue"
import App from "./App.vue"

// 引入elementui样式文件
import "element-ui/lib/theme-chalk/index.css"
// 引入elementui组件
import {
  Button,
  Input,
  Select,
  Option,
  Card,
  Tabs,
  TabPane,
  Form,
  FormItem,
  Drawer,
  Avatar,
  Message,
  MessageBox,
  Notification,
  Loading
} from "element-ui"

Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)
Vue.component(Card.name, Card)
Vue.component(Tabs.name, Tabs)
Vue.component(TabPane.name, TabPane)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Drawer.name, Drawer)
Vue.component(Avatar.name, Avatar)
Vue.prototype.$message = Message
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.use(Loading.directive)

Vue.config.productionTip = false
// 事件总线
Vue.prototype.$eventBus = new Vue()
// 画布配置对象
import canvasOption from "@/config"
Vue.prototype.$canvasOption = canvasOption
// vuex
import store from "./store"
Vue.prototype.$store = store
// vue-router
import router from "./router"

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
