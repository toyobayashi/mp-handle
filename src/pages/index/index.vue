<script lang="ts">
export default {
  onShareAppMessage () {
    return {
      title: '汉兜猜词',
      path: '/pages/index/index'
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

const mainStore = useMainStore()

onLoad(() => {
  if (answerList.value.length >= MAX_TRIES) {
    answerList.value = []
  }
})

</script>

<template>
  <view class="content">
    <view>
      <AnswerInput />
      <WordLine v-if="!mainStore.gameOver" :word="mainStore.$state.answerInput" :result="false" />
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
  justify-content: center;
  align-items: stretch;

  .the-answer {
    display: block;
    text-align: center;
    font-size: 32rpx;
    color: config.$theme-matched;
  }

  .answers {
    flex: 1;
    overflow: auto;
  }
}
</style>
