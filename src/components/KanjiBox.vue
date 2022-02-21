<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  result: boolean
  kanji: string
  kanjiStatus: 0 | 1 | 2
  seichou: 0 | 1 | 2 | 3 | 4
  seichouStatus: 0 | 1 | 2
  seibo: string
  seiboStatus: 0 | 1 | 2
  inbo: string
  inboStatus: 0 | 1 | 2
}

const props = withDefaults(defineProps<Props>(), {
  result: false
})

const useStatusClass = (prop: keyof Props) => {
  return computed(() => {
    return {
      mis: props.result && props[prop] === 1,
      yes: props.result && props[prop] === 2,
      err: props.result && props[prop] === 0
    }
  })
}

const seiboClass = useStatusClass('seiboStatus')
const inboClass = useStatusClass('inboStatus')
const seichouClass = useStatusClass('seichouStatus')
const kanjiClass = useStatusClass('kanjiStatus')

</script>

<template>
<view class="kanji-box" :class="{ ok: props.result && props.kanjiStatus === 2, no: props.result && props.kanjiStatus !== 2 }">
  <view class="pinyin">
    <text class="seibo" :class="seiboClass">{{props.kanji ? props.seibo : ''}}</text>
    <text class="inbo" :class="inboClass">{{props.kanji ? props.inbo : ''}}</text>
    <text class="seichou" :class="seichouClass">{{props.kanji ? props.seichou : ''}}</text>
  </view>
  <view class="kanji" :class="kanjiClass">{{props.kanji}}</view>
</view>
</template>

<style lang="scss" scoped>
.kanji-box {
  border: 4rpx solid #F0F1F2;
  padding: 0 0 8rpx 0;
  display: inline-flex;
  width: 166rpx;
  height: 166rpx;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  &.ok {
    color: #fff !important;
    background-color: #1d9c9c;
    border: 4rpx solid #1d9c9c;
  }

  &.no {
    background-color: #F0F1F2;
    .yes {
      color: #1d9c9c;
    }

    .mis {
      color: #de7525;
    }

    .err {
      color: rgb(55,65,81);
      opacity: 0.4;
    }
  }

  .pinyin {
    font-size: 26rpx;

    .seibo {
      display: inline-block;
      height: 26rpx;
      line-height: 26rpx;
    }

    .seichou {
      margin-left: 8rpx;
      display: inline-block;
      height: 26rpx;
      line-height: 26rpx;
    }

    .inbo {
      margin-left: 4rpx;
      display: inline-block;
      height: 26rpx;
      line-height: 26rpx;
    }
  }

  .kanji {
    font-size: 48rpx;
    display: inline-block;
    height: 48rpx;
    line-height: 48rpx;
    &.err {
      opacity: 0.8;
    }
  }
}
</style>
