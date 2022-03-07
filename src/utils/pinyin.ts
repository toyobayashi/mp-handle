import pinyin from 'pinyin'
import { polyphones, idiomList } from './idioms'

export const pinyinInitials = 'b p m f d t n l g k h j q r x w y zh ch sh z c s'.split(/\s/g)

export const pinyinFinals = 'a o e ai ei ao ou an en ang eng ong er i ia io ie iao iu ian in iang ing iong u ua uo uai ui uan un uang ueng v ve van vn'
  .split(/\s/g)
  .sort((a, b) => {
    const i = a.length - b.length
    if (i === 0)
      return a.localeCompare(b)
    return i
  })

export function parsePinyin (pinyin: string): [string, string, 0 | 1 | 2 | 3 | 4] {
  if (!pinyin) return ['', '', 0]
  let rest = pinyin
  const one = pinyinInitials.find(i => (rest.indexOf(i) === 0))
  if (one)
    rest = rest.substring(one.length)
  const last = Number(rest.charAt(rest.length - 1)) as 0 | 1 | 2 | 3 | 4
  if (!Number.isNaN(last)) {
    return [one ?? '', rest.substring(0, rest.length - 1), last]
  }
  return [one ?? '', rest, 0]
}

export function getIdiom (word: string): [string, string | undefined] | undefined {
  if (word in polyphones)
    return [word, polyphones[word as keyof typeof polyphones]]
  if (idiomList.indexOf(word) !== -1)
    return [word, undefined]
  return undefined
}

export function getPinyin (word: string): string[] {
  const data = getIdiom(word)
  const originalPinyin = (data && data[1])
    ? data[1].split(/\s+/g)
    : pinyin(word, { style: pinyin.STYLE_TONE2 }).map(i => i[0])
  return originalPinyin.map(i => i.replace(/^(y|j|q|x)u([0-9]?)$/g, '$1v$2'))
}

export interface ParsedChar {
  kanji: string;
  seibo: string;
  inbo: string;
  seichou: 0 | 1 | 2 | 3 | 4;
}

export function parseAnswer (word: string): ParsedChar[] {
  return getPinyin(word).map(parsePinyin).map(([seibo, inbo, seichou], index) => {
    return {
      kanji: word.charAt(index),
      seibo,
      inbo,
      seichou
    }
  })
}

export interface MatchResult {
  kanji: 0 | 1 | 2
  seibo: 0 | 1 | 2
  inbo: 0 | 1 | 2
  seichou: 0 | 1 | 2
}

function includesAndRemove<T>(arr: T[], v: T) {
  const index = arr.indexOf(v)
  if (index !== -1) {
    arr.splice(index, 1)
    return true
  }
  return false
}

export function testAnswer (input: ParsedChar[], expect: ParsedChar[]): MatchResult[] {
  const unmatched = {
    kanji: expect.map((a, i) => a.kanji === input[i].kanji ? undefined : a.kanji),
    seichou: expect.map((a, i) => a.seichou === input[i].seichou ? undefined : a.seichou),
    seibo: expect.map((a, i) => a.seibo === input[i].seibo ? undefined : a.seibo),
    inbo: expect.map((a, i) => a.inbo === input[i].inbo ? undefined : a.inbo),
  }

  return input.map<MatchResult>((i, n) => {
    return {
      kanji: expect[n].kanji === i.kanji ? 2 : includesAndRemove(unmatched.kanji, i.kanji) ? 1 : 0,
      seibo: expect[n].seibo === i.seibo ? 2 : includesAndRemove(unmatched.seibo, i.seibo) ? 1 : 0,
      inbo: expect[n].inbo === i.inbo ? 2 : includesAndRemove(unmatched.inbo, i.inbo) ? 1 : 0,
      seichou: expect[n].seichou === i.seichou ? 2 : includesAndRemove(unmatched.seichou, i.seichou) ? 1 : 0
    }
  })
}
