<script lang="ts">
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
import { useMainStore } from '../../store/index'
import AnswerInput from '../../components/AnswerInput.vue'
import WordLine from '../../components/WordLine.vue'
import { answerList, firstVisit, lastQuestion } from '../../composables/storage'
import { onLoad, onReady } from '@dcloudio/uni-app'
import { MAX_TRIES } from '../../utils/constants'
import { computed } from 'vue'
import { checkUpdate } from '../../utils/update'
import { useInterstitialAd } from '../../composables/ad'
// import AdDialog from '../../components/AdDialog.vue'

const mainStore = useMainStore()

const { show: showCorrectAd } = useInterstitialAd('adunit-435472d324d4c2ba')
const { show: showErrorAd } = useInterstitialAd('adunit-b647e800fda3c790')

const resultPrefix = computed(() => {
  switch (mainStore.gameState) {
    case 0: return ''
    case 1: return '恭喜答对正确答案：'
    case -1: return '很遗憾，正确答案是：'
    default: return ''
  }
})

onLoad((options) => {
  if (options.answer) {
    const answerFromQuery = options.answer
    const word = answerFromQuery.substring(0, answerFromQuery.length - 1)
    mainStore.sharedAnswer = [word, word.charAt(Number(answerFromQuery.charAt(answerFromQuery.length - 1)))]
  }
})

onReady(() => {
  const tip = '首次输入任意四字词语，根据汉字和拼音提示，再进一步猜出正确答案\n\n具体规则点击左上方问号，查看提示点击左上方灯泡'
  if (mainStore.sharedAnswer) {
    const sharedAnswer = mainStore.sharedAnswer
    uni.showModal({
      title: '提示',
      content: '你的好友为你出了一道题。\n\n' + tip,
      showCancel: false,
      complete: () => {
        mainStore.startGame(sharedAnswer)
        checkUpdate()
      }
    })
  } else {
    if (firstVisit.value) {
      firstVisit.value = false
      uni.showModal({
        title: '玩法提示',
        content: '欢迎使用汉兜猜词小程序！\n\n' + tip,
        showCancel: false,
        complete: () => {
          mainStore.startGame()
          checkUpdate()
        }
      })
    } else {
      if (lastQuestion.value && lastQuestion.value.tries.length > 0) {
        uni.showModal({
          title: '提示',
          content: '您有进行中的答题，是否继续完成上次的题目？',
          confirmText: '继续上次',
          cancelText: '新来一题',
          success: (res) => {
            if (res.confirm) {
              mainStore.startGame(lastQuestion.value!.answer, true)
              lastQuestion.value!.tries.forEach((input) => {
                answerList.value.unshift(input)
              })
            } else {
              mainStore.startGame()
              checkUpdate()
            }
          }
        })
      } else {
        mainStore.startGame()
        checkUpdate()
      }
    }
  }
})

const leftChance = computed(() => {
  return MAX_TRIES - answerList.value.length
})

const showAnswer = () => {
  uni.showModal({
    title: '提示',
    content: '确认要展示答案吗？',
    confirmText: '确定',
    cancelText: '再想想',
    success: (res) => {
      if (res.confirm) {
        mainStore.setAnswerInput('')
        mainStore.gameState = -1
        lastQuestion.value = null
        answerList.value.unshift(mainStore.answerWord)
        if (mainStore.currentTry) {
          mainStore.currentTry.end = Date.now()
          mainStore.currentTry.passed = false
        }
      }
    }
  })
}

const shareQuestion = () => {
  uni.navigateTo({
    url: '/pages/share/share'
  })
}

const restart = () => {
  mainStore.startGame()
}

const go = () => {
  const result = mainStore.confirmAnswer()
  if (result === 1) {
    uni.showModal({
      title: '提示',
      content: '恭喜你答对了！可点击右上角按钮再来一题',
      showCancel: false,
      // confirmText: '再猜一次',
      // cancelText: '确定',
      complete: () => {
        showCorrectAd()
        // if (res.confirm) {
        //   restart()
        // }
      }
    })
    return
  }

  if (result === -1) {
    uni.showModal({
      title: '提示',
      content: `很遗憾没答对，答案是 ${mainStore.answerWord}。可点击右上角按钮再来一题`,
      showCancel: false,
      // confirmText: '再猜一次',
      // cancelText: '确定',
      // success: (res) => {
      //   if (res.confirm) {
      //     restart()
      //   }
      // }
      complete: () => {
        showErrorAd()
      }
    })
  }
}

</script>

<template>
  <view class="index-page">
    <view class="content">
      <view>
        <AnswerInput @restart="restart" @submit="go" />
        <template v-if="!mainStore.gameOver">
          <view class="tipline">
            <text class="left-chance">剩余 {{leftChance}} 次机会</text>
            <text class="show-answer" @click="shareQuestion">给好友出题</text>
            <text class="show-answer" @click="showAnswer">展示答案</text>
          </view>
          <WordLine :word="mainStore.$state.answerInput" :result="false" />
        </template>
        <text class="the-answer" v-else>{{resultPrefix}}{{mainStore.answerWord}}</text>
      </view>
      <view class="answers">
        <WordLine v-for="(line, index) in answerList" :key="line + index" :word="line" result />
      </view>
    </view>
    <view class="ad-container">
      <ad unit-id="adunit-531b04844930193d"></ad>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@use '../../config';

.index-page {
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: stretch;

  .content {
    padding: 16rpx;
    display: flex;
    height: calc(100vh - 32rpx);
    flex-direction: column;
    align-items: stretch;
    overflow: auto;
    flex: 1;

    .the-answer {
      display: block;
      text-align: center;
      font-size: 32rpx;
      height: 60rpx;
      line-height: 60rpx;
      margin-top: 8rpx;
      color: config.$theme-matched;
    }

    .answers {
      flex: 1;
      overflow: auto;
    }

    .tipline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8rpx;

      .left-chance {
        opacity: 0.5;
        color: rgb(55,65,81);
        height: 60rpx;
        line-height: 60rpx;
      }
      .show-answer {
        text-decoration: underline;
        color: config.$theme-matched;
        height: 60rpx;
        line-height: 60rpx;
      }
    }
  }
}

</style>
