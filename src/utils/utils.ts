import { polyphones, idiomList } from './idioms'

const _answerRegEx = /^[\u4e00-\u9fa5]{4}$/

export function isFourCharWord (word: string) {
  return _answerRegEx.test(word)
}

export function isFourCharWordInDict (word: string) {
  return (word in polyphones) || (idiomList.indexOf(word) !== -1)
}
