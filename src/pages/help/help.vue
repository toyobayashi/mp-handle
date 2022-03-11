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
import { ref } from 'vue'
import { useMainStore } from '../../store'
import ANSWERS from '../../utils/answers'

const backHome = () => {
  uni.navigateBack({
    delta: 1
  })
}

const mainStore = useMainStore()

const versionName = ref(__VERSION__)

let count = 0

const onClickTitle = () => {
  if (!mainStore.enableAd) return
  if (++count >= 10) {
    mainStore.enableAd = false
  }
}
</script>

<template>
  <view class="help">
    <view class="content">
      <view class="title" @click="onClickTitle">汉兜猜词</view>
      <view class="subtitle">汉字版 Wordle 成语猜词小程序 v{{versionName}}</view>
      <view class="subtitle"><text user-select>https://github.com/toyobayashi/mp-handle</text></view>
      <view class="subtitle">本小程序为汉兜的社区延伸版本</view>
      <view class="subtitle">与原汉兜游戏并无直接关联</view>
      <view class="subtitle">原仓库链接：<text user-select>https://github.com/antfu/handle</text></view>
      <view class="subtitle">原游戏链接：<text user-select>https://handle.antfu.me</text></view>
      <view class="subtitle">感谢原作者：Anthony 与 Inès</view>
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
      <view class="p">题目数量是有限的，你可能会遇到相同的题目</view>
      <view class="p">现有题目数量：{{ANSWERS.length}}</view>
      <view class="p">如果你想要添加更多题目，可以访问本页顶部的小程序代码仓库地址，打开新的 Issue 或 Pull request。期待你的贡献。</view>
      <GameButton class="backhome" @click="backHome">返回游戏</GameButton>
    </view>
    <view class="ad-container" v-if="mainStore.enableAd">
      <ad unit-id="adunit-010ba33d4a8eb064"></ad>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@use "../../config";

.help {
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: stretch;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16rpx 16rpx 60rpx 16rpx;
    overflow: auto;
    flex: 1;

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

}
</style>
