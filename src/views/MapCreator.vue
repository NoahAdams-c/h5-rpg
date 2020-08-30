<!--
 * @Description: map creator
 * @Author: chenchen
 * @Date: 2020-04-08 13:39:01
 * @LastEditors: chenchen
 * @LastEditTime: 2020-08-10 00:00:26
 -->
<template>
  <div class="map-creator"
       @click="isMenuShow = false"
       @contextmenu="showAttrMenu">
    <div class="map-creator__handler">
      <router-link style="font-size:20px;margin-left:20px;display: block"
                   :to="'/'"
                   v-if="mapData">&lt;&lt;&nbsp;返回</router-link>
      <el-button type="primary"
                 @click="inputFileName('upload')">上传地图数据</el-button>
      <el-button type="primary"
                 @click="inputFileName('download')">下载地图数据</el-button>
      <el-button type="primary"
                 @click="initMap(null,'grass')">草地背景（默认）</el-button>
      <el-button type="primary"
                 @click="initMap(null,'none')">空背景</el-button>
      <el-select value=""
                 placeholder="选择已有地图"
                 @change="initMap">
        <el-option v-for="(item,index) in $canvasOption.mapResources"
                   :key="index"
                   :label="item.mapName"
                   :value="item">
        </el-option>
      </el-select>
    </div>
    <div class="map-creator__name">
      <el-input v-model="mapName"
                placeholder="请输入地图名称"></el-input>
    </div>
    <!-- 地图画布 -->
    <canvas class="map-creator__map"
            ref="creator-canvas"
            :width="$canvasOption.canvasCol * $canvasOption.blockSize"
            :height="$canvasOption.canvasRow * $canvasOption.blockSize">
    </canvas>
    <!-- 角色画布（上层画布，用作渲染选框） -->
    <canvas ref="character-canvas"
            class="map-creator__character"
            :width="$canvasOption.canvasCol * $canvasOption.blockSize"
            :height="$canvasOption.canvasRow * $canvasOption.blockSize"
            @mousemove="moveMouseOnCanvas"
            @click="judgeBlockAttr"></canvas>
    <!-- 链接选择弹框 -->
    <div v-if="isLinkSelectorShow"
         class="map-creator__linkselector">
      <div class="map-creator__linkselector--tip">此方块为带有链接的方块</div>
      <el-select v-model="linkMapKeys"
                 placeholder="请选择链接的地图">
        <el-option v-for="(item,index) in $canvasOption.mapResources"
                   :key="index"
                   :label="item.mapName"
                   :value="index">
        </el-option>
      </el-select>
      <div class="map-creator__linkselector--handle">
        <el-button @click="isLinkSelectorShow = false">取消</el-button>
        <el-button type="primary"
                   @click="drawBlock(true)">确认</el-button>
      </div>
    </div>
    <!-- 属性选择菜单 -->
    <CircleMenu v-if="isMenuShow"
                ref="attr-menu"
                :menuOptions="getMenuOptions"
                :style="menuPosition"
                @selected="selectBlockAttr"></CircleMenu>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

import MapCanvas from "@/canvas/map"
import CharacterCanvas from "@/canvas/character"

import CircleMenu from "@/components/Circle-Menu"

export default {
  name: "MapCreator",

  components: {
    CircleMenu
  },

  data() {
    return {
      // 当前选中位置
      selectedPosition: null,
      // 地图名称
      mapName: "",
      // 地图方块属性数据
      mapData: null,
      // 地图方块链接数据
      linkData: null,
      // 是否显示方块属性菜单
      isMenuShow: false,
      // 是否显示链接选择弹框
      isLinkSelectorShow: false,
      // 菜单位置
      menuPosition: {
        top: 0,
        left: 0
      },
      // 地图画布对象
      mapCanvas: null,
      // 角色画布对象
      characterCanvas: null,
      // 选中的属性
      selectedAttr: "",
      // 链接地图
      linkMapKeys: ""
    }
  },

  computed: {
    ...mapGetters(["getCurrentMap"]),
    getMenuOptions() {
      const { attrMap } = this.$canvasOption
      const menuItems = []
      for (let key in attrMap) {
        menuItems.push({
          label: key,
          value: key
        })
      }
      return {
        size: 240,
        menuItems
      }
    }
  },

  created() {
    this.initMap(null, "grass")
  },

  methods: {
    /**
     * 初始化地图
     *
     * @param {String} map 地图数据
     * @param {String} attr 方块属性
     */
    initMap(map, attr = "grass") {
      const { canvasCol, canvasRow } = this.$canvasOption
      // 如果没有缓存的地图数据则初始化地图数据
      if (!map) {
        // 初始化地图方块属性数据
        this.mapData = new Array(canvasRow)
          .fill("")
          .map(() => new Array(canvasCol).fill(attr))
        // 初始化地图方块链接数据
        this.linkData = new Array(canvasRow)
          .fill("")
          .map(() => new Array(canvasCol).fill(""))
      } else {
        this.mapData = map.mapData
        this.mapName = map.mapName
        this.linkData = map.linkData
      }
      this.$nextTick(() => {
        // 初始化工具对象
        this.mapCanvas = new MapCanvas(
          this.$refs["creator-canvas"],
          this.mapData
        )
        this.characterCanvas = new CharacterCanvas(
          this.$refs["character-canvas"],
          this.mapData,
          false
        )
        this.mapCanvas.drawMap()
      })
    },

    /**
     * 鼠标在画布上移动事件
     *
     * @param {Event} event 事件对象
     */
    moveMouseOnCanvas(event) {
      if (this.isMenuShow || this.isLinkSelectorShow) return
      this.selectedPosition = this.characterCanvas.getSelected()
      // 获取画布上的坐标
      const canvasPosition = this.mapCanvas.getPositionOnCanvas(
        event.pageX,
        event.pageY
      )
      // 获取鼠标所在方块位置
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
      console.log(this.mapData[positionOfBlock.row][positionOfBlock.col])
    },

    /**
     * 展示方块属性菜单
     *
     * @param {Event} event 事件对象
     */
    showAttrMenu(event) {
      event.preventDefault()
      if (this.isMenuShow) {
        this.isMenuShow = false
        return
      }
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
      this.menuPosition.top = positionOfBlock.centralPoint.y + "px"
      this.menuPosition.left = positionOfBlock.centralPoint.x + "px"
      this.isMenuShow = true
    },

    /**
     * 选择方块属性
     *
     * @param {Event} attr 方块属性
     */
    selectBlockAttr(attr) {
      this.selectedAttr = attr
    },

    /**
     * 判断方块属性决定操作
     */
    judgeBlockAttr(event) {
      // 未选择方块属性则不渲染
      if (!this.selectedAttr) {
        return
      }
      // 如果正展开菜单则不响应
      if (this.isMenuShow || this.isLinkSelectorShow) {
        return
      }
      // 如果为包含链接的属性则提示选择链接到哪个地图
      if (this.$canvasOption.linkAttr.indexOf(this.selectedAttr) > -1) {
        this.isLinkSelectorShow = true
      } else {
        this.drawBlock()
      }
    },

    /**
     * 存储地图信息并渲染方块
     * @param {Boolean} hasLink 是否带有链接
     */
    drawBlock(hasLink = false) {
      const { col, row } = this.selectedPosition
      // 如果带有链接则将链接信息存储到指定位置
      if (hasLink) {
        this.linkData[row][col] = this.linkMapKeys
        // 关闭链接选择面板
        this.isLinkSelectorShow = false
      }
      if (this.selectedAttr === "link") {
        // 如果为“链接”类型，则不进行渲染只添加链接
        return
      } else if (this.selectedAttr === "house") {
        this.mapData[row][col] = "house"
        this.mapData[row][col - 1] = "door"
        this.mapData[row][col - 2] = "house"
        this.mapData[row - 1][col] = "house"
        this.mapData[row - 1][col - 1] = "house"
        this.mapData[row - 1][col - 2] = "house"
        this.mapData[row - 2][col] = "house"
        this.mapData[row - 2][col - 1] = "house"
        this.mapData[row - 2][col - 2] = "house"
        this.mapCanvas.drawBlock(col - 1, row)
      } else {
        this.mapData[row][col] = this.selectedAttr
      }
      this.mapCanvas.drawBlock(col, row)
    },

    /**
     * 展示输入文件名的弹框
     *
     * @param {String} opt 操作标志(上传或下载)
     */
    inputFileName(opt) {
      if (!this.mapName) {
        this.$notify({
          title: "提示",
          message: this.$createElement(
            "span",
            { style: "color: #FF8C00;font-size:16px;" },
            "请先输入地图名称"
          ),
          type: "warning",
          duration: 3000
        })
        return
      }
      this.$prompt("请输入文件名", "保存地图", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^\w+$/,
        inputPlaceholder: "字母、数字、下划线",
        inputErrorMessage: "文件名只支持字母、数字、下划线"
      })
        .then(({ value }) => {
          if (opt === "download") {
            this.downloadMapData(value)
          } else {
            this.uploadMapData(value)
          }
        })
        .catch(() => {})
    },

    /**
     * 上传地图数据
     *
     * @param {String} fileName 文件名
     */
    uploadMapData(fileName) {},

    /**
     * 下载地图数据
     *
     * @param {String} fileName 文件名
     */
    downloadMapData(fileName) {
      const jsonMapData = JSON.stringify({
        mapName: this.mapName,
        mapData: this.mapData,
        linkData: this.linkData
      })
      fileName += ".json"
      // 创建下载链接下载
      var elementA = document.createElement("a")
      elementA.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + jsonMapData
      )
      elementA.setAttribute("download", fileName)
      elementA.style.display = "none"
      document.body.appendChild(elementA)
      elementA.click()
      document.body.removeChild(elementA)
    }
  }
}
</script>

<style lang="scss" scoped>
.map-creator {
  height: 100vh;
  &__handler {
    .el-button {
      display: block;
      margin: 20px;
    }
    .el-select {
      margin: 20px;
    }
  }
  &__name {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 10px);
  }
  &__tools {
    height: fit-content;
    width: 200px;
    background-color: #faebd7;
    border-radius: 4px;
    position: fixed;
    right: 0;
    top: 50px;
  }
  &__map,
  &__character {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }
  &__map {
    z-index: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
  &__character {
    z-index: 2;
  }
  &__menu {
    // border: 1px solid black;
    position: absolute;
    z-index: 9999;
    user-select: none;
    cursor: pointer;
    border-radius: 5px;
    padding: 5px 2px;
    background-color: #808080;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    &--item {
      background-color: #f5f5f5;
      padding: 3px 10px;
      &:hover {
        background-color: #f08080;
      }
    }
    &--item ~ &--item {
      border-top: 1px solid #eaeaea;
    }
  }
  &__linkselector {
    position: fixed;
    z-index: 1999;
    background: white;
    padding: 15px 10px;
    border-radius: 4px;
    width: 250px;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    &--tip {
      margin-bottom: 10px;
      font-size: 18px;
    }
    .el-select {
      width: 100%;
    }
    &--handle {
      text-align: right;
      margin-top: 5px;
    }
  }
}
</style>
