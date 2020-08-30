/**
 * @Description: config
 * @Author: chenchen
 * @Date: 2020-04-08 17:11:50
 * @LastEditors: chenchen
 * @LastEditTime: 2020-08-08 02:16:02
 */
// 角色场景图片资源
const { scene, character } = require("@/resource")
// 地图尺寸
const mapSize = 20
// 地图资源加载器
let mapLoader = null
if (mapSize === 20) {
  mapLoader = require.context("@p/maps/20x20", true, /\.json/)
} else if (mapSize === 15) {
  mapLoader = require.context("@p/maps/15x15", true, /\.json/)
}
const mapPaths = mapLoader.keys()
let mapResources = {}
mapPaths.forEach(item => {
  const map = mapLoader(item)
  const mapKeys = item.replace("./", "").replace(".json", "")
  mapResources[mapKeys] = map
})

const tree = new Image()
tree.src = scene.treeSrc
const grass = new Image()
grass.src = scene.grassSrc
const road = new Image()
road.src = scene.roadSrc
const house = new Image()
house.src = scene.houseSrc
const door = new Image()
door.src = scene.doorSrc
const water = new Image()
water.src = scene.waterSrc
const none = null
const link = null

const characterDown = new Image()
characterDown.src = character.characterDownSrc
const characterUp = new Image()
characterUp.src = character.characterUpSrc
const characterLeft = new Image()
characterLeft.src = character.characterLeftSrc
const characterRight = new Image()
characterRight.src = character.characterRightSrc
/**
 * 默认画布中的每个块都为正方形
 */
export default {
  // 出生地图
  birthMap: mapResources["birth_land"],
  // 画布行数
  canvasRow: mapSize,
  // 画布列数
  canvasCol: mapSize,
  // 块大小(边长像素值)
  blockSize: 40,
  // 选框宽度
  borderWidth: 2,
  // 方块属性-颜色映射
  // attrMap: {
  //   tree: "#006400",
  //   grass: "#32CD32",
  //   road: "#BDB76B",
  //   house: "#FF6347",
  //   door: "#000",
  //   water: "#40E0D0"
  // },
  // 方块属性-图片映射
  attrMap: {
    tree,
    grass,
    road,
    house,
    door,
    water,
    none,
    link
  },
  // 角色图片
  characterImg: {
    down: characterDown,
    up: characterUp,
    left: characterLeft,
    right: characterRight
  },
  // 无法到达的方块属性
  unreachableAttr: ["tree", "house", "water", "none"],
  // 包含链接的方块属性
  linkAttr: ["house", "door", "link"],
  // 地图资源
  mapResources
}
