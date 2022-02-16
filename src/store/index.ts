import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      a: 1
    }
  },
  getters: {
    aa (state) {
      return state.a * 2
    }
  },
  actions: {
    add () {
      this.a++
    }
  }
})
