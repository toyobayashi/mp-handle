const sys = uni.getSystemInfoSync()

export const MAX_TRIES = 10
export const PLATFORM = sys.platform
export const STATUS_BAR_HEIGHT = sys.statusBarHeight ?? 0
