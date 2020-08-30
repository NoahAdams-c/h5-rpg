/**
 * @Description: canvas base util
 * @Author: chenchen
 * @Date: 2020-04-11 00:50:54
 * @LastEditors: chenchen
 * @LastEditTime: 2020-08-09 03:38:10
 */
import canvasOptions from "@/config"

const { canvasCol, canvasRow, blockSize, unreachableAttr } = canvasOptions

class CanvasBase {
  /**
   * 构造器
   *
   * @param {Array} mapData 地图数据
   * @param {Document} canvas 画布对象
   */
  constructor(mapData, canvas = null) {
    this.mapData = mapData
    this.canvas = canvas
    if (this.canvas) {
      // 创建画布工具对象时都对画布进行初始化
      this.clearCanvas()
    }
  }

  /**
   * 清空画布
   */
  clearCanvas() {
    const ctx = this.canvas.getContext("2d")
    ctx.clearRect(0, 0, canvasCol * blockSize, canvasRow * blockSize)
  }

  /**
   * 是否为同一个位置
   *
   * @param {Object} p1 位置一
   * @param {Object} p2 位置二
   */
  isSamePosition(p1, p2) {
    return p1 && p2 && p1.col === p2.col && p1.row === p2.row
  }

  /**
   * 边界检测
   *
   * @param {Number} col 列
   * @param {Number} row 行
   */
  isOutOfBoundary = (col, row) => {
    if (col < 0 || col >= canvasCol || row < 0 || row >= canvasRow) {
      return true
    } else {
      return false
    }
  }

  /**
   * 判断点是否可到达
   *
   * @param {Number} col 列
   * @param {Number} row 行
   */
  isReachable = (col, row) => {
    // 地图外不可达
    if (this.isOutOfBoundary(col, row)) {
      return false
    }
    // 不可达点
    const nodeAttr = this.mapData[row][col]
    if (unreachableAttr.includes(nodeAttr)) {
      return false
    }
    return true
  }

  /**
   * 获取画布上的坐标
   *
   * @param {Number} pageX 页面上的横坐标
   * @param {Number} pageY 页面上的纵坐标
   */
  getPositionOnCanvas = (pageX, pageY) => {
    if (!this.canvas) {
      console.log("Class CanvasBase#canvas is not defined!")
    }
    const bcr = this.canvas.getBoundingClientRect()
    return {
      canvasX: pageX - bcr.left,
      canvasY: pageY - bcr.top
    }
  }

  /**
   * 计算方块的位置（行、列）
   * 行列序号从0开始
   *
   * @param {Number} canvasX 在画布中的横坐标
   * @param {Number} canvasY 在画布中的纵坐标
   */
  calcPositionOfBlock = (canvasX, canvasY) => {
    const bcr = this.canvas.getBoundingClientRect()
    const row = Math.floor(canvasY / blockSize)
    const col = Math.floor(canvasX / blockSize)
    return {
      row,
      col,
      centralPoint: {
        x: col * blockSize + blockSize / 2 + bcr.left,
        y: row * blockSize + blockSize / 2 + bcr.top
      }
    }
  }
}

export default CanvasBase
