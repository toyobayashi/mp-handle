<script lang="ts" setup>
import { ref, computed } from 'vue'
import { STATUS_BAR_HEIGHT } from '../utils/constants'

let currentOptions = ref<UniApp.ShowModalOptions | undefined>(undefined)

const wrapStyle = ref({
  top: `-${Math.floor(STATUS_BAR_HEIGHT / 2)}px`
})

const onAdError = (e: any) => {
  console.log(e)
}

const onAdLoad = () => {
  console.log('load')
}

const title = computed(() => {
  return currentOptions.value?.title ?? ''
})

const content = computed(() => {
  return currentOptions.value?.content ?? ''
})

const confirmText = computed(() => {
  return currentOptions.value?.confirmText ?? '确定'
})

const cancelText = computed(() => {
  return currentOptions.value?.cancelText ?? '取消'
})

const showCancel = computed(() => {
  if (!currentOptions.value) {
    return false
  }
  if (currentOptions.value.showCancel === false) {
    return false
  }
  return Boolean(currentOptions.value.cancelText)
})

const show = computed(() => {
  return Boolean(currentOptions.value)
})

const showModal = (options: UniApp.ShowModalOptions) => {
  currentOptions.value = options
}

const onClickCancel = () => {
  const success = currentOptions.value?.success
  const complete = currentOptions.value?.complete
  currentOptions.value = undefined
  if (typeof success === 'function') {
    success({ cancel: true, confirm: false })
  }
  if (typeof complete === 'function') {
    complete({})
  }
}
const onClickConfirm = () => {
  const success = currentOptions.value?.success
  const complete = currentOptions.value?.complete
  currentOptions.value = undefined
  if (typeof success === 'function') {
    success({ cancel: false, confirm: true })
  }
  if (typeof complete === 'function') {
    complete({})
  }
}

defineExpose({
  showModal: showModal
})
</script>


<template>
<view class="ad-dialog" v-if="show">
  <view class="wrap" :style="wrapStyle">
    <view class="ad-container">
      <custom-ad :unit-id="'adunit-e84d9fb0b8a0a887'" @load="onAdLoad" @error="onAdError"></custom-ad>
    </view>
    <view class="content">
      <view class="title">{{title}}</view>
      <view class="body">{{content}}</view>
      <view class="btn-wrap">
        <view class="btn cancel" v-if="showCancel" @click="onClickCancel">{{cancelText}}</view>
        <view class="btn confirm" @click="onClickConfirm">{{confirmText}}</view>
      </view>
    </view>
  </view>
</view>
</template>

<style lang="scss" scoped>
@use "../config";

.ad-dialog {
  width: 100%;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 9999;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .wrap {
    width: 90%;
    position: relative;

    .ad-container {
      margin-bottom: 32rpx;
    }

    .content {
      background-color: #fff;
      border-radius: 16rpx;
      overflow: hidden;
  
      .title {
        font-size: 32rpx;
        color: #000;
        text-align: center;
        margin-top: 60rpx;
        font-weight: bold;
      }
      .body {
        font-size: 32rpx;
        color: #666;
        text-align: center;
        margin: 40rpx 32rpx 60rpx 32rpx;
      }
  
      .btn-wrap {
        display: flex;
        height: 100rpx;
        justify-items: stretch;
  
        .btn {
          flex: 1;
          border-top: 1rpx solid #ddd;
          background-color: transparent;
          font-weight: bold;
          border-radius: 0;
          outline: none;
          font-size: 36rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          &:active {
            background-color: #eee;
          }
          &.cancel {
            color: #000;
            border-right: 1rpx solid #ddd;
          }
          &.confirm {
            color: config.$theme-color;
          }
        }
      }
    }
  }
}

</style>
