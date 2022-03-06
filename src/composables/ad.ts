import { onLoad, onUnload } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useMainStore } from '../store'
import { deferred } from '../utils/deferred'

export function useInterstitialAd (id: string) {
  const mainStore = useMainStore()
  const ad = ref<UniApp.InterstitialAdContext | null>(null)

  const adWhenReady = ref(deferred<UniApp.InterstitialAdContext>())

  let userOnClose: (() => void) | undefined

  onLoad(() => {
    if (uni.createInterstitialAd) {
      ad.value = uni.createInterstitialAd({
        adUnitId: id
      })
      ad.value.onLoad(() => {
        adWhenReady.value.resolve(ad.value!)
      })
      ad.value.onError((err) => {
        adWhenReady.value.reject(err)
      })
      ad.value.onClose(() => {
        adWhenReady.value = deferred<UniApp.InterstitialAdContext>()
        if (typeof userOnClose === 'function') {
          const f = userOnClose
          userOnClose = undefined
          f()
        }
      });
    } else {
      adWhenReady.value.reject(new Error('createInterstitialAd is not supported'))
    }
  })

  onUnload(() => {
    ad.value = null
  })

  const show = (onClose?: () => void) => {
    if (!mainStore.enableAd) return Promise.reject()
    userOnClose = onClose
    return adWhenReady.value.then((ad) => ad.show())
  }

  return {
    ad,
    adWhenReady,
    show
  }
}
