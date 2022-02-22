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
import { computed, ref } from 'vue'
import KanjiBox from '../../components/KanjiBox.vue'
import GameButton from '../../components/GameButton.vue'
import { useMainStore } from '../../store/index'

const mainStore = useMainStore()
const moreTip = ref(false)

const hintChar = computed(() => mainStore.hintChar)
</script>

<template>
  <view class="tip-page">
    <view class="tip">答案包含以下汉字</view>

    <KanjiBox
      class="kanji"
      :kanji="moreTip ? hintChar.kanji : '?'"
      :result="false"
      :kanjiStatus="0"
      :seichou="hintChar.seichou"
      :seichouStatus="0"
      :seibo="hintChar.seibo"
      :seiboStatus="0"
      :inbo="hintChar.inbo"
      :inboStatus="0" />
    
    <GameButton class="tipbtn" v-if="!moreTip" @click="moreTip = true">进一步提示</GameButton>
  </view>
</template>

<style lang="scss" scoped>
@use '../../config';

.tip-page {
  padding: 16rpx;
  display: flex;
  height: calc(100vh - 32rpx);
  flex-direction: column;
  align-items: center;

  .tip {
    margin-bottom: 32rpx;
  }

  .tipbtn {
    margin-top: 32rpx;
  }
}
</style>
