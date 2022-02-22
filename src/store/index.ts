import { defineStore } from 'pinia'
import { answerList } from '../composables/storage'
import ANSWERS from '../utils/answers'
import { MAX_TRIES } from '../utils/constants'
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
    }
  }
})
