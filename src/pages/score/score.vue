<script lang="ts">
/// <reference types="@dcloudio/types" />

export default {
  onShareAppMessage () {
    return {
      title: '汉兜猜词',
      path: '/pages/index/index'
    }
  },
  onShareTimeline () {
    return {
      title: '汉兜猜词'
    }
  }
}
</script>

<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useMainStore } from '../../store/index'
import GameButton from '../../components/GameButton.vue'
import Calender from '../../components/Calender.vue'
import { tries } from '../../utils/try'

const mainStore = useMainStore()

const clear = () => {
  tries.clear()
  results.value = []
  winTimes.value = 0
  winTimesWithNoHint.value = 0
  uni.showToast({
    title: '清除成功',
    icon: 'none'
  })
}

const back = () => {
  uni.navigateBack({
    delta: 1
  })
}

const formatTime = (ms: number): string => {
  if (ms <= 0) {
    return '0秒'
  }
  const h = Math.floor(ms / 3600)
  const m = Math.floor(ms / 60) % 60
  const s = Math.floor(ms) % 60
  return `${h > 0 ? h + '小时' : ''}${m > 0 ? m + '分': ''}${s}秒`
}

const results = shallowRef(tries.filter(t => 'end' in t))

const gameTimes = computed(() => {
  return results.value.length
})

const winTimes = shallowRef(tries.filter(t => t.passed).length)

const winTimesWithNoHint = shallowRef(tries.filter(t => t.passed && !t.hint).length)

const winRate = computed(() => {
  if (gameTimes.value === 0) return 0
  return Math.floor(100 * (winTimes.value / gameTimes.value))
})

const avrTries = computed(() => {
  if (results.value.length === 0) return 0
  return Math.floor(results.value.map(t => t.tries).reduce((p, c) => {
    return p + c
  }, 0) / results.value.length * 10) / 10
})

const avrTime = computed(() => {
  if (results.value.length === 0) return 0
  const s = Math.floor(results.value.map(t => t.end! - t.start).reduce((p, c) => {
    return p + c
  }, 0) / results.value.length / 1000)
  return formatTime(s)
})
</script>

<template>
  <view class="score-page">
    <view class="ad-container" v-if="mainStore.enableAd">
      <custom-ad unit-id="adunit-b93ca0c479d68392"></custom-ad>
    </view>
    <view class="content">
      <view class="title">记分板</view>

      <view class="tip">注意：本小程序无后端服务，所有数据都是本地存储的，这意味着如果清除微信数据、重装微信或在新设备上登录，这些记录将会丢失。</view>
  
      <view class="line">
        <text class="label">游戏次数</text>
        <text class="value">{{gameTimes}}</text>
      </view>
      <view class="line">
        <text class="label">获胜次数</text>
        <text class="value">{{winTimes}}</text>
      </view>
      <view class="line">
        <text class="label">无提示获胜次数</text>
        <text class="value">{{winTimesWithNoHint}}</text>
      </view>
      <view class="line">
        <text class="label">获胜几率</text>
        <text class="value">{{winRate}}%</text>
      </view>
      <view class="line">
        <text class="label">平均尝试次数</text>
        <text class="value">{{avrTries}}</text>
      </view>
      <view class="line">
        <text class="label">平均用时</text>
        <text class="value">{{avrTime}}</text>
      </view>
  
      <view class="btngrp">
        <GameButton class="btn" @click="clear">清空记录</GameButton>
        <GameButton class="btn" @click="back">返回游戏</GameButton>
      </view>

      <view class="title">获胜打卡</view>
      <Calender />
    </view>
    <view class="ad-container" v-if="mainStore.enableAd">
      <ad unit-id="adunit-fe7e15cce73e6dd3"></ad>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@use '../../config';

.score-page {
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: stretch;

  .content {
    padding: 16rpx;
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    flex: 1;
    .title {
      font-size: 40rpx;
      font-weight: bold;
      margin-bottom: 16rpx;
    }
    .tip {
      color: rgb(55,65,81);
      opacity: 0.5;
      font-size: 28rpx;
      margin: 32rpx;
    }
    .line {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 16rpx 0;
      width: 100%;
  
      .label {
        flex: 4;
        text-align: right;
        color: rgb(55,65,81);
        opacity: 0.5;
      }
      .value {
        flex: 3;
        margin-left: 16rpx;
      }
    }
  
    .btngrp {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 32rpx 0;
      .btn {
        margin: 0 16rpx;
      }
    }
  }
}
</style>
