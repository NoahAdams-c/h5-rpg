<!--
 * @Description: 
 * @Author: chenchen
 * @Date: 2020-04-07 21:10:07
 * @LastEditors: chenchen
 * @LastEditTime: 2020-04-11 23:00:30
 -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  // 防止页面刷新丢失vuex数据
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store_state"))
        )
      )
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store_state", JSON.stringify(this.$store.state))
    })
  }
}
</script>
<style lang="scss">
#app {
  height: 100%;
  background-color: #add8e6;
}
</style>
