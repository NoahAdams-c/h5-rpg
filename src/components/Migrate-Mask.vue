<!--
 * @Description: 过图遮罩
 * @Author: chenchen
 * @Date: 2020-08-08 21:50:33
 * @LastEditors: chenchen
 * @LastEditTime: 2020-08-09 02:16:33
 -->
<template>
  <div class="c-migrate-mask bg-be-dark "
       :style="{width:
       $canvasOption.canvasCol
       *
       $canvasOption.blockSize+'px',
       height:$canvasOption.canvasRow
       *
       $canvasOption.blockSize+'px'}">
    <div v-if="isLoadingShow"
         class="c-migrate-mask__loading">
      <div class="c-migrate-mask__loading--icon do-flip"></div>
      <div class="c-migrate-mask__loading--tip">加载中 ...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MigrateMask",

  data() {
    return {
      isLoadingShow: false
    }
  },

  mounted() {
    setTimeout(() => {
      this.isLoadingShow = true
      setTimeout(() => {
        this.$emit("close")
      }, 1500)
    }, 1000)
  }
}
</script>

<style scoped lang="scss">
.c-migrate-mask {
  z-index: 998;
  display: flex;
  align-items: center;
  &__loading {
    flex: 1;
    &--tip {
      font-size: 24px;
      color: white;
      text-align: center;
    }
    &--icon {
      width: 60px;
      height: 60px;
      background-color: #ffd700;
      margin: 100px auto;
    }
  }
}
</style>