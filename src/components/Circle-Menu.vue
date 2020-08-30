<!--
 * @Description: 圆盘菜单
 * @Author: chenchen
 * @Date: 2020-08-09 02:13:49
 * @LastEditors: chenchen
 * @LastEditTime: 2020-08-09 13:15:21
 -->
<template>
  <div class="c-circle-menu open-dialog"
       :style="{
      width: menuOptions.size + 'px',
      height: menuOptions.size + 'px'
  }">
    <div class="c-circle-menu__centralpoint"></div>
    <div class="c-circle-menu__item"
         :style="{
        width: menuOptions.size / 2 + 'px',
         height:menuOptions.size / 2 + 'px',
        transform:`rotate(${(index*360)/menuOptions.menuItems.length}deg) skew(${90-360/menuOptions.menuItems.length}deg)`
         }"
         v-for="(item,index) in menuOptions.menuItems"
         :key="index"
         @click="onSelect(item.value)">
      <div class="c-circle-menu__item--label"
           :style="{
          transform:`skew(-${90-360/menuOptions.menuItems.length}deg) rotate(${360/menuOptions.menuItems.length/3}deg)`
      }">{{item.label}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CircleMenu",

  props: {
    menuOptions: {
      type: Object,
      default: () => {
        return {
          size: 300,
          menuItems: [
            { label: "菜单1", value: "menu_1" },
            { label: "菜单2", value: "menu_2" },
            { label: "菜单3", value: "menu_3" },
            { label: "菜单4", value: "menu_4" },
            { label: "菜单5", value: "menu_5" },
            { label: "菜单6", value: "menu_6" },
            { label: "菜单7", value: "menu_7" }
            // { label: "菜单8", value: "menu_8" }
          ]
        }
      }
    }
  },

  data() {
    return {}
  },

  methods: {
    /**
     * 选择菜单项
     */
    onSelect(value) {
      this.$emit("selected", value)
    }
  }
}
</script>

<style scoped lang="scss">
.c-circle-menu {
  background-color: rgba(250, 235, 215, 0.3);
  border-radius: 50%;
  position: fixed;
  //   transform: translate(-50%, -50%);
  z-index: 998;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
  &__centralpoint {
    width: 0;
    border: 5px solid rgba(0, 0, 0, 0.3);
    border-radius: 50%;
  }
  &__item {
    cursor: pointer;
    position: absolute;
    top: -1px;
    left: -5px;
    transform-origin: 100% 100%;
    border-bottom: 0;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.1);
    margin: -1px;
    display: flex;
    flex-direction: column-reverse;
    text-align: center;
    &--label {
      transform-origin: 100% 100%;
      user-select: none;
    }
    &:hover {
      background-color: rgba(255, 251, 1, 0.6);
      box-shadow: 0 0 8px 0px rgba(255, 255, 255, 0.6);
    }
  }
}
</style>