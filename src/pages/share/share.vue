<script lang="ts">
/// <reference types="@dcloudio/types" />

import { computed, defineComponent, ref } from 'vue'
import GameButton from '../../components/GameButton.vue'
import { isFourCharWord, isFourCharWordInDict } from '../../utils/utils'

const answerInput = ref('')
const hintInput = ref('')

export default defineComponent({
  components: {
    GameButton
  },
  setup () {
    const share = (word: string, hint: string) => {
      if (!isFourCharWord(word)) {
        throw new Error('请输入 4 个字的词语')
      }

      if (hint.length !== 1) {
        throw new Error('请输入 1 个汉字提示')
      }

      const index = word.indexOf(hint)

      if (index === -1) {
        throw new Error('提示的汉字不在该四字词语中')
      }

      return {
        answerQuery: word + index,
        isInDict: isFourCharWordInDict(word)
      }
    }

    const validateShare = computed(() => {
      let result
      try {
        result = share(answerInput.value, hintInput.value)
      } catch (err: any) {
        return {
          canShare: false,
          message: err.message
        }
      }

      if (!result.isInDict) {
        return {
          canShare: true,
          message: '该词不是常用的词语，不建议用这个词出题'
        }
      }

      return {
        canShare: true,
        message: ''
      }
    })

    const back = () => {
      uni.navigateBack({
        delta: 1
      })
    }

    return {
      answerInput,
      hintInput,
      validateShare,
      back
    }
  },
  onShareAppMessage (res: any) {
    if (res.from === 'button') {
      const path = `/pages/index/index?answer=${answerInput.value + answerInput.value.indexOf(hintInput.value)}`
      return {
        title: '好友出题给你猜一猜',
        path: path,
        imageUrl: '/static/mpcode_344.jpg'
      }
    } else {
      return {
        title: '汉兜猜词',
        path: '/pages/index/index'
      }
    }
  },
  onShareTimeline () {
    return {
      title: '汉兜猜词'
    }
  }
})
</script>

<template>
  <view class="share-page">
    <view class="content">
      <view class="title">给好友出题</view>
  
      <input
        class="answer"
        type="text"
        placeholder="输入要分享的四字词语"
        v-model="answerInput" />
      
      <input
        class="answer"
        type="text"
        placeholder="输入要提示的汉字"
        v-model="hintInput" />
      
      <view class="tip">{{validateShare.message}}</view>
  
      <view class="btngrp">
        <GameButton class="btn" :disabled="!validateShare.canShare" open-type="share">分享好友</GameButton>
        <GameButton class="btn" @click="back">返回游戏</GameButton>
      </view>
    </view>
    <view class="ad-container">
      <ad unit-id="adunit-78a2217bef3d5c0f"></ad>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@use '../../config';

.share-page {
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
  
    .answer {
      height: 68rpx;
      line-height: 68rpx;
      border: 6rpx solid config.$theme-border;
      padding: 8rpx 16rpx;
      margin: 16rpx;
    }
  
    .tip {
      color: config.$theme-orange;
      font-size: 28rpx;
      line-height: 28rpx;
      width: 100%;
      text-align: center;
      height: 28rpx;
      margin-top: 16rpx;
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
