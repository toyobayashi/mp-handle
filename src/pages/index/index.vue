<script lang="ts">
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
import { useMainStore } from '../../store/index'
import AnswerInput from '../../components/AnswerInput.vue'
import WordLine from '../../components/WordLine.vue'
import { answerList } from '../../composables/storage'
import { onLoad } from '@dcloudio/uni-app'
import { MAX_TRIES } from '../../utils/constants'
import { computed } from 'vue'

const mainStore = useMainStore()

onLoad(() => {
  if (answerList.value.length >= MAX_TRIES) {
    answerList.value = []
  }
  console.log(mainStore.answerWord)
})

const leftChance = computed(() => {
  return MAX_TRIES - answerList.value.length
})

const showAnswer = () => {
  uni.showModal({
    title: '提示',
    content: '确认要展示答案吗？',
    confirmText: '确定',
    cancelText: '再想想',
    success: (res) => {
      if (res.confirm) {
        answerList.value.unshift(mainStore.answerWord)
      }
    }
  })
}

</script>

<template>
  <view class="content">
    <view>
      <AnswerInput />
      <template v-if="!mainStore.gameOver">
        <view class="tipline">
          <text class="left-chance">剩余 {{leftChance}} 次机会</text>
          <text class="show-answer" @click="showAnswer">展示答案</text>
        </view>
        <WordLine :word="mainStore.$state.answerInput" :result="false" />
      </template>
      <text class="the-answer" v-else>正确答案：{{mainStore.answerWord}}</text>
    </view>
    <view class="answers">
      <WordLine v-for="(line, index) in answerList" :key="line + index" :word="line" result />
    </view>
  </view>
</template>

<style lang="scss" scoped>
@use '../../config';

.content {
  padding: 16rpx;
  display: flex;
  height: calc(100vh - 32rpx);
  flex-direction: column;
  align-items: stretch;

  .the-answer {
    display: block;
    text-align: center;
    font-size: 32rpx;
    height: 60rpx;
    line-height: 60rpx;
    margin-top: 8rpx;
    color: config.$theme-matched;
  }

  .answers {
    flex: 1;
    overflow: auto;
  }

  .tipline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8rpx;

    .left-chance {
      opacity: 0.5;
      color: rgb(55,65,81);
      height: 60rpx;
      line-height: 60rpx;
    }
    .show-answer {
      text-decoration: underline;
      color: config.$theme-matched;
      height: 60rpx;
      line-height: 60rpx;
    }
  }
}
</style>
