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
import { answerList } from '../../composables/storage'
import { getPinyin, parsePinyin, testAnswer, pinyinInitials, pinyinFinals } from '../../utils/pinyin'
import type { Props as KanjiBoxProps } from '../../components/KanjiBox.vue'

const mainStore = useMainStore()
const moreTip = ref(false)

const hintChar = computed(() => mainStore.hintChar)

const sheet = computed(() => {
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

  const seiboMap: any = {}
  pinyinInitials.forEach(s => {
    seiboMap[s] = 0
  })

  const inboMap: any = {}
  pinyinFinals.forEach(s => {
    inboMap[s] = 0
  })

  list.forEach(line => {
    for (let i = 0; i < line.length; ++i) {
      if (line[i].seiboStatus === 2) {
        seiboMap[line[i].seibo] = 2
      } else if (line[i].seiboStatus === 1) {
        if (seiboMap[line[i].seibo] < 2) seiboMap[line[i].seibo] = 1
      }

      if (line[i].inboStatus === 2) {
        inboMap[line[i].inbo] = 2
      } else if (line[i].inboStatus === 1) {
        if (inboMap[line[i].inbo] < 2) inboMap[line[i].inbo] = 1
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
    <GameButton class="tipbtn" v-else @click="moreTip = false">遮挡</GameButton>

    <view class="sheet">
      <view class="seibo-sheet">
        <view class="sheet-item" :class="{ mis: status === 1, ok: status === 2, no: status === 0 }" v-for="(status, seibo) in sheet.seiboMap" :key="seibo">{{seibo}}</view>
      </view>
      <view class="inbo-sheet">
        <view class="sheet-item" :class="{ mis: status === 1, ok: status === 2, no: status === 0 }" v-for="(status, inbo) in sheet.inboMap" :key="inbo">{{inbo}}</view>
      </view>
    </view>
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
    margin: 32rpx 0;
  }

  .sheet {
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-direction: row;
    align-items: flex-start;
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
      width: 50%;
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
        opacity: 0.5;
        color: rgb(55,65,81);
      }
    }
  }
}
</style>