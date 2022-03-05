import { onLoad, onUnload } from '@dcloudio/uni-app'
import { ref } from 'vue'

export function useInterstitialAd (id: string) {
  const ad = ref<UniApp.InterstitialAdContext | null>(null)

  let _resolve: (ad: UniApp.InterstitialAdContext) => void

  const whenReady = new Promise<UniApp.InterstitialAdContext>((resolve) => {
    _resolve = resolve
  })

  onLoad(() => {
    if (uni.createInterstitialAd) {
      ad.value = uni.createInterstitialAd({
        adUnitId: id
      })
      ad.value.onLoad(() => {
        _resolve(ad.value!)
      })
      ad.value.onError((err) => {
        console.log(err)
      })
      ad.value.onClose(() => {});
    }
  })

  onUnload(() => {
    ad.value = null
  })

  return whenReady
}
