<script setup lang="ts">
import { computed } from 'vue'
import KanjiBox from './KanjiBox.vue'
import { parsePinyin, getPinyin, parseAnswer, testAnswer } from '../utils/pinyin'
import type { Props as KanjiBoxProps } from './KanjiBox.vue'
import { useMainStore } from '../store'

const mainStore = useMainStore()

interface Props {
  word: string
  result: boolean
  answer?: string
}

const props = withDefaults(defineProps<Props>(), {
  result: false,
  answer: ''
})

const answer = computed(() => {
  if (props.answer) {
    return parseAnswer(props.answer)
  }
  return mainStore.parsedAnswer
})

const data = computed<KanjiBoxProps[]>(() => {
  if (!props.word) {
    return []
  }

  const word = props.word.trim().split('').filter(c => /[\u4e00-\u9fa5]/.test(c)).join('').substring(0, 4)
  const pinyinArr = word
    ? getPinyin(word).map(parsePinyin)
    : []

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

  const result = testAnswer(res, answer.value)
  for (let i = 0; i < result.length; ++i) {
    res[i].kanjiStatus = result[i].kanji
    res[i].seichouStatus = result[i].seichou
    res[i].seiboStatus = result[i].seibo
    res[i].inboStatus = result[i].inbo
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
