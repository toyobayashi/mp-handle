Component({
  properties: {
    unitId: {
      type: String
    },
    adIntervals: {
      type: Number
    }
  },
  methods: {
    onAdError (e) {
      this.triggerEvent('error', e)
    },
    onAdLoad (e) {
      this.triggerEvent('load', e)
    }
  }
})
