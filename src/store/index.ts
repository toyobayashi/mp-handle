import { defineStore } from 'pinia'
import { answerList } from '../composables/storage'
import ANSWERS from '../utils/answers'
import { MAX_TRIES } from '../utils/constants'
import { getPinyin, parsePinyin } from '../utils/pinyin'

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
      return getPinyin(state.answer[0]).map(parsePinyin).map(([seibo, inbo, seichou], index) => {
        return {
          kanji: state.answer[0].charAt(index),
          seibo,
          inbo,
          seichou
        }
      })
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
