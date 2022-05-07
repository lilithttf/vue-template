import { defineStore } from 'pinia'

export const useUsertore = defineStore('user', {
  state: () => {
    return { token: "" }
  },
  actions: {
    setUserToken(token: string) {
      this.token = token
    },
  },
})

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  actions: {
    increment() {
      this.count++
    },
  },
})

