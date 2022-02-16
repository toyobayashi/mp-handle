<script lang="ts">
const aaa = 111
export default {
  onShareAppMessage () {
    return {}
  }
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { useMainStore } from '../../store/index'
const title = ref('Hello111')
console.log(aaa)
const mainStore = useMainStore()
console.log(mainStore)
</script>

<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area" @click="mainStore.add()">
      <text class="title">{{ mainStore.a }}</text>
      <text class="title">{{ mainStore.aa }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
  }

  .text-area {
    display: flex;
    justify-content: center;
  }

  .title {
    font-size: 36rpx;
    color: $uni-color-success;
  }
}
</style>
