/**
 * @Description: character util
 * @Author: chenchen
 * @Date: 2020-04-10 23:37:58
 * @LastEditors: chenchen
 * @LastEditTime: 2020-08-30 14:04:00
 */
import Vue from "vue"
const $eventBus = new Vue().$eventBus

import canvasOptions from "@/config"
const {
  canvasCol,
  canvasRow,
  blockSize,
  borderWidth,
  characterImg
} = canvasOptions
import CanvasBase from "@/canvas/base"

class CharacterCanvas extends CanvasBase {
  /**
   * 构造器
   *
   * @param {Document} canvas 画布对象
   * @param {Array} mapData 地图数据
   * @param {Boolean} needCharacter 是否需要显示角色
   */
  constructor(canvas, mapData, needCharacter = true) {
    super(mapData, canvas)
    if (needCharacter) {
      // 初始化角色方向
      this.direction = "down"
      // 随机生产角色位置到某个开放草地
      this.generateCharacter()
    }
  }

  /**
   * 随机生成角色（一般只在构造器自动调用）
   */
  generateCharacter = () => {
    const birthPlace = []
    for (let row = 0; row < canvasRow; row++) {
      for (let col = 0; col < canvasCol; col++) {
        if (this.mapData[row][col] === "grass" && this.isReachable(col, row)) {
          birthPlace.push({
            col,
            row
          })
        }
      }
    }
    const position = birthPlace[Math.floor(Math.random() * birthPlace.length)]
    if (position) {
      this.drawCharacter(position.col, position.row)
    } else {
      console.log("Generate character fail")
    }
  }

  /**
   * 绘制角色
   *
   * @param {Number} col 列序号
   * @param {Number} row 行序号
   */
  drawCharacter(col, row) {
    if (this.isOutOfBoundary(col, row)) return
    const ctx = this.canvas.getContext("2d")
    // 清除上次角色所在位置（如果有的话）
    if (this.character) {
      ctx.clearRect(
        this.character.col * blockSize,
        this.character.row * blockSize,
        blockSize,
        blockSize
      )
    }
    // 绘制
    // ctx.beginPath()
    // ctx.fillStyle = "#fff"
    // // (x, y, r, startAngle, endAngle)
    // ctx.arc(
    //   col * blockSize + blockSize / 2,
    //   row * blockSize + blockSize / 2,
    //   blockSize / 4,
    //   0,
    //   2 * Math.PI
    // )
    // ctx.fill()

    ctx.drawImage(
      characterImg[this.direction],
      col * blockSize,
      row * blockSize,
      blockSize,
      blockSize
    )
    this.character = { col, row }
  }

  /**
   * 获取角色当前位置
   */
  getCharacter() {
    return this.character
  }

  /**
   * 绘制选框
   *
   * @param {Number} col 列序号
   * @param {Number} row 行序号
   */
  drawSelectedBlock = (col, row) => {
    if (this.isOutOfBoundary(col, row)) return
    const ctx = this.canvas.getContext("2d")
    // 清除上次选框（如果有的话）
    if (this.selected) {
      ctx.clearRect(
        this.selected.col * blockSize,
        this.selected.row * blockSize,
        blockSize,
        blockSize
      )
      // 如果上次选框与角色重叠则重新绘制被清除的角色
      if (
        this.character &&
        this.selected.col === this.character.col &&
        this.selected.row === this.character.row
      )
        this.drawCharacter(this.character.col, this.character.row)
    }
    // 绘制
    ctx.lineWidth = borderWidth
    ctx.strokeStyle = "#fff"
    ctx.strokeRect(
      col * blockSize + borderWidth,
      row * blockSize + borderWidth,
      blockSize - 2 * borderWidth,
      blockSize - 2 * borderWidth
    )
    this.selected = { col, row }
  }

  /**
   * 获取当前选中方块
   */
  getSelected() {
    return this.selected
  }

  /**
   * 移动
   *
   * @param {Array} path 移动路径
   */
  move = path => {
    // 步数从1开始，对应路径队列下标
    let step = 1
    const interval = setInterval(() => {
      this.judgeDirection(path[step - 1], path[step])
      // 绘制角色
      this.drawCharacter(path[step].col, path[step].row)
      step += 1
      // 移动完成初始化
      if (step >= path.length) {
        $eventBus.$emit("moving", {
          isMoving: false,
          characterPosition: this.getCharacter()
        })
        clearInterval(interval)
      } else {
        $eventBus.$emit("moving", {
          isMoving: true,
          characterPosition: this.getCharacter()
        })
      }
    }, 150)
  }

  /**
   * 判断角色方向
   *
   * @param {Object} last 上一步位置
   * @param {Object} current 当前位置
   */
  judgeDirection(last, current) {
    if (last.col > current.col) {
      this.direction = "left"
    } else if (last.col < current.col) {
      this.direction = "right"
    } else if (last.row > current.row) {
      this.direction = "up"
    } else if (last.row < current.row) {
      this.direction = "down"
    }
  }
}

export default CharacterCanvas
