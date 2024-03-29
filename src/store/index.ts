import { defineStore } from 'pinia'
import { answerList, lastQuestion } from '../composables/storage'
import { tries } from '../utils/try'
import ANSWERS from '../utils/answers'
import { MAX_TRIES, PLATFORM } from '../utils/constants'
import { parseAnswer, ParsedChar } from '../utils/pinyin'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      answerInput: '',
      answer: ANSWERS[Math.floor(Math.random() * ANSWERS.length)],
      gameState: 0 as -1 | 0 | 1,
      hintLevel: 0 as 0 | 1 | 2,
      enableAd: true,
      sharedAnswer: null as [string, string] | null
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
    hintChar (state): ParsedChar {
      let index: number
      if (state.answer[1]) {
        index = state.answer[0].indexOf(state.answer[1])
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
    resetAnswer (answer?: [string, string]): [string, string] {
      if (answer) {
        this.answer = answer
        return [...answer]
      }
      const index = ANSWERS.indexOf(this.answer)
      let newIndex: number
      do {
        newIndex = Math.floor(Math.random() * ANSWERS.length)
      } while (newIndex === index)
      this.answer = ANSWERS[newIndex]
      return [this.answer[0], this.hintChar.kanji]
    },
    startGame (answer?: [string, string], continueLastGame?: boolean) {
      this.setAnswerInput('')
      answerList.value = []
      this.hintLevel = 0
      const realAnswer = this.resetAnswer(answer)
      if (!continueLastGame) {
        lastQuestion.value = {
          answer: realAnswer,
          tries: []
        }
      }
      this.gameState = 0
      if (PLATFORM === 'devtools') {
        console.log(this.answerWord)
      }
      const latestTry = tries.getTheLast()
      if (!latestTry || 'end' in latestTry) {
        tries.push({
          tries: continueLastGame ? lastQuestion.value!.tries.length : 0,
          start: Date.now() // TODO
        })
      } else {
        tries.pop()
        tries.push({
          tries: continueLastGame ? lastQuestion.value!.tries.length : 0,
          start: Date.now() // TODO
        })
      }
    },
    confirmAnswer () {
      if (this.answerInput === '') return 0
      answerList.value.unshift(this.answerInput)
      this.setAnswerInput('')
      const currentTry = tries.getTheLast()
      if (currentTry) {
        currentTry.tries++
      }

      if (answerList.value[0] === this.answerWord) {
        currentTry!.end = Date.now()
        currentTry!.passed = true
        this.gameState = 1
        lastQuestion.value = null
        return this.gameState
      }

      if (answerList.value.length >= MAX_TRIES) {
        currentTry!.end = Date.now()
        currentTry!.passed = false
        this.gameState = -1
        lastQuestion.value = null
        return this.gameState
      }

      if (lastQuestion.value) {
        lastQuestion.value.tries = [...answerList.value]
      }

      return 0
    }
  }
})
