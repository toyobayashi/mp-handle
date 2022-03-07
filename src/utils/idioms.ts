import _polyphones from '../data/polyphones.json'
import _idiomList from '../data/idioms.json'

export const polyphones = _polyphones
export const idiomList = _idiomList

try {
  Object.setPrototypeOf(polyphones, null)
} catch {}
