import IDIOMS from './idioms'
import pinyin from 'pinyin'

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

export function getPinyin (word: string): string[] {
  const data = IDIOMS.find(d => d[0] === word)
  if (data && data[1])
    return data[1].split(/\s+/g)
  return pinyin(word, { style: pinyin.STYLE_TONE2 }).map(i => i[0])
}
