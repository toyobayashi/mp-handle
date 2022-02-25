import { defineStore } from 'pinia'
import { answerList, tries } from '../composables/storage'
import type { Try } from '../composables/storage'
import ANSWERS from '../utils/answers'
import { MAX_TRIES, PLATFORM } from '../utils/constants'
import { parseAnswer, ParsedChar } from '../utils/pinyin'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      answerInput: '',
      answer: ANSWERS[Math.floor(Math.random() * ANSWERS.length)]
    }
  },
  getters: {
    gameOver (state) {
      return answerList.value.length >= MAX_TRIES || answerList.value[0] === state.answer[0] 
    },
    answerWord (state) {
      return state.answer[0]
    },
    parsedAnswer (state) {
      return parseAnswer(state.answer[0])
    },
    hintChar (): ParsedChar {
      let index: number
      if (this.answer[1]) {
        index = this.answer[0].indexOf(this.answer[1])
      } else {
        index = Math.floor(Math.random() * this.parsedAnswer.length)
      }
      return this.parsedAnswer[index]
    },
    currentTry (): Try | undefined {
      return tries.value[tries.value.length - 1]
    }
  },
  actions: {
    setAnswerInput (value: string) {
      this.answerInput = value
    },
    resetAnswer () {
      const index = ANSWERS.indexOf(this.answer)
      let newIndex: number
      do {
        newIndex = Math.floor(Math.random() * ANSWERS.length)
      } while (newIndex === index)
      this.answer = ANSWERS[newIndex]
    },
    startGame () {
      this.setAnswerInput('')
      answerList.value = []
      this.resetAnswer()
      if (PLATFORM === 'devtools') {
        console.log(this.answerWord)
      }
      const latestTry = tries.value[tries.value.length - 1]
      if (!latestTry || 'end' in latestTry) {
        tries.value.push({
          tries: 0,
          start: Date.now()
        })
      } else {
        tries.value.pop()
        tries.value.push({
          tries: 0,
          start: Date.now()
        })
      }
    },
    confirmAnswer () {
      answerList.value.unshift(this.answerInput)
      this.setAnswerInput('')
      if (this.currentTry) {
        this.currentTry.tries++
      }

      if (answerList.value[0] === this.answerWord) {
        this.currentTry!.end = Date.now()
        this.currentTry!.passed = true
        return 1
      }

      if (answerList.value.length >= MAX_TRIES) {
        this.currentTry!.end = Date.now()
        this.currentTry!.passed = false
        return -1
      }

      return 0
    }
  }
})
