import IDIOMS from './idioms'

const _answerRegEx = /^[\u4e00-\u9fa5]{4}$/

export function isFourCharWord (word: string) {
  return _answerRegEx.test(word)
}

export function isFourCharWordInDict (word: string) {
  return IDIOMS.filter(item => item[0] === word).length > 0
}
