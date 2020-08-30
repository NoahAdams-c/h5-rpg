/**
 * @Description: router
 * @Author: chenchen
 * @Date: 2020-04-07 21:10:07
 * @LastEditors: chenchen
 * @LastEditTime: 2020-04-08 13:47:40
 */
import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    // lazy-loaded when the route is visited
    component: () => import(/* webpackChunkName: "about" */ "../views/Home.vue")
  },
  {
    path: "/map-creator",
    name: "MapCreator",
    // lazy-loaded when the route is visited
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/MapCreator.vue")
  }
]

const router = new VueRouter({
  routes
})

export default router
