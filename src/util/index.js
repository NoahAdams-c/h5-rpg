/**
 * @Description:工具方法集
 * @Author: chenchen
 * @Date: 2020-08-07 12:38:07
 * @LastEditors: chenchen
 * @LastEditTime: 2020-08-07 13:04:04
 */
export default {
  /**
   * 深拷贝（不支持正则对象）
   * @param {Object} obj 任意对象
   */
  deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}
