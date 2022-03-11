<script lang="ts" setup>

import { ref, computed } from 'vue'
import { tries } from '../utils/try'

const year = ref(new Date().getFullYear())
const month = ref(new Date().getMonth() + 1)

const selectDate = ref<Date>()

const yearAndMonth = computed(() => {
  return `${year.value}年${month.value}月`
})

const days = computed(() => {
  const n = new Date(year.value, month.value, 0).getDate()
  const startTime = new Date(year.value, month.value - 1, 1).getTime()
  const endTime = new Date(year.value, month.value, 1).getTime()
  const filterdTries = tries.filter(t => (('end' in t) && t.end! >= startTime && t.end! < endTime))
  const arr = []
  for (let i = 1; i <= n; ++i) {
    const s = new Date(year.value, month.value - 1, i).getTime()
    const e = new Date(year.value, month.value - 1, i + 1).getTime()
    const item = {
      date: i,
      active: false
    }
    for (let j = 0; j < filterdTries.length; ++j) {
      const _try = filterdTries[j]
      if (_try.end! >= s && _try.end! < e && _try.passed) {
        item.active = true
        break
      }
    }
    arr.push(item)
  }
  return arr
  // return new Date(year.value, month.value, 0).getDate()
})

const firstDay = computed(() => {
  return new Date(year.value, month.value - 1, 1).getDay()
})

const dateClicked = (d: number) => {
  selectDate.value = new Date(year.value, month.value - 1, d)
}

function prev () {
  if (month.value !== 1) {
    --month.value
  } else {
    --year.value
    month.value = 12
  }
}

function next () {
  if (month.value !== 12) {
    ++month.value
  } else {
    ++year.value
    month.value = 1
  }
}

</script>

<template>
<view class="calender">
  <view class="flex-between pagination">
    <text @click="prev">上一月</text>
    <text>{{yearAndMonth}}</text>
    <text @click="next">下一月</text>
  </view>
  <view class="flex-between week"><text>日</text><text>一</text><text>二</text><text>三</text><text>四</text><text>五</text><text>六</text></view>
  <view class="date">
    <text v-for="blank in firstDay" :key="blank + 40"></text>
    <text
      v-for="d in days"
      :key="d.date"
      :class="{
        active: d.active
      }">
      <text class="inner">
        {{d.date}}
      </text>
    </text>
  </view>
</view>
</template>

<style lang="scss" scoped>
@use "../config";

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.calender {
  position: relative;
  width: 566rpx;
  border: 2rpx solid rgb(127, 157, 185);
  box-sizing: border-box;
  font-size: 32rpx;
}
.calender .pagination > text:nth-child(odd) {
  border: 2rpx solid #333;
  padding: 8rpx 24rpx;
}
.calender .week {
  background-color: rgb(189, 235, 239);
}
.calender .week > text {
  display: block;
  width: 80rpx;
  font-size: 32rpx;
  text-align: center;
}
.calender .date {
  display: flex;
  flex-wrap: wrap;
}
.calender .date > text {
  width: 80rpx;
  height: 80rpx;
  padding: 4rpx;
  box-sizing: border-box;
}
.calender .date > text .inner {
  display: flex;
  width: 72rpx;
  height: 72rpx;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  box-sizing: border-box;
}
.calender .date > text.active .inner {
  background-color: config.$theme-color;
  border-radius: 50%;
  color: #fff;
}
</style>