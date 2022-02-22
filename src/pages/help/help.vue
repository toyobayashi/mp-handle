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
import WordLine from '../../components/WordLine.vue'
import GameButton from '../../components/GameButton.vue'

const backHome = () => {
  uni.navigateBack({
    delta: 1
  })
}
</script>

<template>
  <view class="help">
    <view class="title">汉兜猜词</view>
    <view class="subtitle">汉字 Wordle 小程序，当前版本 v1.0.0</view>
    <view class="subtitle2">游戏规则</view>
    <view class="p">你有十次的机会猜一个 <text class="ok">四字词语</text></view>
    <view class="p">每次猜测后，汉字与拼音的颜色将会标识其与正确答案的区别。</view>
    <view class="p">
      <WordLine word="班门弄斧" result answer="和门和和" />
    </view>
    <view class="p">第二个字 <text class="ok">门</text> 为青色，表示其出现在答案中且在正确的位置。</view>
    <view class="p">
      <WordLine word="水落石出" result answer="一一一水" />
    </view>
    <view class="p">第一个字 <text class="mis">水</text> 为橙色，表示其出现在答案中，但并不是第一个字。</view>
    <view class="p">
      <WordLine word="巧夺天工" result answer="桥它拖拔" />
    </view>
    <view class="p">每个格子的 <text class="str">汉字、声母、韵母、声调</text> 都会独立进行颜色的指示。 例如，第一个 <text class="err">巧</text> 汉字为灰色，而其 声母 与 韵母 均为青色，代表该位置的正确答案为其同音字但非 <text class="err">巧</text> 字本身。 同理，第二个字中韵母 <text class="mis">uo</text> 为橙色，代表其韵母出现在四个字之中，但非位居第二。以此类推。</view>
    <view class="p">
      <WordLine word="武运昌隆" result answer="武运昌隆" />
    </view>
    <view class="p">当四个格子都为青色时，你便赢得了游戏！</view>
    <GameButton class="backhome" @click="backHome">返回游戏</GameButton>
  </view>
</template>

<style lang="scss" scoped>
@use "../../config";

.help {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 16rpx 60rpx 16rpx;

  .title {
    font-size: 40rpx;
    font-weight: bold;
    margin-bottom: 16rpx;
  }

  .subtitle {
    font-size: 28rpx;
    opacity: 0.5;
    margin-bottom: 16rpx;
  }

  .subtitle2 {
    font-size: 36rpx;
    margin-bottom: 8rpx;
    font-weight: bold;
  }

  .p {
    margin-bottom: 8rpx;
    .mis {
      color: config.$theme-orange;
      font-weight: bold;
    }
    .ok {
      color: config.$theme-color;
      font-weight: bold;
    }
    .str {
      font-weight: bold;
    }
    .err {
      font-weight: bold;
      @include config.unmatched;
    }
  }

  .backhome {
    margin-top: 16rpx;
  }
}
</style>
