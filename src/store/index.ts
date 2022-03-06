import { defineStore } from 'pinia'
import { answerList, lastQuestion, tries } from '../composables/storage'
import type { Try } from '../composables/storage'
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
      const latestTry = tries.value[tries.value.length - 1]
      if (!latestTry || 'end' in latestTry) {
        tries.value.push({
          tries: continueLastGame ? lastQuestion.value!.tries.length : 0,
          start: Date.now() // TODO
        })
      } else {
        tries.value.pop()
        tries.value.push({
          tries: continueLastGame ? lastQuestion.value!.tries.length : 0,
          start: Date.now() // TODO
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
        this.gameState = 1
        lastQuestion.value = null
        return this.gameState
      }

      if (answerList.value.length >= MAX_TRIES) {
        this.currentTry!.end = Date.now()
        this.currentTry!.passed = false
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
