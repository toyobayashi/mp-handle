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
import { computed } from 'vue'
import KanjiBox from '../../components/KanjiBox.vue'
import GameButton from '../../components/GameButton.vue'
import { useMainStore } from '../../store/index'
import { answerList } from '../../composables/storage'
import { getPinyin, parsePinyin, testAnswer, pinyinInitials, pinyinFinals } from '../../utils/pinyin'
import type { Props as KanjiBoxProps } from '../../components/KanjiBox.vue'
import { useInterstitialAd } from '../../composables/ad'
import { onReady } from '@dcloudio/uni-app'

const mainStore = useMainStore()

const { show } = useInterstitialAd('adunit-99126356b2a2e3a5')

onReady(() => {
  show().catch((err) => {
    console.error(err)
  })
})

const hintLevel = computed(() => mainStore.hintLevel)

const hintChar = computed(() => mainStore.hintChar)

const sheet = computed(() => {
  if (hintLevel.value < 2) {
    return {
      seiboMap: {},
      inboMap: {}
    }
  }
  const list = answerList.value.map(word => {
    const pinyinArr = getPinyin(word).map(parsePinyin)
  
    const res = word.split('').map<KanjiBoxProps>((kanji, index) => {
      const [seibo, inbo, seichou] = pinyinArr[index]
      return {
        kanji,
        kanjiStatus: 0,
        seichou,
        seichouStatus: 0,
        seibo,
        seiboStatus: 0,
        inbo,
        inboStatus: 0
      }
    })
  
    const result = testAnswer(res, mainStore.parsedAnswer)
    for (let i = 0; i < result.length; ++i) {
      res[i].kanjiStatus = result[i].kanji
      res[i].seichouStatus = result[i].seichou
      res[i].seiboStatus = result[i].seibo
      res[i].inboStatus = result[i].inbo
    }

    return res
  })

  const seiboMap: Record<string, number> = {}
  pinyinInitials.forEach(s => {
    seiboMap[s] = 0
  })

  const inboMap: Record<string, number> = {}
  pinyinFinals.forEach(s => {
    inboMap[s] = 0
  })

  list.forEach(line => {
    for (let i = 0; i < line.length; ++i) {
      if (line[i].seiboStatus === 2) {
        seiboMap[line[i].seibo] = 2
      } else if (line[i].seiboStatus === 1) {
        if (seiboMap[line[i].seibo] < 2) seiboMap[line[i].seibo] = 1
      } else {
        if (seiboMap[line[i].seibo] === 0) seiboMap[line[i].seibo] = -1
      }

      if (line[i].inboStatus === 2) {
        inboMap[line[i].inbo] = 2
      } else if (line[i].inboStatus === 1) {
        if (inboMap[line[i].inbo] < 2) inboMap[line[i].inbo] = 1
      } else {
        if (inboMap[line[i].inbo] === 0) inboMap[line[i].inbo] = -1
      }
    }
  })

  return {
    seiboMap,
    inboMap
  }
})
</script>

<template>
  <view class="tip-page">
    <view class="ad-container" v-if="mainStore.enableAd">
      <custom-ad unit-id="adunit-a08b8a80b07f3e37"></custom-ad>
    </view>
    <view class="content">
      <view class="tip">答案包含以下汉字</view>
  
      <KanjiBox
        class="kanji"
        :kanji="hintLevel > 0 ? hintChar.kanji : '?'"
        :result="false"
        :kanjiStatus="0"
        :seichou="hintChar.seichou"
        :seichouStatus="0"
        :seibo="hintChar.seibo"
        :seiboStatus="0"
        :inbo="hintChar.inbo"
        :inboStatus="0" />
      
      <GameButton class="tipbtn" v-if="hintLevel === 0" @click="mainStore.hintLevel = 1">进一步提示</GameButton>
      <GameButton class="tipbtn" v-else-if="hintLevel === 1" @click="mainStore.hintLevel = 2">查看拼音表</GameButton>
  
      <view class="sheet" v-if="hintLevel === 2">
        <view class="seibo-sheet">
          <view class="sheet-item" :class="{ mis: status === 1, ok: status === 2, no: status === -1 }" v-for="(status, seibo) in sheet.seiboMap" :key="seibo">{{seibo}}</view>
        </view>
        <view class="inbo-sheet">
          <view class="sheet-item" :class="{ mis: status === 1, ok: status === 2, no: status === -1 }" v-for="(status, inbo) in sheet.inboMap" :key="inbo">{{inbo.replace('v', 'ü')}}</view>
        </view>
      </view>
    </view>
    <view class="ad-container" v-if="mainStore.enableAd">
      <ad unit-id="adunit-838da8166c0d92b9"></ad>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@use '../../config';

.tip-page {
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

    .tip {
      margin-bottom: 32rpx;
    }
  
    .tipbtn {
      margin: 32rpx 0;
    }
  
    .sheet {
      display: flex;
      width: 100%;
      justify-content: space-between;
      flex-direction: row;
      align-items: flex-start;
      margin-top: 32rpx;

      .seibo-sheet {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
      }
      .inbo-sheet {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
      }
  
      .sheet-item {
        display: flex;
        width: 25%;
        height: 48rpx;
        line-height: 48rpx;
        justify-content: center;
        align-items: center;
        // min-height: 40rpx;
        text-align: center;
        flex-shrink: 0;
        &.mis {
          color: config.$theme-orange;
          font-weight: bold;
        }
        &.ok {
          color: config.$theme-matched;
          font-weight: bold;
        }
        &.no {
          opacity: 0.3;
        }
      }
    }
  }

}
</style>
