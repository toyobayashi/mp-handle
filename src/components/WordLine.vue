<script setup lang="ts">
import { computed } from 'vue'
import KanjiBox from './KanjiBox.vue'
import { parsePinyin, getPinyin } from '../utils/pinyin'
import type { Props as KanjiBoxProps } from './KanjiBox.vue'
import { useMainStore } from '../store'

const mainStore = useMainStore()

interface Props {
  word: string
  result: boolean
}

const props = withDefaults(defineProps<Props>(), {
  result: false
})

const answer = computed(() => mainStore.parsedAnswer)

console.log(mainStore.answerWord)

const data = computed<KanjiBoxProps[]>(() => {
  if (!props.word) {
    return []
  }

  const word = props.word.trim().split('').filter(c => /[\u4e00-\u9fa5]/.test(c)).join('').substring(0, 4)
  const pinyinArr = word
    ? getPinyin(word).map(parsePinyin)
    : []
  
  const hit = props.result
    ? ([undefined, undefined, undefined, undefined]).map(() => {
        return {
          kanjiHit: -1,
          seichouHit: -1,
          seiboHit: -1,
          inboHit: -1
        }
      })
    : undefined!
  
  const res = word ? word.split('').map<KanjiBoxProps>((kanji, index) => {
    const [seibo, inbo, seichou] = pinyinArr[index]
    return {
      result: props.result,
      kanji,
      kanjiStatus: 0,
      seichou,
      seichouStatus: 0,
      seibo,
      seiboStatus: 0,
      inbo,
      inboStatus: 0
    }
  }) : []

  if (!props.result) return res

  const unmatched = {
    kanji: answer.value.map(a => a.kanji),
    seichou: answer.value.map(a => a.seichou),
    seibo: answer.value.map(a => a.seibo),
    inbo: answer.value.map(a => a.inbo),
  }

  const misplaced = {
    kanji: [] as [string, number, number][],
    seichou: [] as [number, number, number][],
    seibo: [] as [string, number, number][],
    inbo: [] as [string, number, number][]
  }
  
  const check = (res: any, inputIndex: number, key: any) => {
    const realIndex = (unmatched as any)[key].indexOf(res[inputIndex][key])
    const keyStatus = key + 'Status'
    if (realIndex >= 0) {
      if (inputIndex === realIndex) {
        res[inputIndex][keyStatus] = 2
      } else {
        res[inputIndex][keyStatus] = 1;
        (misplaced as any)[key][inputIndex] = [res[inputIndex][key], realIndex, inputIndex]
      }
      (unmatched as any)[key][realIndex] = undefined!
    } else {
      const obj = (misplaced as any)[key].find((item: any) => item && item[0] === res[inputIndex][key])
      if (obj) {
        const [v, correctIndex, mismatchedIndex] = obj
        if (inputIndex === correctIndex) {
          res[mismatchedIndex][keyStatus] = 0;
          res[inputIndex][keyStatus] = 2;
          (misplaced as any)[key][mismatchedIndex] = undefined!
        }
      }
    }
  }

  for (let i = 0; i < res.length; ++i) {
    check(res, i, 'kanji')
    check(res, i, 'seichou')
    check(res, i, 'seibo')
    check(res, i, 'inbo')
  }

  return res
})

</script>

<template>
<view class="word-line">
  <KanjiBox
    class="kanji"
    :kanji="data[0]?.kanji ?? ''"
    :result="props.result"
    :kanjiStatus="data[0]?.kanjiStatus ?? 0"
    :seichou="data[0]?.seichou ?? 0"
    :seichouStatus="data[0]?.seichouStatus ?? 0"
    :seibo="data[0]?.seibo ?? ''"
    :seiboStatus="data[0]?.seiboStatus ?? 0"
    :inbo="data[0]?.inbo ?? ''"
    :inboStatus="data[0]?.inboStatus ?? 0" />
  <KanjiBox
    class="kanji"
    :kanji="data[1]?.kanji ?? ''"
    :result="props.result"
    :kanjiStatus="data[1]?.kanjiStatus ?? 0"
    :seichou="data[1]?.seichou ?? 0"
    :seichouStatus="data[1]?.seichouStatus ?? 0"
    :seibo="data[1]?.seibo ?? ''"
    :seiboStatus="data[1]?.seiboStatus ?? 0"
    :inbo="data[1]?.inbo ?? ''"
    :inboStatus="data[1]?.inboStatus ?? 0" />
  <KanjiBox
    class="kanji"
    :kanji="data[2]?.kanji ?? ''"
    :result="props.result"
    :kanjiStatus="data[2]?.kanjiStatus ?? 0"
    :seichou="data[2]?.seichou ?? 0"
    :seichouStatus="data[2]?.seichouStatus ?? 0"
    :seibo="data[2]?.seibo ?? ''"
    :seiboStatus="data[2]?.seiboStatus ?? 0"
    :inbo="data[2]?.inbo ?? ''"
    :inboStatus="data[2]?.inboStatus ?? 0" />
  <KanjiBox
    class="kanji"
    :kanji="data[3]?.kanji ?? ''"
    :result="props.result"
    :kanjiStatus="data[3]?.kanjiStatus ?? 0"
    :seichou="data[3]?.seichou ?? 0"
    :seichouStatus="data[3]?.seichouStatus ?? 0"
    :seibo="data[3]?.seibo ?? ''"
    :seiboStatus="data[3]?.seiboStatus ?? 0"
    :inbo="data[3]?.inbo ?? ''"
    :inboStatus="data[3]?.inboStatus ?? 0" />
</view>
</template>

<style lang="scss" scoped>

.word-line {
  margin: 18rpx 0;
  .kanji:not(:first-child) {
    margin-left: 18rpx;
  }
}

</style>
