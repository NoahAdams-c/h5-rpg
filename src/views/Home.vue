<!--
 * @Description: home page
 * @Author: chenchen
 * @Date: 2020-04-07 21:10:07
 * @LastEditors: chenchen
 * @LastEditTime: 2020-08-09 00:57:51
 -->
<template>
  <div class="home">
    <!-- 状态面板 -->
    <div class="home__statusbar">
      <!-- 状态#位置 -->
      <div class="home__statusbar--position">
        {{ mapName }} ({{ characterPosition ? characterPosition.col : 0 }},{{
          characterPosition ? characterPosition.row : 0
        }})
      </div>
      <!-- 状态#行为 -->
      <div class="home__statusbar--behavior"
           :class="{ active: isMoving }">
        {{ isMoving ? "寻路中..." : "静止" }}
      </div>
    </div>
    <router-link :to="'/map-creator'">编辑地图</router-link>
    <!-- 地图渲染画布 -->
    <canvas ref="map-canvas"
            class="home__map page-center"
            :width="$canvasOption.canvasCol * $canvasOption.blockSize"
            :height="$canvasOption.canvasRow * $canvasOption.blockSize"></canvas>
    <!-- 角色渲染画布 -->
    <canvas ref="character-canvas"
            class="home__character page-center"
            :width="$canvasOption.canvasCol * $canvasOption.blockSize"
            :height="$canvasOption.canvasRow * $canvasOption.blockSize"
            @click="onClickCanvas"
            @mousemove="moveMouseOnCanvas"></canvas>
    <!-- 菜单 -->
    <CharacterMenu :menuOptions="menuOptions"
                   @close="isMenuShow = false"
                   v-if="isMenuShow"></CharacterMenu>
    <!-- 遮罩层 -->
    <div class="home__menumask page-center"
         :style="{
        width: $canvasOption.canvasCol * $canvasOption.blockSize + 'px',
        height: $canvasOption.canvasRow * $canvasOption.blockSize + 'px'
      }"
         v-if="isMenuShow"></div>
    <!-- 过图遮罩 -->
    <MigrateMask class="page-center"
                 v-if="isMigrate"
                 @close="onMigrateFinish"></MigrateMask>
  </div>
</template>

<script>
import A_star from "@/util/A-star"
import MapCanvas from "@/canvas/map"
import CharacterCanvas from "@/canvas/character"

import CharacterMenu from "@/components/Character-Menu/index"
import MigrateMask from "@/components/Migrate-Mask"

export default {
  name: "Home",

  components: {
    CharacterMenu,
    MigrateMask
  },

  data() {
    return {
      // 当前角色位置
      characterPosition: null,
      // 移动路径记录 ["row1:col1","row2:col2",...]
      pathCache: [],
      // 地图名称
      mapName: "",
      // 地图方块属性数据
      mapData: null,
      // 地图方块链接数据
      linkData: null,
      // 地图画布对象
      mapCanvas: null,
      // 角色画布对象
      characterCanvas: null,
      // 是否展示菜单
      isMenuShow: false,
      // 是否发生迁移（地图变更）
      isMigrate: false,
      // 菜单链接键
      linkMapKey: "",
      // 菜单项配置
      menuOptions: {
        width:
          this.$canvasOption.canvasCol * this.$canvasOption.blockSize - 200,
        // 菜单项数据
        menuItems: [
          {
            name: "attribute",
            label: "属性"
          },
          {
            name: "bag",
            label: "背包"
          },
          {
            name: "skill",
            label: "技能"
          },
          {
            name: "question",
            label: "任务"
          },
          {
            name: "setting",
            label: "设置"
          }
        ]
      },
      // 当前选择的菜单项
      curMenuItem: "attribute",
      // 是否正在移动
      isMoving: false
    }
  },

  // 路由守卫拦截出生地图错误时跳转到地图编辑
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { birthMap, canvasCol, canvasRow } = vm.$canvasOption
      if (
        birthMap &&
        birthMap.mapData &&
        birthMap.mapData.length === canvasRow &&
        birthMap.mapData[0].length === canvasRow
      ) {
        next()
      } else {
        vm.$router.push({ path: "/map-creator" })
      }
    })
  },

  created() {
    // 获取初始地图数据
    const map = this.$canvasOption.birthMap
    // 监听移动
    this.$eventBus.$on("moving", data => {
      this.isMoving = data.isMoving
      this.characterPosition = data.characterPosition
      // 每次移动结束判断到达的点是否有链接，如果有则重新渲染地图为链接地图
      if (!data.isMoving) {
        const linkMapKey = this.linkData[data.characterPosition.row][
          data.characterPosition.col
        ]
        if (linkMapKey) {
          this.isMigrate = true
          this.linkMapKey = linkMapKey
        }
      }
    })
    this.$nextTick(() => {
      this.init(map)
      // 监听键盘事件
      document.onkeydown = event => {
        this.onKeyboardControl(event)
      }
    })
  },

  methods: {
    /**
     * 初始化
     */
    init(map) {
      this.mapData = map.mapData
      this.mapName = map.mapName
      this.linkData = map.linkData
      this.$store.commit("updateCurrentMap", map)
      // 初始化工具对象
      this.mapCanvas = new MapCanvas(this.$refs["map-canvas"], this.mapData)
      this.characterCanvas = new CharacterCanvas(
        this.$refs["character-canvas"],
        this.mapData
      )
      // 初始化角色位置
      this.characterPosition = this.characterCanvas.getCharacter()
      this.mapCanvas.drawMap()
    },

    /**
     * 鼠标在画布上移动事件
     *
     * @param {Event} event 事件对象
     */
    moveMouseOnCanvas(event) {
      // 获取画布上的坐标
      const canvasPosition = this.mapCanvas.getPositionOnCanvas(
        event.pageX,
        event.pageY
      )
      // 获取方块位置
      const positionOfBlock = this.mapCanvas.calcPositionOfBlock(
        canvasPosition.canvasX,
        canvasPosition.canvasY
      )
      // 仅当鼠标所在方块位置改变时绘制选框
      if (
        this.mapCanvas.isSamePosition(this.selectedPosition, positionOfBlock)
      ) {
        return
      }
      // 绘制选框
      this.characterCanvas.drawSelectedBlock(
        positionOfBlock.col,
        positionOfBlock.row
      )
    },

    /**
     * 鼠标在画布上点击事件
     *
     * @param {Event} event 事件对象
     */
    onClickCanvas(event) {
      if (this.isMoving) {
        return
      }
      // 角色位置
      const characterPosition = this.characterCanvas.getCharacter()
      // 目标方块位置
      const targetPosition = this.characterCanvas.getSelected()
      // 如果目标位置即角色位置，则展开菜单面板
      if (this.mapCanvas.isSamePosition(characterPosition, targetPosition)) {
        this.isMenuShow = true
      }
      // 如果目标方块无法到达则不进行移动
      if (
        !this.characterCanvas.isReachable(
          targetPosition.col,
          targetPosition.row
        )
      ) {
        return
      }
      // 如果方块四周均为无法到达的方块则不进行移动
      if (
        !this.characterCanvas.isReachable(
          targetPosition.col - 1,
          targetPosition.row
        ) &&
        !this.characterCanvas.isReachable(
          targetPosition.col + 1,
          targetPosition.row
        ) &&
        !this.characterCanvas.isReachable(
          targetPosition.col,
          targetPosition.row - 1
        ) &&
        !this.characterCanvas.isReachable(
          targetPosition.col,
          targetPosition.row + 1
        )
      ) {
        return
      }
      console.log(
        JSON.stringify(characterPosition),
        JSON.stringify(targetPosition)
      )
      A_star.init(this.mapData, characterPosition, targetPosition)
      const path = A_star.start()
      if (path.length) {
        this.characterCanvas.move(path)
      } else {
        console.log("寻路失败")
      }
    },

    /**
     * 键盘控制
     * @param {Event} event 事件对象
     *
     * keycode 37 = Left
     *keycode 38 = Up
     *keycode 39 = Right
     *keycode 40 = Down
     */
    onKeyboardControl(event) {
      console.log(222)
      if (this.isMoving) {
        return
      }
      const keyCode = event.keyCode
      // 暂只做方向键的控制
      if ([37, 38, 39, 40].indexOf(keyCode) < 0) {
        return
      }
      // 角色位置
      const characterPosition = this.characterCanvas.getCharacter()
      // 目标方块位置
      let targetPosition = JSON.parse(JSON.stringify(characterPosition))
      switch (keyCode) {
        case 37:
          targetPosition.col--
          break
        case 38:
          targetPosition.row--
          break
        case 39:
          targetPosition.col++
          break
        case 40:
          targetPosition.row++
          break
      }
      // 如果目标方块无法到达则不进行移动
      if (
        !this.characterCanvas.isReachable(
          targetPosition.col,
          targetPosition.row
        )
      ) {
        return
      }
      console.log(
        JSON.stringify(characterPosition),
        JSON.stringify(targetPosition)
      )
      this.characterCanvas.move([characterPosition, targetPosition])
    },

    /**
     * 过图完成
     */
    onMigrateFinish() {
      this.isMigrate = false
      const linkMap = this.$canvasOption.mapResources[this.linkMapKey]
      this.init(linkMap)
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  &__statusbar {
    text-align: center;
    margin: auto;
    width: 300px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    padding: 5px 0;
    font-weight: 900;
    div ~ div {
      margin-top: 5px;
    }
    &--behavior {
      &.active {
        color: #ff4500;
      }
    }
  }
  &__map {
    z-index: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
  &__character {
    z-index: 2;
  }
  &__menu {
    z-index: 999;
  }
  &__menumask {
    background-color: #696969;
    opacity: 0.5;
    z-index: 998;
  }
}
</style>
