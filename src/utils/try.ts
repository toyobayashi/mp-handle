import { Ref } from "vue"
import { useStorage } from "../composables/storage"

export interface Try {
  tries: number
  start: number
  end?: number
  hint?: boolean
  passed?: boolean
}

export class Tries {
  private _refs: Array<Ref<Try[]>> = []

  public static MAX = 5000

  constructor () {
    let ref: Ref<Try[]>
    let num = 0

    do {
      ref = useStorage<Try[]>(`hd_tries${num === 0 ? '' : ('_' + num)}`, [])
      this._refs.push(ref)
    } while (ref.value.length >= Tries.MAX)
  }

  clear () {
    if (this._refs.length) {
      const lastTries = this._refs[this._refs.length - 1]
      const theLast = lastTries.value[lastTries.value.length - 1]
      for (let i = 0; i < this._refs.length; ++i) {
        this._refs[i].value.length = 0
        this._refs[i].value = undefined!
      }
      this._refs.length = 0
      const newCreated = useStorage<Try[]>('hd_tries', [])
      if (!('end' in theLast)) {
        newCreated.value.push(theLast)
      }
      this._refs.push(newCreated)
    }
  }

  push (value: Try): void {
    if (this._refs.length) {
      const lastTries = this._refs[this._refs.length - 1]
      if (lastTries.value.length >= Tries.MAX) {
        const newCreated = useStorage<Try[]>(`hd_tries_${this._refs.length}`, [])
        newCreated.value.push(value)
        this._refs.push(newCreated)
      } else {
        lastTries.value.push(value)
      }
    } else {
      const newCreated = useStorage<Try[]>('hd_tries', [])
      newCreated.value.push(value)
      this._refs.push(newCreated)
    }
  }

  pop (): Try | undefined {
    if (!this._refs.length) return undefined
    while (this._refs.length > 0) {
      const lastTries = this._refs[this._refs.length - 1]
      if (lastTries.value.length === 0) {
        this._refs.pop()
      } else {
        return lastTries.value.pop()
      }
    }
  }

  filter (fn: (value: Try) => any): Try[] {
    const result: Try[] = []
    for (let i = 0; i < this._refs.length; ++i) {
      for (let j = 0; j < this._refs[i].value.length; ++j) {
        if (fn(this._refs[i].value[j])) {
          result.push(this._refs[i].value[j])
        }
      }
    }
    return result
  }

  getTheLast (): Try | undefined {
    if (!this._refs.length) return undefined
    const lastTries = this._refs[this._refs.length - 1]
    return lastTries.value[lastTries.value.length - 1]
  }
}

export const tries = new Tries()
