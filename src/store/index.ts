import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      answerInput: ''
    }
  },
  getters: {
  },
  actions: {
    setAnswerInput (value: string) {
      this.answerInput = value
    }
  }
})
