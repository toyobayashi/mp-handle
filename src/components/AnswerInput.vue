<script setup lang="ts">
import { computed } from 'vue'
import { useMainStore } from '../store/index'
import { answerList } from '../composables/storage'
import { MAX_TRIES } from '../utils/constants'
import GameButton from './GameButton.vue'
// import { onReady } from '@dcloudio/uni-app'

const mainStore = useMainStore()

const answerInput = computed(() => mainStore.$state.answerInput)

const _answerRegEx = /^[\u4e00-\u9fa5]{4}$/

const btnDisabled = computed(() => {
  return !_answerRegEx.test(mainStore.$state.answerInput)
})

const setAnswerInput = (e: Event) => {
  mainStore.setAnswerInput((e.target as HTMLInputElement).value)
}

const restart = () => {
  answerList.value = []
  mainStore.resetAnswer()
}

const go = () => {
  answerList.value.unshift(answerInput.value)
  mainStore.setAnswerInput('')
  if (answerList.value[0] === mainStore.answerWord) {
    uni.showModal({
      title: '提示',
      content: '恭喜你答对了！',
      confirmText: '再猜一次',
      cancelText: '确定',
      success: (res) => {
        if (res.confirm) {
          restart()
        }
      }
    })
    return
  }

  if (answerList.value.length >= MAX_TRIES) {
    uni.showModal({
      title: '提示',
      content: `很遗憾没答对，答案是${mainStore.answerWord}`,
      confirmText: '再猜一次',
      cancelText: '确定',
      success: (res) => {
        if (res.confirm) {
          restart()
        }
      }
    })
  }
}

const navigateToHelp = () => {
  uni.navigateTo({
    url: '/pages/help/help'
  })
}
</script>

<template>

<view class="answer-input">
  <view class="btngrp">
    <view class="icon help" @click="navigateToHelp"></view>
    <view class="icon tip"></view>
  </view>
  <input
    class="answer"
    type="text"
    placeholder="输入四字词语..."
    :value="answerInput"
    @input="setAnswerInput" />
  <GameButton v-if="!mainStore.gameOver" class="confirm" :disabled="btnDisabled" @click="go">确定</GameButton>
  <GameButton v-else class="confirm" @click="restart">再猜一次</GameButton>
</view>
</template>

<style lang="scss" scoped>
@use "../config";

.answer-input {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .btngrp {
    display: flex;
    justify-content: center;
    .icon {
      width: 56rpx;
      height: 56rpx;
      background-color: #69717D;
      margin-right: 16rpx;
    }
    .help {
      --help-icon: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1.2em' height='1.2em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 32 32'%3E%3Cpath d='M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12z' fill='currentColor'/%3E%3Ccircle cx='16' cy='23.5' r='1.5' fill='currentColor'/%3E%3Cpath d='M17 8h-1.5a4.49 4.49 0 0 0-4.5 4.5v.5h2v-.5a2.5 2.5 0 0 1 2.5-2.5H17a2.5 2.5 0 0 1 0 5h-2v4.5h2V17a4.5 4.5 0 0 0 0-9z' fill='currentColor'/%3E%3C/svg%3E");
      mask: var(--help-icon) no-repeat;
      mask-size: 100% 100%;
      -webkit-mask: var(--help-icon) no-repeat;
      -webkit-mask-size: 100% 100%;
    }
    .tip {
      --tip-icon: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1.2em' height='1.2em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 32 32'%3E%3Cpath d='M11 24h10v2H11z' fill='currentColor'/%3E%3Cpath d='M13 28h6v2h-6z' fill='currentColor'/%3E%3Cpath d='M16 2A10 10 0 0 0 6 12a9.19 9.19 0 0 0 3.46 7.62c1 .93 1.54 1.46 1.54 2.38h2c0-1.84-1.11-2.87-2.19-3.86A7.2 7.2 0 0 1 8 12a8 8 0 0 1 16 0a7.2 7.2 0 0 1-2.82 6.14c-1.07 1-2.18 2-2.18 3.86h2c0-.92.53-1.45 1.54-2.39A9.18 9.18 0 0 0 26 12A10 10 0 0 0 16 2z' fill='currentColor'/%3E%3C/svg%3E");
      mask: var(--tip-icon) no-repeat;
      mask-size: 100% 100%;
      -webkit-mask: var(--tip-icon) no-repeat;
      -webkit-mask-size: 100% 100%;
    }
  }
  .answer {
    height: 68rpx;
    line-height: 68rpx;
    border: 4rpx solid config.$theme-border;
    flex: 1;
    padding: 8rpx 16rpx;
  }
  .confirm {
    margin-left: 16rpx;
  }
}
</style>
