<script lang="ts">
import AnswerInput from '../../components/AnswerInput.vue'
export default {
  components: {
    AnswerInput
  },
  onShareAppMessage () {
    return {}
  }
}
</script>

<script setup lang="ts">
import { useMainStore } from '../../store/index'

const mainStore = useMainStore()
</script>

<template>
  <view class="content">
    <AnswerInput />
    <view>{{mainStore.$state.answerInput}}</view>
  </view>
</template>

<style lang="scss" scoped>
.content {
  padding: 16rpx;

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
