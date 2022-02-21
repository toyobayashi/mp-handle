<script lang="ts">
export default {
  onShareAppMessage () {
    return {}
  }
}
</script>

<script setup lang="ts">
import { useMainStore } from '../../store/index'
import AnswerInput from '../../components/AnswerInput.vue'
import WordLine from '../../components/WordLine.vue'
import { answerList } from '../../composables/storage'

const mainStore = useMainStore()
</script>

<template>
  <view class="content">
    <view>
      <AnswerInput />
      <WordLine :word="mainStore.$state.answerInput" :result="false" />
    </view>
    <view class="answers">
      <WordLine v-for="(line, index) in answerList" :key="line + index" :word="line" result />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.content {
  padding: 16rpx;
  display: flex;
  height: calc(100vh - 32rpx);
  flex-direction: column;
  justify-content: center;
  align-items: stretch;

  .answers {
    flex: 1;
    overflow: auto;
  }
}
</style>
