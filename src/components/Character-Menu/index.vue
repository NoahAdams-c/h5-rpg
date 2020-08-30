<!--
 * @Description: 角色菜单组件
 * @Author: chenchen
 * @Date: 2020-04-12 15:57:15
 * @LastEditors: chenchen
 * @LastEditTime: 2020-08-09 03:19:28
 -->

<template>
  <div class="c-character-menu"
       :class="show?'open-dialog':'close-dialog'"
       :style="{
      width: menuOptions.width + 'px' || 'fit-content'
  }">
    <!-- 菜单项目 -->
    <div class="c-character-menu__tabs">
      <div class="c-character-menu__tabs--item"
           :class="{active:item.name === selected}"
           v-for="(item,index) in menuOptions.menuItems"
           :key="index"
           @click="selectItem(item.name)">
        <span v-if="item.name === selected">{{item.label}}</span>
        <img :src="imgs[`${item.name}Src`]">
      </div>
    </div>
    <!-- 菜单内容 -->
    <div class="c-character-menu__content"
         :style="{height: menuOptions.height || '300px'}">
      <MenuAttribute v-if="selected === 'attribute'"></MenuAttribute>
      <MenuBag v-if="selected === 'bag'"></MenuBag>
      <MenuQuestion v-if="selected === 'question'"></MenuQuestion>
      <MenuSkill v-if="selected === 'skill'"></MenuSkill>
      <MenuSetting v-if="selected === 'setting'"></MenuSetting>
    </div>
    <!-- 返回游戏按钮 -->
    <img class="c-character-menu__close"
         :src="imgs.continueSrc"
         @click="closeMenu">
  </div>
</template>

<script>
import { item } from "@/resource"

import MenuAttribute from "./components/Menu-Attribute"
import MenuBag from "./components/Menu-Bag"
import MenuQuestion from "./components/Menu-Question"
import MenuSkill from "./components/Menu-Skill"
import MenuSetting from "./components/Menu-Setting"

export default {
  name: "CharacterMenu",

  components: {
    MenuAttribute,
    MenuBag,
    MenuQuestion,
    MenuSkill,
    MenuSetting
  },

  props: {
    /**
     * 菜单配置项
     *
     * 结构：
     * {
     *      width: xx // 宽度 px，
     *      height: xx // 高度 px,
     *      items: [
     *          {
     *              name: xxx, // 菜单项名称
     *              label: xxx // 菜单项标签名称
     *          },
     *          ...
     *      ]
     * }
     */
    menuOptions: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      // 菜单图片资源
      imgs: item,
      // 当前选中菜单项名称
      selected: "attribute",
      show: true
    }
  },

  methods: {
    /**
     * 选择菜单项
     *
     * @param {String} itemName 菜单项名称
     */
    selectItem(itemName) {
      this.selected = itemName
    },
    /**
     * 关闭菜单
     */
    closeMenu() {
      this.show = false
      // 放完关闭动画之后再改变visiable属性
      setTimeout(() => {
        this.$emit("close")
      }, 500)
    }
  }
}
</script>

<style scoped lang="scss">
.c-character-menu {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 999;
  &__tabs {
    width: fit-content;
    margin: auto;
    &--item {
      display: inline-flex;
      flex-direction: column-reverse;
      align-items: center;
      background-color: #faebd7;
      border-radius: 5px;
      user-select: none;
      cursor: pointer;
      font-weight: 900;
      img {
        transform: scale(0.7);
      }
      &.active {
        box-shadow: 0 2px 4px rgba(255, 255, 255, 0.12),
          0 0 6px rgba(255, 255, 255, 0.64);
        background-color: #ffd700;
        padding: 5px;
        img {
          transform: scale(1);
        }
      }
    }
    &--item ~ &--item {
      margin-left: 10px;
    }
  }
  &__content {
    margin-top: 5px;
    height: 300px;
    background-color: #faf0e6;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(255, 255, 255, 0.12),
      0 0 6px rgba(255, 255, 255, 0.64);
  }
  &__close {
    margin-top: 10px;
    float: right;
    border-radius: 5px;
    user-select: none;
    cursor: pointer;
    &:hover {
      background-color: #ffd700;
    }
  }
}
</style>
