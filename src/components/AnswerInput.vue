<script setup lang="ts">
import { computed } from 'vue'
import { useMainStore } from '../store/index'
import { answerList } from '../composables/storage'
import { MAX_TRIES } from '../utils/constants'
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
</script>

<template>

<view class="answer-input">
  <input
    class="answer"
    type="text"
    placeholder="输入四字词语..."
    :value="answerInput"
    @input="setAnswerInput" />
  <button v-if="!mainStore.gameOver" :class="{ disabled: btnDisabled }" class="confirm" :disabled="btnDisabled" @click="go">确定</button>
  <button v-else class="confirm" @click="restart">再猜一次</button>
</view>
</template>

<style lang="scss" scoped>
@use "../config";

.answer-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .answer {
    height: 68rpx;
    line-height: 68rpx;
    border: 4rpx solid #F0F1F2;
    flex: 1;
    padding: 8rpx 16rpx;
  }
  .confirm {
    background-color: config.$theme-color;
    color: #fff;
    border-radius: 8rpx;
    height: 90rpx;
    line-height: 90rpx;
    font-size: 32rpx;
    opacity: 0.9;
    width: 200rpx;
    margin-left: 16rpx;

    &.disabled {
      background-color: rgb(75,85,99);
      opacity: 0.5;
      &:active {
        opacity: 0.5;
      }
    }

    &:active {
      opacity: 1;
    }
  }
}
</style>
