import _polyphones from '../data/polyphones.json'
import _idiomList from '../data/idioms.json'

const _answerRegEx = /^[\u4e00-\u9fa5]{4}$/

export function isFourCharWord (word: string) {
  return _answerRegEx.test(word)
}

export function isFourCharWordInDict (word: string) {
  return (word in _polyphones) || (_idiomList.indexOf(word) !== -1)
}
