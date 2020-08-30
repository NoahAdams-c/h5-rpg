/**
 * @Description: vuex - store
 * @Author: OBKoro1
 * @Date: 2020-04-07 21:10:07
 * @LastEditors: chenchen
 * @LastEditTime: 2020-04-12 00:00:13
 */
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentMap: null
  },
  getters: {
    getCurrentMap(state) {
      return state.currentMap
    }
  },
  mutations: {
    updateCurrentMap(state, currentMap) {
      state.currentMap = currentMap
    }
  },
  actions: {},
  modules: {}
})
