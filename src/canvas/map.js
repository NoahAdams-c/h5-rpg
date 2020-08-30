/**
 * @Description: map util
 * @Author: chenchen
 * @Date: 2020-04-10 22:26:26
 * @LastEditors: chenchen
 * @LastEditTime: 2020-08-06 23:40:59
 */
import canvasOptions from "@/config"
const { canvasCol, canvasRow, blockSize, attrMap } = canvasOptions
import CanvasBase from "@/canvas/base"

class MapCanvas extends CanvasBase {
  /**
   * 构造器
   *
   * @param {Document} canvas 画布对象
   * @param {Array} mapData 地图数据
   */
  constructor(canvas, mapData) {
    super(mapData, canvas)
  }

  /**
   * 绘制地图
   *
   * @param {Document} canvas 画布对象
   */
  drawMap = () => {
    for (var row = 0; row < canvasRow; row++) {
      for (var col = 0; col < canvasCol; col++) {
        this.drawBlock(col, row)
      }
    }
  }

  /**
   * 绘制方块
   *
   * @param {Number} col 列序号
   * @param {Number} row 行序号
   */
  drawBlock = (col, row) => {
    if (this.isOutOfBoundary(col, row)) return
    const blockAttr = this.mapData[row][col]
    const ctx = this.canvas.getContext("2d")
    ctx.clearRect(col * blockSize, row * blockSize, blockSize, blockSize)
    if (blockAttr && blockAttr !== "none") {
      // ctx.fillStyle = attrMap[blockAttr]
      switch (blockAttr) {
        case "tree":
          ctx.drawImage(
            attrMap["grass"],
            col * blockSize,
            row * blockSize,
            blockSize,
            blockSize
          )
          ctx.drawImage(
            attrMap[blockAttr],
            col * blockSize,
            row * blockSize,
            blockSize,
            blockSize
          )
          break
        case "house":
          ctx.drawImage(
            attrMap["grass"],
            col * blockSize,
            row * blockSize,
            blockSize,
            blockSize
          )
          if (
            this.mapData[row - 2][col] === "house" &&
            this.mapData[row - 2][col - 1] === "house" &&
            this.mapData[row - 2][col - 2] === "house" &&
            this.mapData[row - 1][col] === "house" &&
            this.mapData[row - 1][col - 1] === "house" &&
            this.mapData[row - 1][col - 2] === "house" &&
            this.mapData[row][col - 2] === "house"
          ) {
            console.log(22222)
            ctx.drawImage(
              attrMap["house"],
              (col - 2) * blockSize,
              (row - 2) * blockSize,
              blockSize * 3,
              blockSize * 3
            )
          }
          break
        default:
          ctx.drawImage(
            attrMap[blockAttr],
            col * blockSize,
            row * blockSize,
            blockSize,
            blockSize
          )
      }
    } else {
      ctx.fillStyle = (row + col) % 2 === 0 ? "#456" : "#666"
      ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize)
    }
  }
}

export default MapCanvas
