import { ref, watchSyncEffect } from 'vue'
import type { Ref } from 'vue'

export type MaybeRef<T> = T | Ref<T>

export function useStorage<T = any> (key: string, defaultValue?: MaybeRef<T>): Ref<T> {
  const info = uni.getStorageInfoSync();

  let data: Ref<T>

  if (info.keys.indexOf(key) === -1) {
    data = ref(defaultValue) as Ref<T>
  } else {
    let value: T
    try {
      value = JSON.parse(uni.getStorageSync(key))
      data = ref(value) as Ref<T>
    } catch (_) {
      uni.removeStorageSync(key)
      data = ref(defaultValue) as Ref<T>
    }
  }

  watchSyncEffect(() => {
    if (data.value === undefined) {
      uni.removeStorageSync(key)
    } else {
      uni.setStorageSync(key, JSON.stringify(data.value))
    }
  })

  return data
}

// export const answerList = useStorage<string[]>('hd_answer_list', [])
export const answerList = ref<string[]>([])

export interface Question {
  answer: [string, string]
  tries: string[]
}

export const firstVisit = useStorage<boolean>('hd_first_visit', true)
export const lastQuestion = useStorage<Question | null>('hd_last_question', null)
