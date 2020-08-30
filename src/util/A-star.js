/**
 * @Description: A*算法，对于当前项目只有可通过与不可通过，且相邻之间遍历成本均为1
 * @Author: chenchen
 * @Date: 2020-04-09 16:08:50
 * @LastEditors: chenchen
 * @LastEditTime: 2020-04-11 21:31:51
 */
import canvasOption from "@/config"
const { canvasRow, canvasCol, unreachableAttr } = canvasOption

import CanvasBase from "@/canvas/base"

export default {
  count: 0,
  // 地图数据
  mapData: null,
  // 起始点
  origin: null,
  // 目标点
  destination: null,
  // 待处理队列
  pendingList: null,
  // 已处理队列
  handledList: null,
  // 路径
  path: null,
  /**
   * 初始化
   */
  init(map, origin, destination) {
    this.mapData = map
    this.origin = origin
    this.destination = destination
    this.pendingList = []
    this.handledList = []
    this.path = []
    this.count = 0
    this.canvasBase = new CanvasBase(map)
  },
  /**
   * 计算距离，采用曼哈顿距离
   *
   * @param {Object} origin 起始点
   * @param {Object} destination 目标点
   */
  getDistance(origin, destination) {
    // console.log("distance:\n")
    // console.log(
    //   `row:abs(o:${origin.row}-d:${destination.row}=${Math.abs(
    //     origin.row - destination.row
    //   )})\n`
    // )
    // console.log(
    //   `col:abs(o:${origin.col}-d:${destination.col}=${Math.abs(
    //     origin.col - destination.col
    //   )})\n`
    // )
    return (
      Math.abs(origin.row - destination.row) +
      Math.abs(origin.col - destination.col)
    )
  },
  /**
   * 已处理队列入队
   *
   * @param {Object} nodeOption 节点处理对象（包含节点位置、花费、父节点位置）
   */
  pushHandled(nodeOption) {
    this.handledList.push(nodeOption)
    this.pendingList = this.pendingList.filter(item => {
      return !(
        item.node.col === nodeOption.node.col &&
        item.node.row === nodeOption.node.row
      )
    })
  },
  /**
   * 判断是否存在于已处理队列中,如果有则返回
   *
   * @param {Object} node 节点
   */
  isHandled(node) {
    let result = null
    for (let item of this.handledList) {
      if (item.node.col === node.col && item.node.row === node.row) {
        result = item
        break
      }
    }
    return result
  },
  /**
   * 待处理队列入队
   * @param {Object} node 节点
   * @param {Object} currentOption 当前节点处理对象（包含节点位置、花费、父节点位置）
   */
  pushPending(node, currentOption) {
    // 先判断该点是否可到达
    if (this.canvasBase.isReachable(node.col, node.row)) {
      const pendingNode = this.isPending(node)
      // 再判断是否已存在于待处理队列
      // 1、如果存在则将其经由之前父节点所产生的花费与经由当前节点所产生的花费进行比较，如果前者大于后者则将其父节点替换为当前节点
      // 2、如果不存在则直接入队
      if (
        (pendingNode && pendingNode.cost > currentOption.cost + 1) ||
        !pendingNode
      ) {
        this.pendingList.push({
          node: node,
          cost: currentOption.cost + 1,
          parent: currentOption.node
        })
      }
    }
  },
  /**
   * 判断是否存在于待处理队列中,如果有则返回
   *
   * @param {Object} node 节点
   */
  isPending(node) {
    let result = null
    for (let item of this.pendingList) {
      if (item.node.col === node.col && item.node.row === node.row) {
        result = item
        break
      }
    }
    return result
  },
  /**
   * 判断点是否可到达
   *
   * @param {Object} node
   */
  isReachable(node) {
    const { row, col } = node
    // 地图外不可达
    if (row < 0 || row >= canvasRow || col < 0 || col >= canvasCol) {
      return false
    }
    // 不可达点
    const nodeAttr = this.mapData[row][col]
    if (unreachableAttr.includes(nodeAttr)) {
      return false
    }
    // 已处理点不可达
    if (this.isHandled(node)) {
      return false
    }
    return true
  },
  /**
   * 从待处理队列找到花费最小的（到起点的距离与到终点的距离之和）
   */
  findCostLeast() {
    // 预定义花费为最大
    let cost = canvasCol * canvasRow
    let node = null
    for (let item of this.pendingList) {
      // 计算花费
      const currentCost =
        item.cost + this.getDistance(item.node, this.destination)
      // console.log(
      //   JSON.stringify(item.node) + " cost:",
      //   item.cost +
      //     "+" +
      //     this.getDistance(item.node, this.destination) +
      //     "=" +
      //     currentCost
      // )
      if (currentCost < cost) {
        cost = currentCost
        node = item
      }
    }
    return node
  },
  /**
   * 寻路
   *
   * @param {Object} current 当前点
   */
  findPath(current) {
    // console.log(`********* ${this.count} **********`)
    if (++this.count > 999) {
      return false
    }
    // 把当前点标记已处理
    this.pushHandled(current)
    // console.log("handledList:", JSON.stringify(this.handledList))
    if (this.isHandled(this.destination)) {
      // 如果目标点已处理说明已找到，返回
      return true
    }
    // 找到四个方向可到达的点放入待处理队列
    const { row, col } = current.node
    const leftNode = { row, col: col - 1 }
    const rightNode = { row, col: col + 1 }
    const upNode = { row: row - 1, col }
    const downNode = { row: row + 1, col }
    this.pushPending(leftNode, current)
    this.pushPending(rightNode, current)
    this.pushPending(upNode, current)
    this.pushPending(downNode, current)
    if (!this.pendingList.length) {
      // 如果待处理列表为空了则返回
      return false
    }
    // console.log("pendingList:", JSON.stringify(this.pendingList))
    return this.findPath(this.findCostLeast())
  },
  /**
   * 获得最短路径
   */
  getShortestPath() {
    // console.log(this.handledList)
    this.path.push(this.destination)
    const len = this.handledList.length
    for (let i = 0; i < len; i++) {
      const handledNode = this.isHandled(this.path[0])
      this.path.unshift(handledNode.parent)
      if (JSON.stringify(handledNode.parent) === JSON.stringify(this.origin)) {
        break
      }
    }
  },

  start() {
    const result = this.findPath({ node: this.origin, cost: 0, parent: {} })
    if (result) {
      this.getShortestPath()
      console.log(this.path)
    }
    return JSON.parse(JSON.stringify(this.path))
    //console.log("Finally:", JSON.stringify(this.handledList))
  }
}
